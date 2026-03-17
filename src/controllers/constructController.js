import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

export async function getConstruct(req,res) {
    res.render("pages/construct.twig", {
    title:"Gestion des chantiers"
    })
}