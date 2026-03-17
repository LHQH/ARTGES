import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";

const prisma = new PrismaClient({ adapter });


export async function getEstimate(req, res) {
    res.render("pages/estimate.twig", {
        title: "Gestion des devis"
    })
}