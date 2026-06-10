import express from "express";
import { authguard } from "../services/authguard.js"
import { getDashboard, getLogin, getRegister, logout, postLogin, postRegister, start } from "../controllers/craftmanController.js";


export const craftmanRouter = express.Router()

craftmanRouter.get("/", start)
craftmanRouter.get("/dashboard", authguard,getDashboard)
craftmanRouter.get("/register", getRegister)
craftmanRouter.get("/login", getLogin)
craftmanRouter.get("/logout", authguard, logout)
craftmanRouter.post("/register", postRegister)
craftmanRouter.post("/login",postLogin)
