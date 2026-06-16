import express from "express";
import { authguard } from "../services/authguard.js"
import { getEstimate, newEstimate, generatePDF, generatePreview, deleteEstimate, assignClient, validateEstimate, generatePDFEstimate } from "../controllers/estimateController.js";




export const estimateRouter = express.Router()

estimateRouter.get("/list", authguard, getEstimate)
estimateRouter.post("/new", authguard, newEstimate)
estimateRouter.get("/pdf/:id", authguard, generatePDF);
estimateRouter.get("/pdf/:id/download", authguard, generatePDFEstimate)
estimateRouter.get("/preview/:id", authguard, generatePreview);
estimateRouter.post("/validate/:id", authguard, validateEstimate)
estimateRouter.post("/delete/:id", authguard, deleteEstimate)
estimateRouter.post("/assign/:id", authguard, assignClient)
