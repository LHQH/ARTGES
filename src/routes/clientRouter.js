import express from "express";
import { authguard } from "../services/authguard.js"
import { clientRegister, deleteClient, getClient, updateClient } from "../controllers/clientController.js";

export const clientRouter = express.Router()

clientRouter.get("/list", authguard, getClient)
clientRouter.post("/register", authguard, clientRegister)
clientRouter.post("/:id/delClient", authguard, deleteClient)
clientRouter.post("/:id/upClient", authguard, updateClient)