import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });



//VIEW DES CHANTIERS
export async function getConstruct(req, res) {
    res.render("pages/construct.twig", {
        title: "Gestion des chantiers"
    })
}

// NOUVEAU CHANTIER

export async function newConstruct(req, res) {
    try {
        const { construct_name, id_client, construct_ref, adress, postCode, city, start_date, end_date, id_bill, description } = req.body
        await prisma.constructsite.create({
            data: {
                construct_name,
                id_client,
                construct_ref,
                adress,
                postCode,
                city,
                start_date,
                end_date,
                id_bill,
                description,
                // LIAISON DE CHANTIER A SON ARTISAN
                createdBy: { connect: { id: req.craftman.id } }
            }
        })
        res.redirect("/construct/list")
    } catch (error) {
        console.log(error);
        res.render("pages/home.twig", {
            error: "Erreur lors de la création d'un chantier"
        })
    }
}



// MODIF CHANTIER

export async function updateConstruct(req, res) {
    try {
        const { construct_name, id_client, construct_ref, adress, postCode, city, start_date, end_date, id_bill, description } = req.body
        await prisma.constructsite.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                construct_name,
                id_client,
                construct_ref,
                adress,
                postCode,
                city,
                start_date,
                end_date,
                id_bill,
                description
            }
        })
        res.redirect("/construct/list")
    } catch (error) {
        console.log(error);
        res.render("pages/construct.twig", {
            error: "Erreur lors de la modification d'un chantier"
        })
    }
}

//DELETE UN CHANTIER

export async function deleteConstruct(req, res) {
    try {
        await prisma.constructsite.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/construct/list")
    } catch (error) {
        console.log(error);
        res.render("pages/construct.twig", {
            error: "Erreur lors de la suppression d'un chantier"
        })
    }
}