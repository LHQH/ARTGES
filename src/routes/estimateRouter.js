import express from "express";
import { authguard } from "../services/authguard.js"
import { getEstimate, newEstimate, generatePDF, generatePreview } from "../controllers/estimateController.js";


export const estimateRouter = express.Router()

estimateRouter.get("/list", getEstimate)
estimateRouter.post("/new", newEstimate)
estimateRouter.get("/pdf/:id", generatePDF);
estimateRouter.get("/preview/:id", generatePreview);
// estimateRouter.post("/delete/:id", deleteEstimate)
// estimateRouter.post("/update/:id", updateEstimate)