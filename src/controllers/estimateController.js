import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";

const prisma = new PrismaClient({ adapter });

//VIEW DEVIS
export async function getEstimate(req, res) {
    res.render("pages/estimate.twig", {
        title: "Gestion des devis"
    })
}

// NEW DEVIS
export async function newEstimate(req, res) {
    try {
        const { reference,id_client,tva,description,QTY,unitAmount } = req.body
        await prisma.estimate.create({
            data: {
                estimatTitle,
                reference,
                id_client,
                tva,
                description,
                QTY,
                unitAmount,
                // LIAISON DE facture A SON ARTISAN
                createdBy: { connect: { id: req.craftman.id } }
            }
        })
        res.redirect("/estimatell/list")
    } catch (error) {
        console.log(error);
        res.render("pages/estimate.twig", {
            error: "Erreur lors de la création d'une facture"
        })
    }
}