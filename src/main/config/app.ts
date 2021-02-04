import express from "express"
import setupMidlewares from "./middleware"
import setupRoutes from "./routes"

const app = express()
setupMidlewares(app)
setupRoutes(app)
export default app