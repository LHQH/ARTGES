import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });
import { adressRegex, phoneRegex, postCodeRegex, nameRegex, mailRegex } from "../services/regex.js";

//VIEW LISTE CLIENT
export async function getClient(req, res) {
    try {

        const search = req.query.q || "";

        const clients = await prisma.client.findMany({

            where: {
                id_craftman: req.session.craftman,

                // PERMET LA RECHERCHE AU DELA DES AFFICHAGE DES 3 DERNIERS ENREGISTRE
                OR: [
                    {
                        firstName: {
                            contains: search,

                        }
                    },
                    {
                        lastName: {
                            contains: search,

                        }
                    },
                    {
                        email: {
                            contains: search,

                        }
                    },
                    {
                        phone: {
                            contains: search,

                        }
                    },


                ]
            },

            include: {
                address: true
            },

            orderBy: {
                created_at: "desc"
            },
            // N'AFFICHE QUE LES 3 DERNIERS ENREGISTREES
            take: 3
        });

        const formattedClients = clients.map(client => ({
            ...client,
            created_at_formatted: new Date(client.created_at).toLocaleDateString('fr-FR')
        }));

        res.render("pages/client.twig", {
            clients: formattedClients,
            title: "Liste des clients",
            currentPage: "client",

        });

    } catch (error) {
        console.log(error);
        res.render("pages/client.twig", {
            error: "Erreur de l'affichage des clients"
        });
    }
}

// CREATION D'UNE FICHE CLIENT
export async function clientRegister(req, res) {
    try {
        const { firstName, lastName, phone, address, postCode, city, mail } = req.body;

        if (!nameRegex.test(firstName)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Prénom invalide"
            });
        }

        
        if (!nameRegex.test(lastName)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Nom invalide"
            });
        }

        
        if (!mailRegex.test(mail)) {
            return res.render("pages/client.twig", {
                old: req.body,
                error: "Email invalide"
            });
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
                email: mail,
                phone: phone,
                address: {
                    create: {
                        street: address,
                        postcode: postCode,
                        city: city,
                        craftman: { connect: { id_craftman: req.session.craftman } }
                    }
                },
                craftman: { connect: { id_craftman: req.session.craftman } } 
            },

        })

        res.redirect("/client/list?success=client_added")
    }
    catch (error) {
        console.log(error);
        res.redirect("/client/list?error=add_failed")
    }
}


// DELETE CLIENT
export async function deleteClient(req, res) {
    try {

        await prisma.client.delete({
            where: {
                id_client: parseFloat(req.params.id)
            },

        })

        res.redirect("/client/list?success=client_deleted")
    } catch (error) {
        console.log(error);
        res.render("pages/client.twig", {
            error: "Erreur lors de la suppression d'une fiche client"
        })
    }
}


//UPDATE  CLIENT
export async function updateClient(req, res) {

    try {
        const { firstNameUpdate, lastNameUpdate, phoneUpdate, streetUpdate, postCodeUpdate, cityUpdate, mailUpdate } = req.body
        await prisma.client.update({
            where: {
                id_client: parseFloat(req.params.id)
            },
            data: {
                firstName: firstNameUpdate,
                lastName: lastNameUpdate,
                email: mailUpdate,
                phone: phoneUpdate,
                address: {

                    update: {
                        street: streetUpdate,
                        postcode: postCodeUpdate,
                        city: cityUpdate,
                    }
                }
            }
        })

        res.redirect("/client/list?success=client_updated")
    } catch (error) {
        res.redirect("/client/list?success=update_failed")
    }
}