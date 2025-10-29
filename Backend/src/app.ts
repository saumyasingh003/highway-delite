import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB = require("./config/db");


import experienceRoutes from "./Routes/experience";
import bookingRoutes from "./Routes/booking";
import promoRoutes from "./Routes/promo";
import authRoutes from "./Routes/auth";
import { errorHandler } from "./Middleware/errorHandler";


dotenv.config();
connectDB().catch((err) => console.error("DB connection error:", err));

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/auth", authRoutes);

// Error handler
app.use(errorHandler);

export default app;
