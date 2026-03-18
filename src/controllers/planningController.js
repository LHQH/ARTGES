import { title } from "node:process";
import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

export async function getPlanning(req, res) {
    res.render("pages/planning.twig", {
        title: "Votre agenda"
    })
}


// NEW TASK
export async function newEvent(req, res) {
    try {
        const { construct_name, date, construct_ref, adress, city, description } = req.body
        await prisma.constructsite.create({
            data: {
                construct_name,
                date,
                construct_ref,
                adress,
                city,
                description,
                createdBy: { connect: { id: req.craftman.id } }
            }
        })
        res.redirect("/planning/list")
    } catch (error) {
        console.log(error);
        res.render("pages/planning.twig", {
            error: "Erreur lors de la création d'une nouvelle tâche"
        })
    }
}



// DELETE TACHE
export async function deleteEvent(req, res) {
    try {
        await prisma.event.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/planning/list")
    } catch (error) {
        console.log(error);
        res.render("pages/planning.twig", {
            error: "Erreur lors de la suppression d'une tâche"
        })
    }
}


//UPDATE  CLIENT
export async function updateEvent(req, res) {
    try {
        const { construct_name, date, construct_ref, adress, city, description } = req.body
        await prisma.client.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                construct_name,
                date,
                construct_ref,
                adress,
                city,
                description
            }
        })
        res.redirect("/planning/list")
    } catch (error) {
        console.log(error);
        res.render("pages/planning.twig", {
            error: "Erreur lors de la modification d'une tâche"
        })
    }
}