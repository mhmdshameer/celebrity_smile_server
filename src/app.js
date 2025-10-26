import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import doctorRouter from "./routes/doctor.js";
import uploadRouter from "./routes/upload.js";
import serviceRouter from "./routes/service.js";
import offerRouter from "./routes/offer.js";

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Celebrity Smile API!");
});

app.use("/doctor", doctorRouter)
app.use("/upload", uploadRouter)
app.use("/service", serviceRouter)
app.use("/offer", offerRouter)

export default app
