import express from "express";
import { authguard } from "../services/authguard.js"
import { deleteConstruct, getConstruct, newConstruct, updateConstruct } from "../controllers/constructController.js";

export const constructRouter = express.Router()

constructRouter.get("/list", authguard, getConstruct)
constructRouter.post("/new", authguard, newConstruct)
constructRouter.post("/:id/delConstruct", authguard, deleteConstruct)
constructRouter.post("/:id/upConstruct", authguard , updateConstruct)