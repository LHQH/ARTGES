import express from "express";
import { authguard } from "../services/authguard.js"
import { clientRegister, getClient } from "../controllers/clientController.js";

export const clientRouter = express.Router()

clientRouter.get("/list", authguard, getClient)
clientRouter.post("/register",authguard,clientRegister)