import express from "express";
import { getDoctors, getDoctor, addDoctor, updateDoctor, deleteDoctor } from "../controllers/doctor.js";
import { upload } from "../middleware/multer.js";

const Router = express.Router()

Router.get("/", getDoctors)
Router.get("/:id", getDoctor)
Router.post("/", upload.single("image"), addDoctor)
Router.put("/:id", upload.single("image"), updateDoctor)
Router.delete("/:id", deleteDoctor)

export default Router
