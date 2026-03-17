import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

export async function getPurchase(req,res) {
    res.render("pages/purchase.twig", {
    title : "Gestion de vos achats",
    })
}