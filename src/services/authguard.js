import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter })

export async function authguard(req, res, next) {
    console.log("SESSION ACTUELLE :", req.session);
    try {
        if (req.session.craftman) {
            const craftman = await prisma.craftman.findUnique({
                where: {
                    id_craftman: req.session.craftman
                },
                select: {
                    id_craftman: true,
                    firstName: true,
                    lastName: true,
                    mail: true,
                    phone: true,
                    proAdress: true,
                    postCode: true,
                    city: true,
                    SIRET: true,
                    socialReason: true,
                    logo_url: true,
                    adress: {
                        select: {
                            id_address: true
                        }
                    }
                }
            });
            if (craftman) {
                req.craftman = craftman
                res.locals.craftman = craftman //UTILISER RES.LOCAL POUR UTILISER VARIABLE ADMIN ET USER FRONT-END
                return next()
            }
        } else {
            throw new Error("Aucun utilisateur enregistré en session")
        }
        
    }
    catch (error) {
        console.log(req.session)
        console.log(error);
        res.redirect("/")
    }
}

