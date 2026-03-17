import express from "express";
import { authguard } from "../services/authguard.js"

export const planningRouter = express.Router()

planningRouter.get("pages/planning.twig")