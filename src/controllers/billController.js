import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import Puppeteer from "puppeteer";

const prisma = new PrismaClient({ adapter });

// AFFICHAGE DE LA LISTE DES FACTURES
export async function getBill(req, res) {
    try {
        const search = req.query.q || "";

        const bills = await prisma.bill.findMany({
            where: {
                id_craftman: req.session.craftman,
                OR: [
                    {
                        reference: {
                            contains: search
                        }
                    },
                    {
                        client: {
                            firstName: {
                                contains: search
                            }
                        }
                    },
                    {
                        client: {
                            lastName: {
                                contains: search
                            }
                        }
                    }
                ]
            },
            include: {
                client: true,
                billLine: true
            },
            orderBy: {
                created_at: "desc"
            }
        });

        const formattedBills = bills.map(bill => ({
            ...bill,
            created_at_formatted: new Date(bill.created_at).toLocaleDateString("fr-FR")
        }));

        res.render("pages/bill.twig", {
            title: "Gestion des factures",
            bills: formattedBills,
            search,
            currentPage: "bill"
        });

    } catch (error) {
        console.error(error);
        res.render("pages/bill.twig", {
            error: "Erreur lors de l'affichage des factures"
        });
    }
}

// CONVERSION DEVIS -> FACTURE (appelée depuis la page devis)
export async function convertToBill(req, res) {
    try {
        const estimateId = parseInt(req.params.id);

        const estimate = await prisma.estimate.findUnique({
            where: { id_estimate: estimateId },
            include: { estimateLine: true }
        });

        if (!estimate) {
            return res.status(404).send("Devis introuvable");
        }

        // GENERATION REFERENCE FACTURE UNIQUE
        const reference = `FACT-${new Date().getFullYear()}-${Date.now()}`;

        // CREATION DE LA FACTURE
        const bill = await prisma.bill.create({
            data: {
                reference,
                tva: estimate.tva,
                status_bill: "en attente",
                craftman: {
                    connect: { id_craftman: req.session.craftman }
                },
                estimate: {
                    connect: { id_estimate: estimateId }
                },
                // RECUPERE LE CLIENT DU DEVIS SI IL EN A UN
                ...(estimate.id_client && {
                    client: { connect: { id_client: estimate.id_client } }
                })
            }
        });

        // COPIE DES LIGNES DU DEVIS VERS LA FACTURE
        for (const line of estimate.estimateLine) {
            await prisma.billLine.create({
                data: {
                    description: line.description,
                    qty: line.qty,
                    unitAmount: line.unitAmount,
                    bill: { connect: { id_bill: bill.id_bill } }
                }
            });
        }

        // MARQUE LE DEVIS COMME CONVERTI
        await prisma.estimate.update({
            where: { id_estimate: estimateId },
            data: { status_estimate: "converti" }
        });

        res.redirect("/bill/list");

    } catch (error) {
        console.error("Erreur conversion devis → facture :", error);
        res.status(500).send("Erreur lors de la conversion");
    }
}

// MARQUER UNE FACTURE COMME PAYÉE
export async function payBill(req, res) {
    try {
        await prisma.bill.update({
            where: { id_bill: parseInt(req.params.id) },
            data: { status_bill: "payée" }
        });

        res.redirect("/bill/list");

    } catch (error) {
        console.error(error);
        res.redirect("/bill/list");
    }
}

// SUPPRESSION D'UNE FACTURE
export async function deleteBill(req, res) {
    try {
        const id = parseInt(req.params.id);

        // SUPPRIME LES LIGNES D'ABORD
        await prisma.billLine.deleteMany({
            where: { id_bill: id }
        });

        await prisma.bill.delete({
            where: { id_bill: id }
        });

        res.redirect("/bill/list");

    } catch (error) {
        console.error(error);
        res.redirect("/bill/list");
    }
}

// PREVIEW FACTURE
export async function previewBill(req, res) {
    try {
        const bill = await prisma.bill.findUnique({
            where: { id_bill: parseInt(req.params.id) },
            include: {
                client: true,
                billLine: true
            }
        });

        if (!bill) {
            return res.status(404).send("Facture introuvable");
        }

        // RÉCUPÈRE LES INFOS DU CRAFTMAN
        const craftman = await prisma.craftman.findUnique({
            where: { id_craftman: req.session.craftman }
        });

        let totalHT = 0;
        bill.billLine.forEach(line => {
            line.lineTotal = line.qty * line.unitAmount;
            totalHT += line.lineTotal;
        });

        const montantTVA = totalHT * Number(bill.tva) / 100;
        const totalTTC = totalHT + montantTVA;

        res.render("pages/previewBill.twig", {
            bill,
            craftman,
            totalHT,
            montantTVA,
            totalTTC
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur preview facture");
    }
}
// GENERATION PDF FACTURE
export async function generatePDFBill(req, res) {
    try {
        const bill = await prisma.bill.findUnique({
            where: { id_bill: parseInt(req.params.id) },
            include: {
                client: true,
                billLine: true
            }
        });

        if (!bill) {
            return res.status(404).send("Facture introuvable");
        }

        // RÉCUPÈRE LES INFOS DU CRAFTMAN
        const craftman = await prisma.craftman.findUnique({
            where: { id_craftman: req.session.craftman }
        });

        let totalHT = 0;
        bill.billLine.forEach(line => {
            line.lineTotal = line.qty * line.unitAmount;
            totalHT += line.lineTotal;
        });

        const montantTVA = totalHT * Number(bill.tva) / 100;
        const totalTTC = totalHT + montantTVA;

        const html = await new Promise((resolve, reject) => {
            res.render(
                "pages/pdf-bill.twig",
                { bill, craftman, totalHT, montantTVA, totalTTC },
                (err, html) => {
                    if (err) reject(err);
                    resolve(html);
                }
            );
        });

        const browser = await Puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdf = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=facture-${bill.reference}.pdf`);
        res.send(pdf);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur génération PDF facture");
    }
}