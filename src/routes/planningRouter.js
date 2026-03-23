import express from "express";
import { authguard } from "../services/authguard.js"
import { deleteEvent, getPlanning, newEvent, updateEvent } from "../controllers/planningController.js";

export const planningRouter = express.Router()

planningRouter.get("/list", authguard, getPlanning)
planningRouter.post("/newEvent", authguard, newEvent)
planningRouter.post("/upEvent", authguard, updateEvent)
planningRouter.post("/delEvent", authguard, deleteEvent)
