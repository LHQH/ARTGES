import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPassword.js";
const prisma = new PrismaClient({ adapter }).$extends(hashPasswordExtension);
import bcrypt from "bcrypt"
import { adressRegex, phoneRegex, mailRegex, passwordRegex, nameRegex, siretRegex, socialReasonRegex, postCodeRegex } from "../services/regex.js";




//VIEW PAGE ACCUEIL
export function start(req, res) {
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
        const { firstName, lastName, mail, phone, proAdress, postCode, city, siret, socialReason, password } = req.body;

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
        if (!adressRegex.test(proAdress)) {
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
        if (!socialReason) {
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
                proAdress: proAdress,
                postCode: postCode,
                city: city,
                password: password,
                SIRET: siret,
                socialReason: socialReason,
                logo_url: ""
            }
        });
        res.redirect("/login")
    }
    catch (error) {
        console.log(error);
        res.render("pages/register.twig", {
            title: "Inscription",
            error: "Erreur lors de l'inscription...",


        })
    }
}

// LOGIN

export function getLogin(req, res) {
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
                mail: req.body.mail
            }
        })
        if (craftman) {
            // Vérifier la concordance des mots de passe
            if (await bcrypt.compare(req.body.password, craftman.password)) {
                // Garder en mémoire l'utilisateur
                req.session.craftman = craftman.id_craftman
                res.redirect("/dashboard")
            }
        } else {
            res.render("pages/login.twig", {
                error: "Identifiants invalides"
            })

        }

    } catch (error) {

        console.log(error);
        res.render("pages/login.twig", {
            error: "Une erreur est survenue"
        })
    }
}



// DECONNEXION

export function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
        }
        res.redirect("/login");
    });
}



//DASHBOARD

export async function getDashboard(req, res) {
    try {
        const craftmanId = req.session.craftman;

        // Nombre de clients
        const nbClients = await prisma.client.count({
            where: { id_craftman: craftmanId }
        });

        // Nombre de chantiers
        const nbConstructs = await prisma.construct.count({
            where: { id_craftman: craftmanId }
        });

        // Début du mois
        const startMonth = new Date();
        startMonth.setDate(1);
        startMonth.setHours(0, 0, 0, 0);

        // Chiffre d'affaires du mois calculé depuis les lignes
        const bills = await prisma.bill.findMany({
            where: {
                id_craftman: craftmanId,
                created_at: { gte: startMonth }
            },
            include: { billLine: true }
        });

        const monthlyRevenue = bills.reduce((total, bill) => {
            const billHT = bill.billLine.reduce((sum, line) => sum + (line.qty * line.unitAmount), 0);
            const billTTC = billHT + (billHT * Number(bill.tva) / 100);
            return total + billTTC;
        }, 0);

        // Chantiers pour la liste
        const constructs = await prisma.construct.findMany({
            where: { id_craftman: craftmanId },
            include: {
                client: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                bill: {
                    include: { billLine: true }
                }
            }
        });
        const upcomingEvents = await prisma.event.findMany({
            where: {
                id_craftman: craftmanId,
                start_datetime: {
                    gte: new Date() // seulement les événements futurs
                }
            },
            orderBy: {
                start_datetime: "asc"
            },
            take: 3
        });
        res.render("pages/dashboard.twig", {
            title: "Dashboard",
            currentPage: "dashboard",
            nbClients,
            nbConstructs,
            monthlyRevenue,
            constructs,
            upcomingEvents  
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
}