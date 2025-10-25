import express from "express";
import { getServices, getService, addService, updateService, deleteService } from "../controllers/service.js";

const Router = express.Router()

Router.get("/", getServices)
Router.get("/:id", getService)
Router.post("/", addService)
Router.put("/:id", updateService)
Router.delete("/:id", deleteService)

export default Router
