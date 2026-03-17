import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter })

export async function authguard(req, res, next) {
    try {
        if (req.session.craftman) {
            const craftman = await prisma.craftman.findUnique({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mail: true,
                    phone: true,
                    adress: true,
                    siret: true,
                    socialReason: true,
                },
                where: {
                    id: req.session.craftman
                }
            })
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
        console.log(error);
        res.redirect("/")
    }
}
