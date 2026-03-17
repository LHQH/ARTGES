import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });


export async function getBill(req,res) {
    res.render("pages/bill.twig", {
    title:"Gestion des factures",
    })
}