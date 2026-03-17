import express from "express";
import { authguard } from "../services/authguard.js"
import { getConstruct } from "../controllers/constructController.js";

export const constructRouter = express.Router()

constructRouter.get("/list",authguard, getConstruct)