import express from "express";
import { authguard } from "../services/authguard.js"
import { assignClient, deleteConstruct, getConstruct, newConstruct, updateConstruct } from "../controllers/constructController.js";

export const constructRouter = express.Router()

constructRouter.get("/list", authguard,  getConstruct)
constructRouter.post("/new", authguard,  newConstruct)
constructRouter.post("/delete/:id", authguard,  deleteConstruct)
constructRouter.post("/update/:id", authguard, updateConstruct)
constructRouter.post("/assign/:id", authguard,assignClient)