import express from "express";
import { authguard } from "../services/authguard.js";
import { getBill, convertToBill, payBill, deleteBill, previewBill, generatePDFBill } from "../controllers/billController.js";

export const billRouter = express.Router();

billRouter.get("/list",authguard, getBill);
billRouter.get("/preview/:id", authguard, previewBill);
billRouter.get("/pdf/:id", authguard, generatePDFBill);
billRouter.post("/pay/:id", authguard, payBill);
billRouter.post("/delete/:id", authguard, deleteBill);
billRouter.post("/convert/:id", authguard, convertToBill)