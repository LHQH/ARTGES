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

                // PERMET LA RECHERCHE AU DELA DES AFFICHAGE DEs DERNIERS ENREGISTRE
                OR: [
                    {
                        reference: {
                            contains: search,
                        }
                    },
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
        res.render("pages/estimate.twig", {
            title: "Gestion des devis",
            estimates: formattedEstimate,
            clients,
            search,
            currentPage: "estimate"
        })
    } catch (error) {
        console.log(error);
        res.render("pages/estimate.twig", {
            error: "Erreur de l'affichage des devis"
        });
    }


}

// NEW DEVIS
// export async function newEstimate(req, res) {
//     try {
//         const {
//             reference,
//             tva,
//             status_estimate,
//             estimateClient,
//         } = req.body;

//         const clientId = parseInt(estimateClient, 10);

//         if (!estimateClient || isNaN(clientId)) {
//             const clients = await prisma.client.findMany({
//                 where: { id_craftman: req.session.craftman }
//             });
//             return res.render("pages/estimate.twig", {
//                 error: "Veuillez sélectionner un client valide.",
//                 clients,
//                 currentPage: "estimate"
//             });
//         }


//         const estimate = await prisma.estimate.create({
//             data: {
//                 reference,
//                 tva: parseFloat(tva),
//                 status_estimate,
//                 craftman: {
//                     connect: { id_craftman: req.session.craftman }
//                 },
//                 client: {
//                     connect: { id_client: clientId }
//                 }
//             }
//         });


//         for (let i = 0; i < req.body.description.length; i++) {
//             await prisma.estimateLine.create({
//                 data: {
//                     description: req.body.description[i],
//                     qty: parseFloat(req.body.QTY[i]),
//                     unitAmount: parseFloat(req.body.unitAmount[i]),
//                     estimate: {
//                         connect: { id_estimate: estimate.id_estimate }
//                     }
//                 }
//             });
//         }
// console.log(req.body);

//         res.redirect("/estimate/list");

//     } catch (error) {
//         console.log(error);
//         const clients = await prisma.client.findMany({
//             where: { id_craftman: req.session.craftman }
//         }).catch(() => []);

//         res.render("pages/estimate.twig", {
//             error: "Erreur lors de la création d'un devis",
//             clients,
//             currentPage: "estimate"
//         });
//     }
// }

// NEW DEVIS (Version de test basique)
// NEW DEVIS (Client 100% optionnel)
export async function newEstimate(req, res) {
    try {
        const {
            reference,
            tva,
            status_estimate,
            estimateClient,
        } = req.body;

        // 1. On prépare les données de base du devis
        const estimateData = {
            reference: reference || "DEVIS-SANS-REF",
            tva: parseFloat(tva) || 20,
            status_estimate: status_estimate || "en attente",
            craftman: {
                connect: { id_craftman: req.session.craftman }
            }
        };

        // 2. LA MAGIE : On connecte le client UNIQUEMENT s'il y en a un de valide
        const clientId = parseInt(estimateClient, 10);

        if (estimateClient && !isNaN(clientId)) {
            // Si estimateClient n'est pas vide et est un nombre, on l'ajoute à l'objet
            estimateData.client = {
                connect: { id_client: clientId }
            };
        }
        // Si estimateClient est vide (''), on ne fait rien ! L'objet restera sans client.

        // 3. Création du devis avec nos données dynamiques
        const estimate = await prisma.estimate.create({
            data: estimateData
        });

        // 4. Gestion des lignes (Inchangée, gère 1 ou plusieurs lignes)
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

        return res.redirect("/estimate/list");

    } catch (error) {
        console.error("Erreur lors de la création du devis :", error);

        // Si ça crash ici, c'est probablement que ton fichier schema.prisma 
        // oblige le devis à avoir un client (relation non-optionnelle)
        const clients = await prisma.client.findMany({
            where: { id_craftman: req.session.craftman }
        }).catch(() => []);

        res.render("pages/estimate.twig", {
            error: "Impossible de créer le devis. Vérifie si ta base de données autorise les devis sans client.",
            clients,
            currentPage: "estimate"
        });
    }
}

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


        // CREATION DU PDF
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
        const browser = await puppeteer.launch();

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
            totalTTC
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Erreur preview devis"
        );
    }
}