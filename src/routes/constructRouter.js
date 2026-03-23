import express from "express";
import { authguard } from "../services/authguard.js"
import { deleteConstruct, getConstruct, newConstruct, updateConstruct } from "../controllers/constructController.js";

export const constructRouter = express.Router()

constructRouter.get("/list",  getConstruct)
constructRouter.post("/new",  newConstruct)
constructRouter.post("/:id/delConstruct",  deleteConstruct)
constructRouter.post("/:id/upConstruct",  updateConstruct)