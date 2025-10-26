import express from "express";
import { upload } from "../middleware/multer.js";
import { getOffers, createOffer, updateOffer, deleteOffer } from "../controllers/offer.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/", upload.single("image"), createOffer);
router.put("/:id", upload.single("image"), updateOffer);
router.delete("/:id", deleteOffer);

export default router;
