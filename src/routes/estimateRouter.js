import express from "express";
import { authguard } from "../services/authguard.js"
import { getEstimate } from "../controllers/estimateController.js";


export const estimateRouter = express.Router()

estimateRouter.get("/list", authguard, getEstimate)