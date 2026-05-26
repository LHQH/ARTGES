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

        res.render("pages/construct.twig", {
            constructs: formattedConstruct,
            title: "Gestion des chantiers",
            currentPage: "construct",
            search
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
        const { construct_name, id_client, construct_ref, address, postCode, city, start_date, end_date, id_bill, description } = req.body
        await prisma.construct.create({
            data: {
                construct_name,
                construct_ref,

                start_date: new Date(start_date),
                end_date: new Date(end_date),

                description,

                address: {
                    create: {
                        street: address,
                        postcode: postCode,
                        city: city,

                        craftman: {
                            connect: {
                                id_craftman: req.session.craftman
                            }
                        }
                    }
                },

                craftman: { connect: { id_craftman: req.session.craftman } }
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
        const { construct_name, id_client, construct_ref, address, postCode, city, start_date, end_date, id_bill, description } = req.body
        await prisma.construct.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                construct_name,
                id_client,
                construct_ref,
                address,
                postCode,
                city,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
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
        await prisma.construct.delete({
            where: {
                id_construct: parseInt(req.params.id)
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