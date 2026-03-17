import express from "express";
import { authguard } from "../services/authguard.js"
import { getPurchase } from "../controllers/purchaseController.js";


export const purchaseRouter = express.Router()

purchaseRouter.get("/list", authguard, getPurchase)