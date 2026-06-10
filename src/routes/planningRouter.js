import express from "express";
import { authguard } from "../services/authguard.js";
import { getPlanning, getEvents, newEvent, deleteEvent } from "../controllers/planningController.js";

export const planningRouter = express.Router();

planningRouter.get("/list", authguard,  getPlanning);
planningRouter.get("/api", authguard,  getEvents);
planningRouter.post("/new", authguard, newEvent);
planningRouter.delete("/delete/:id", authguard, deleteEvent);