import express from "express";
import { authguard } from "../services/authguard.js"
import { getBill } from "../controllers/billController.js";

export const billRouter = express.Router()

billRouter.get("/list", authguard, getBill)