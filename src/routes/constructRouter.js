import express from "express";
import { authguard } from "../services/authguard.js"
import { deleteConstruct, getConstruct, newConstruct, updateConstruct } from "../controllers/constructController.js";

export const constructRouter = express.Router()

constructRouter.get("/list",  getConstruct)
constructRouter.post("/new",  newConstruct)
constructRouter.post("/delete/:id",  deleteConstruct)
constructRouter.post("/update/:id",  updateConstruct)