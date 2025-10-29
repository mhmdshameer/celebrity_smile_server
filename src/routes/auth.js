import express from "express";
import { signIn, verifyToken } from "../controllers/signIn.js";

const router = express.Router();

// POST /auth/signin
router.post("/signin", signIn);

// GET /auth/protected (optional test)
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});

export default router;
