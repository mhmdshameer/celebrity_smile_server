import express from "express";
import { uploadImage, deleteImage } from "../controllers/upload.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// POST /api/upload
router.post("/", upload.single("image"), uploadImage);
router.delete("/", deleteImage);

export default router;
