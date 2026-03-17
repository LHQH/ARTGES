import { title } from "node:process";
import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

export async function getPlanning(req,res) {
    res.render("pages/planning.twig", {
    title: "Votre agenda"
    })
}