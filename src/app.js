import express from "express"
import "dotenv/config"
import session from "express-session"
import { craftmanRouter } from "./routes/craftmanRouter.js"
import { clientRouter } from "./routes/clientRouter.js"
import { estimateRouter } from "./routes/estimateRouter.js"
import { billRouter } from "./routes/billRouter.js"
import { constructRouter } from "./routes/constructRouter.js"
import { purchaseRouter } from "./routes/purchaseRouter.js"
import { planningRouter } from "./routes/planningRouter.js"

const app = express()
app.use(express.static("./public"))
app.use(session({
    secret: process.env.SESSION,
    resave: true,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))

app.use( craftmanRouter)
app.use("/client", clientRouter)
app.use("/estimate", estimateRouter)
app.use("/bill", billRouter)
app.use("/construct", constructRouter)
app.use("/purchase", purchaseRouter)
app.use("/planning", planningRouter )



app.listen(process.env.DB_PORT, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log(`Connecté sur le port ${process.env.DB_PORT}`);
    }
})