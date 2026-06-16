import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import Puppeteer from "puppeteer";


const prisma = new PrismaClient({ adapter });

//VIEW DEVIS

export async function getEstimate(req, res) {

    try {
        const search = req.query.q || "";

        const estimates = await prisma.estimate.findMany({

            where: {
                id_craftman: req.session.craftman,

                // PERMET LA RECHERCHE AU DELA DES AFFICHAGE DES DERNIERS ENREGISTRE
                OR: [
                    {
                        reference: {
                            contains: search,
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
            },
            orderBy: {
                created_at: "desc"
            },
            take: 4
        });
        const formattedEstimate = estimates.map(estimate => ({
            ...estimate,
            created_at_formatted: new Date(estimate.created_at).toLocaleDateString('fr-FR')
        }));

        const clients = await prisma.client.findMany({
            where: {
                id_craftman: req.session.craftman
            }
        });

        const selectedClientId = parseInt(req.query.client);
        const openModal = req.query.new === "1";

        res.render("pages/estimate.twig", {
            title: "Gestion des devis",
            estimates: formattedEstimate,
            clients,
            selectedClientId,
            openModal,
            search,
            currentPage: "estimate"
        });

    } catch (error) {
        console.log(error);
        res.render("pages/estimate.twig", {
            error: "Erreur de l'affichage des devis"
        });
    }


}

// NEW DEVIS

export async function newEstimate(req, res) {
    try {
        const {
            reference,
            tva,
            status_estimate,
            estimateClient,
        } = req.body;


        const estimateData = {
            reference: reference || "DEVIS-SANS-REF",
            tva: parseFloat(tva) || 20,
            status_estimate: status_estimate || "en attente",
            craftman: {
                connect: { id_craftman: req.session.craftman }
            }
        };


        const clientId = parseInt(estimateClient, 10);

        if (estimateClient && !isNaN(clientId)) {
            estimateData.client = {
                connect: { id_client: clientId }
            };
        }
        const estimate = await prisma.estimate.create({
            data: estimateData
        });
        const descriptions = req.body.description
            ? (Array.isArray(req.body.description) ? req.body.description : [req.body.description])
            : [];
        const quantities = req.body.QTY
            ? (Array.isArray(req.body.QTY) ? req.body.QTY : [req.body.QTY])
            : [];
        const unitAmounts = req.body.unitAmount
            ? (Array.isArray(req.body.unitAmount) ? req.body.unitAmount : [req.body.unitAmount])
            : [];

        for (let i = 0; i < descriptions.length; i++) {
            await prisma.estimateLine.create({
                data: {
                    description: descriptions[i],
                    qty: parseFloat(quantities[i]) || 0,
                    unitAmount: parseFloat(unitAmounts[i]) || 0,
                    estimate: {
                        connect: { id_estimate: estimate.id_estimate }
                    }
                }
            });
        }

        return res.redirect("/estimate/list?success=estimate_added");

    } catch (error) {
       

        const clients = await prisma.client.findMany({
            where: { id_craftman: req.session.craftman }
        }).catch(() => []);

        res.render("pages/estimate.twig", {
            error: "Impossible de créer le devis.",
            clients,
            currentPage: "estimate"
        });
    }
}

// VALIDER UN DEVIS

export async function validateEstimate(req, res) {
    try {

        const id_estimate = parseInt(req.params.id);

        await prisma.estimate.update({
            where: {
                id_estimate: id_estimate
            },
            data: {
                status_estimate: "validé"
            }
        });

        return res.redirect("/estimate/list?success=estimate_validated");

    } catch (error) {
        res.redirect("/estimate/list?error=validate_failed")
    }
}


// CREATION DU PDF
export async function generatePDF(req, res) {

    try {

        const estimate = await prisma.estimate.findUnique({

            where: {
                id_estimate: parseInt(req.params.id)
            },

            include: {
                client: true,
                estimateLine: true
            }
        });

        if (!estimate) {
            return res.status(404).send("Devis introuvable");
        }

        let totalHT = 0;

        estimate.estimateLine.forEach(line => {

            line.lineTotal = line.qty * line.unitAmount;

            totalHT += line.lineTotal;
        });

        const montantTVA = totalHT * estimate.tva / 100;

        const totalTTC = totalHT + montantTVA;


        
        const html = await new Promise((resolve, reject) => {

            res.render(
                "pages/pdf-estimate.twig",
                {
                    estimate,
                    totalHT,
                    montantTVA,
                    totalTTC
                },

                (err, html) => {

                    if (err) {
                        reject(err);
                    }

                    resolve(html);
                }
            );
        });

        // Lancement du navigateur Chromium
        const browser = await Puppeteer.launch();

        const page = await browser.newPage();

        // Injection du HTML
        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        // Génération PDF
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        // Headers téléchargement
        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=devis-${estimate.reference}.pdf`
        );

        // Envoi PDF
        res.send(pdf);

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Erreur génération PDF"
        );
    }
}
export async function generatePreview(req, res) {

    try {

        const estimate = await prisma.estimate.findUnique({

            where: {
                id_estimate: parseInt(req.params.id)
            },

            include: {
                client: true,
                estimateLine: true
            }
        });

        if (!estimate) {
            return res.status(404).send("Devis introuvable");
        }

        // CALCUL AUTO DU TOTAL DES LIGNE DU DEVIS

        let totalHT = 0;

        estimate.estimateLine.forEach(line => {

            line.lineTotal = line.qty * line.unitAmount;

            totalHT += line.lineTotal;
        });

        const montantTVA = totalHT * estimate.tva / 100;

        const totalTTC = totalHT + montantTVA;



        res.render("pages/previewEstimate.twig", {
            estimate,
            totalHT,
            montantTVA,
            totalTTC,

        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Erreur preview devis"
        );
    }
}


// GENERATION PDF DEVIS
export async function generatePDFEstimate(req, res) {
    try {
        const estimate = await prisma.estimate.findUnique({
            where: { id_estimate: parseInt(req.params.id) },
            include: {
                client: true,
                estimateLine: true
            }
        });

        if (!estimate) {
            return res.status(404).send("Devis introuvable");
        }

        // RÉCUPÈRE LES INFOS DE L'ARTISAN
        const craftman = await prisma.craftman.findUnique({
            where: { id_craftman: req.session.craftman }
        });

        let totalHT = 0;

        estimate.estimateLine.forEach(line => {
            line.lineTotal = line.qty * line.unitAmount;
            totalHT += line.lineTotal;
        });

        const montantTVA = totalHT * Number(estimate.tva) / 100;
        const totalTTC = totalHT + montantTVA;

        const html = await new Promise((resolve, reject) => {
            res.render(
                "pages/pdf-estimate.twig",
                {
                    estimate,
                    craftman,
                    totalHT,
                    montantTVA,
                    totalTTC
                },
                (err, html) => {
                    if (err) reject(err);
                    resolve(html);
                }
            );
        });

        const browser = await Puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=devis-${estimate.reference}.pdf`
        );

        res.send(pdf);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur génération PDF devis");
    }
}
export async function deleteEstimate(req, res) {
    try {
        const id = parseInt(req.params.id);

        //    SUPP LES LIGNES DU DEVIS
        await prisma.estimateLine.deleteMany({
            where: { id_estimate: id }
        });

        // ENELEVE LA RELATION DEVIS/FACTURE POUR POUVOIR EFFACER LE DEVIS
        await prisma.bill.updateMany({
            where: { id_estimate: id },
            data: { id_estimate: null }
        });


        await prisma.estimate.delete({
            where: { id_estimate: id }
        });

        res.redirect("/estimate/list?success=estimate_deleted");

    } catch (error) {
        res.redirect("/estimate/list?error=delete_failed")
    }
}

// ASSIGNER UN CLIENT DEPUIS LA PAGE DE DEVIS
export async function assignClient(req, res) {
    const estimateId = parseInt(req.params.id);
    const clientId = parseInt(req.body.availableClient)
    try {
        await prisma.estimate.update({
            where: { id_estimate: estimateId },
            data: {
                client: { connect: { id_client: clientId } }
            }
        });
        res.redirect("/estimate/list?success=estimate_assigned")
    } catch (error) {
        res.redirect("/estimate/list?error=assign_failed");
    }

}