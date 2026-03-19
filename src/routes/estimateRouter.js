import express from "express";
import { authguard } from "../services/authguard.js"
import { getEstimate, newEstimate } from "../controllers/estimateController.js";


export const estimateRouter = express.Router()

estimateRouter.get("/list", authguard, getEstimate)
estimateRouter.post("/new", authguard, newEstimate)