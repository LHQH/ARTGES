import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

// VIEW DES FACTURES
export async function getBill(req,res) {
    res.render("pages/bill.twig", {
    title:"Gestion des factures",
    })
}

//NOUVELLE FACTURE
export async function newBill(req, res) {
    try {
        const { billTitle,reference,id_client,tva,description,QTY,unitAmount } = req.body
        await prisma.bill.create({
            data: {
                billTitle,
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
        res.redirect("/bill/list")
    } catch (error) {
        console.log(error);
        res.render("pages/bill.twig", {
            error: "Erreur lors de la création d'une facture"
        })
    }
}



