import express from "express";
import { authguard } from "../services/authguard.js"
import { deletePurchase, getPurchase, newPurchase, updatePurchase } from "../controllers/purchaseController.js";


export const purchaseRouter = express.Router()

purchaseRouter.get("/list", authguard, getPurchase)
purchaseRouter.post("/newPurchase", authguard, newPurchase)
purchaseRouter.post("/:id/delPurchase", authguard, deletePurchase)
purchaseRouter.post("/:id/upPurchase", authguard,updatePurchase)