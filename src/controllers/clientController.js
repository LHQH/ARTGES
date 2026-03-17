import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });
import { adressRegex, phoneRegex, postCodeRegex } from "../services/regex.js";

//VIEW LISTE CLIENT
export async function getClient(req, res) {
    res.render("pages/list.twig", {
        title: "Liste des clients"

    })
}

// CREATION D'UNE FICHE CLIENT
export async function clientRegister(req, res) {
    try {
        const { firstName, lastName, phone, adress, postCode,city, mail } = req.body;
      
        if (!nameRegex.test(firstName)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Prénom invalide"
            });
        }

        // Vérification Last Name
        if (!nameRegex.test(lastName)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Nom invalide"
            });
        }

        // Vérification mail
        if (!mailRegex.test(mail)) {
            return res.render("pages/clientRegister.twig", {
                old: req.body,
                error: "Email invalide"
            });
        }
        //VERIF ADRESS  
        if (!adressRegex.test(adress)) {
            return res.render("pages/clientRegister.twig", {
                old: req.body,
                error: "Adresse invalide"
            })
        }
        //VERIF CODE POSTAL
        if (!postCodeRegex.test(postCode)) {
            return res.render("pages/clientRegister.twig", {
                old: req.body,
                error: "Code postal invalide"
            })
        }
        //VERIF VILLE
        if (!adressRegex.test(city)) {
            return res.render("pages/clientRegister.twig", {
                old: req.body,
                error: "Ville invalide"
            })
        }

        //VERIF PHONE
        if (!phoneRegex.test(phone)) {
            return res.render("pages/clientRegister.twig", {
                old: req.body,
                error: "Numéro de téléphone invalide"
            })
        }


        await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                adress: adress,
                mail: mail,
                password: password,
                createdBy: { connect: { id: req.craftman.id } } // creer la relation a la creation de user
            }
        })
        res.redirect("/artisan/client")
    }
    catch (error) {
        console.log(error);
        res.redirect("/artisans/client", {
            error: "Erreur pendant la création de fiche client"
        })
    }
}