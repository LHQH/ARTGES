import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });



//VIEW DES CHANTIERS
export async function getConstruct(req, res) {
    try {
        const search = req.query.q || "";

        const constructs = await prisma.construct.findMany({

            where: {
                id_craftman: req.session.craftman,

                // PERMET LA RECHERCHE AU DELA DES AFFICHAGE DES 3 DERNIERS ENREGISTRE
                OR: [
                    {
                        construct_name: {
                            contains: search,
                        }
                    },
                    {
                        construct_ref: {
                            contains: search,
                        }
                    },
                    {
                        status: {
                            contains: search,
                        }
                    },
                ]
            },
            include: {
                client: true,
                address: true
            },
            orderBy: {
                created_at: "desc"
            },
            take: 4
        });

        // PRESENTE LES DATE ET HEURE SOUS UN FORMAT PLUS SYMPA

        const formattedConstruct = constructs.map(construct => ({
            ...construct,

            start_date_formatted: construct.start_date
                ? new Date(construct.start_date).toLocaleDateString('fr-FR')
                : "",

            end_date_formatted: construct.end_date
                ? new Date(construct.end_date).toLocaleDateString('fr-FR')
                : ""

        }));

        const clients = await prisma.client.findMany({
            where: { id_craftman: req.session.craftman }
        });
        res.render("pages/construct.twig", {
            constructs: formattedConstruct,
            title: "Gestion des chantiers",
            currentPage: "construct",
            search,
            clients
        })
    } catch (error) {
        console.log(error);
        res.render("pages/construct.twig", {
            error: "Erreur de l'affichage des chantiers"
        });
    }

}

// NOUVEAU CHANTIER

export async function newConstruct(req, res) {
    try {
        const { construct_name, id_client, construct_ref, address, postCode, city, start_date, end_date, description } = req.body;

        const clientId = parseInt(id_client);

        await prisma.construct.create({
            data: {
                construct_name,
                construct_ref,
                description,

                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                

                // CONNECTE LE CLIENT QUE SI VALEUR VALIDE
                ...(!isNaN(clientId) && {
                    client: { connect: { id_client: clientId } }
                }),

                address: {
                    create: {
                        street: address,
                        postcode: postCode,
                        city: city,
                        craftman: { connect: { id_craftman: req.session.craftman } }
                    }
                },
                craftman: { connect: { id_craftman: req.session.craftman } }
            }
        });

        res.redirect("/construct/list?success=construct_added");

    } catch (error) {
        console.log(error);
        res.redirect("/construct/list?error=add_failed")
    }
}



// MODIF CHANTIER

export async function updateConstruct(req, res) {
    try {
        const {
            construct_nameUpdate,
            construct_refUpdate,
            addressUpdate,
            postCodeUpdate,
            cityUpdate,
            start_dateUpdate,
            end_dateUpdate,
            descriptionUpdate
        } = req.body;

        const data = {
            construct_name: construct_nameUpdate,
            construct_ref: construct_refUpdate,
            description: descriptionUpdate,
            
        };

        // DATE FALCUTATIV A LA MODIF
        if (start_dateUpdate) {
            data.start_date = new Date(start_dateUpdate);
        } else {
            data.start_date = null;
        }

        if (end_dateUpdate) {
            data.end_date = new Date(end_dateUpdate);
        } else {
            data.end_date = null;
        }

        data.address = {
            update: {
                street: addressUpdate,
                postcode: postCodeUpdate,
                city: cityUpdate
            }
        };
        console.log("REQ BODY :", req.body);
        console.log("DATA ENVOYE A PRISMA :", data);
        const updated = await prisma.construct.update({
            where: {
                id_construct: parseInt(req.params.id)
            },
            data,
            include: {
                address: true,
                client: true
            }
        });

        res.redirect("/construct/list?success=construct_updated");

    } catch (error) {
        console.log(error);
        res.redirect("/construct/list?error=update_failed");
    }
}

// ASSIGNER UN CLIENT DEPUIS LA PAGE DE DEVIS
export async function assignClient(req, res) {
    try {

        const constructId = parseInt(req.params.id);
        const clientId = parseInt(req.body.availableClient);

        await prisma.construct.update({
            where: {
                id_construct: constructId
            },
            data: {
                client: {
                    connect: {
                        id_client: clientId
                    }
                }
            }
        });

        res.redirect("/construct/list?success=construct_updated");

    } catch (error) {
        console.log(error);
        res.redirect("/construct/list?error=assign_failed");
    }
}
//DELETE UN CHANTIER

export async function deleteConstruct(req, res) {
    try {
        await prisma.construct.delete({
            where: {
                id_construct: parseInt(req.params.id)
            }
        })
        res.redirect("/construct/list?success=construct_deleted")
    } catch (error) {
        console.log(error);
        res.redirect("construct/list?error=delete_failed")
    }
}