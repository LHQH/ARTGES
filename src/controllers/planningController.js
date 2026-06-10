import { PrismaClient } from "../../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";

const prisma = new PrismaClient({ adapter });

// AFFICHAGE DE LA PAGE PLANNING
export async function getPlanning(req, res) {
    try {
        res.render("pages/planning.twig", {
            title: "Planning",
            currentPage: "planning"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
}

// ROUTE API - RENVOIE LES EVENTS EN JSON POUR FULLCALENDAR
export async function getEvents(req, res) {
    try {
        const events = await prisma.event.findMany({
            where: {
                id_craftman: req.session.craftman
            }
        });

        // FULLCALENDAR ATTEND UN FORMAT SPECIFIQUE
        const formattedEvents = events.map(event => ({
            id: event.id_event,
            title: event.type_rdv_intervention_visite_,
            start: event.start_datetime,
            end: event.end_datetime,
            description: event.description,
            // COULEUR SELON LE TYPE
            color: event.type_rdv_intervention_visite_ === "intervention" ? "#2f66ff"
                : event.type_rdv_intervention_visite_ === "visite" ? "#22c55e"
                    : "#f59e0b"
        }));

        res.json(formattedEvents);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur récupération événements" });
    }
}

// CRÉER UN EVENT
export async function newEvent(req, res) {
    try {
        const { start_datetime, end_datetime, description, type_rdv } = req.body;

        await prisma.event.create({
            data: {
                start_datetime: new Date(start_datetime),
                end_datetime: new Date(end_datetime),
                description: description || null,
                type_rdv_intervention_visite_: type_rdv,
                craftman: {
                    connect: { id_craftman: req.session.craftman }
                }
            }
        });

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur création événement" });
    }
}

// SUPPRIMER UN EVENT
export async function deleteEvent(req, res) {
    try {
        await prisma.event.delete({
            where: { id_event: parseInt(req.params.id) }
        });

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur suppression événement" });
    }
}