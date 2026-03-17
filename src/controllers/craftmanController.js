
import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPassword.js";
const prisma = new PrismaClient({ adapter });
import bcrypt from "bcrypt"
import { adressRegex, phoneRegex, mailRegex, passwordRegex, nameRegex, siretRegex, socialReasonRegex } from "../services/regex.js";



//VIEW PAGE ACCUEIL
export async function start(req, res) {
    res.render("pages/home.twig", {
        title: "Bienvenue"

    })
}

// VIEW REGISTER
export function getRegister(req, res) {
    res.render("pages/register.twig", {
        title: "Inscription"
    })
}

//REGISTER
export async function postRegister(req, res) {
    try {
        //VERIF PRENOM
        const { firstName, lastName, mail, phone, adress, postCode, city, siret, socialReason, password } = req.body;

        if (!nameRegex.test(firstName)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Prénom invalide"
            });
        }

        // VERIF NOM
        if (!nameRegex.test(lastName)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Nom invalide"
            });
        }

        // VERIF MAIL
        if (!mailRegex.test(mail)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Email invalide"
            });
        }
        //VERIF PHONE
        if (!phoneRegex.test(phone)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Numero de téléphone invalide"
            });
        }
        // VERIF ADRESS
        if (!adressRegex.test(adress)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Adresse invalide"
            });
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


        //VERIF SIRET
        if (!siretRegex.test(siret)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "Siret incorrect"
            })
        }

        //VERIF SOCIALREASON
        if (!socialReasonRegex.test(socialReason)) {
            return res.render("pages/register.twig", {
                old: req.body,
                error: "erreur lors de l'enregistrement"
            })
        }
        // VERIF PASSWORD
        if (!passwordRegex.test(password)) {
            return res.render("pages/register.twig", {

                error: "Mot de passe trop faible"
            });
        }

        await prisma.craftman.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                mail: mail,
                phone: phone,
                adress: adress,
                postCode: postCode,
                city: city,
                password: password,
                siret: siret,
                socialReason: socialReason
            }
        })
        res.redirect("/login")
    }
    catch (error) {
        console.log(error);
        res.render("pages/register.twig", {
            title: "Inscription",
            error: "Erreur lors de l'inscription..."
        })
    }
}

// LOGIN

export async function getLogin(req, res) {
    res.render("pages/login.twig", {
        title: "connexion",
        error: "Erreur lors de la connexion"
    })
}


export async function postLogin(req, res) {
    try {
        // RECUP L'ADMIN PAR SON SIRET
        const craftman = await prisma.craftman.findUnique({
            where: {
                siret: req.body.siret
            }
        })
        if (craftman) {
            // Vérifier la concordance des mots de passe
            if (await bcrypt.compare(req.body.password, craftman.password)) {
                // Garder en mémoire l'utilisateur
                req.session.craftman = craftman.id
                // Rediriger vers la page d'accueil si ok
                res.redirect("/artisan/dashboard")
            }
        } else {
            res.render("pages/login.twig", {
                error: "Identifiants invalides"
            })
        }

    } catch (error) {
        console.log(error);
        res.render("pages/login.twig", {
            error: "Identifiants invalides"
        })
    }
}

//DASHBOARD

export async function getDashboard(req, res) {
    res.render("pages/dashboard.twig", {
        title: "Tableau de bord"
    })

}