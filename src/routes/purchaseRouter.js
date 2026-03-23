import express from "express";
import { authguard } from "../services/authguard.js"
import { deletePurchase, getPurchase, newPurchase, updatePurchase } from "../controllers/purchaseController.js";


export const purchaseRouter = express.Router()

purchaseRouter.get("/list",  getPurchase)
purchaseRouter.post("/newPurchase",  newPurchase)
purchaseRouter.post("/:id/delPurchase",  deletePurchase)
purchaseRouter.post("/:id/upPurchase", updatePurchase)