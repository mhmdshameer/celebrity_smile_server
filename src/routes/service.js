import express from "express";
import { getServices, getService, addService, updateService, deleteService } from "../controllers/service.js";
import { upload } from "../middleware/multer.js";

const Router = express.Router()

Router.get("/", getServices)
Router.get("/:id", getService)
Router.post("/", upload.single("image"), addService)
Router.put("/:id", upload.single("image"), updateService)
Router.delete("/:id", deleteService)

export default Router
