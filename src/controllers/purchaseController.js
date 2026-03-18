import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

export async function getPurchase(req,res) {
    res.render("pages/purchase.twig", {
    title : "Gestion de vos achats",
    })
}

// NEW ACHAT
export async function newPurchase(req, res) {
    try {
        const { purchase_date, supplier_name, description, QTY, price, created_at } = req.body
        await prisma.purchase.create({
            data: {
                purchase_date,
                supplier_name,
                description,
                QTY,
                price,
                created_at,
                createdBy: { connect: { id: req.craftman.id } }
            }
        })
        res.redirect("/purchase/list")
    } catch (error) {
        console.log(error);
        res.render("pages/purchase.twig", {
            error: "Erreur lors de la création d'un nouvel achat"
        })
    }
}



// DELETE ACHAT 
export async function deletePurchase(req, res) {
    try {
        await prisma.purchase.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/purchase/list")
    } catch (error) {
        console.log(error);
        res.render("pages/purchase.twig", {
            error: "Erreur lors de la suppression d'un achat"
        })
    }
}


//UPDATE  ACHAT
export async function updatePurchase(req, res) {
    try {
        const { purchase_date, supplier_name, description, QTY, price } = req.body
        await prisma.purchase.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                purchase_date,
                supplier_name,
                description,
                QTY,
                price
            }
        })
        res.redirect("/purchase/list")
    } catch (error) {
        console.log(error);
        res.render("pages/purchase.twig", {
            error: "Erreur lors de la modification d'un achat"
        })
    }
}