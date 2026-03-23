import express from "express";
import { authguard } from "../services/authguard.js"
import { clientRegister, deleteClient, getClient, updateClient } from "../controllers/clientController.js";

export const clientRouter = express.Router()

clientRouter.get("/list",  getClient)
clientRouter.post("/register",  clientRegister)
clientRouter.post("/:id/delClient",  deleteClient)
clientRouter.post("/:id/upClient",  updateClient)