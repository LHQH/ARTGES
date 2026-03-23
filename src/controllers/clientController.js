import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });
import { adressRegex, phoneRegex, postCodeRegex } from "../services/regex.js";

//VIEW LISTE CLIENT
export async function getClient(req, res) {
    res.render("pages/client.twig", {
        title: "Liste des clients"

    })
}

// CREATION D'UNE FICHE CLIENT
export async function clientRegister(req, res) {
    try {
        const { firstName, lastName, phone, adress, postCode, city, mail } = req.body;

        if (!nameRegex.test(firstName)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Prénom invalide"
            });
        }

        // Vérification Last Name
        if (!nameRegex.test(lastName)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Nom invalide"
            });
        }

        // Vérification mail
        if (!mailRegex.test(mail)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Email invalide"
            });
        }
        //VERIF ADRESS  
        if (!adressRegex.test(adress)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Adresse invalide"
            })
        }
        //VERIF CODE POSTAL
        if (!postCodeRegex.test(postCode)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Code postal invalide"
            })
        }
        //VERIF VILLE
        if (!adressRegex.test(city)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Ville invalide"
            })
        }

        //VERIF PHONE
        if (!phoneRegex.test(phone)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Numéro de téléphone invalide"
            })
        }


        await prisma.client.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                mail: mail,
                phone: phone,
                adress: adress,
                postCode: postCode,
                city: city,
                createdBy: { connect: { id: req.craftman.id } } // creer la relation a la creation de la fiche client
            }
        })
        res.redirect("/client/list")
    }
    catch (error) {
        console.log(error);
        res.redirect("/client/list", {
            error: "Erreur pendant la création de la fiche client"
        })
    }
}


// DELETE CLIENT
export async function deleteClient(req, res) {
    try {
        await prisma.client.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/client/list")
    } catch (error) {
        console.log(error);
        res.render("pages/home.twig", {
            error: "Erreur lors de la suppression d'une fiche client"
        })
    }
}


//UPDATE  CLIENT
export async function updateClient(req, res) {
    try {
        const { firstName, lastName, mail, phone, adress, postCode, city } = req.body
        await prisma.client.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                firstName,
                lastName,
                mail,
                phone,
                adress,
                postCode,
                city
            }
        })
        res.redirect("/client/list")
    } catch (error) {
        console.log(error);
        res.render("pages/client.twig", {
            error: "Erreur lors de la modification d'une fiche client"
        })
    }
}