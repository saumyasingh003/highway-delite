import express from "express";
import { createBooking } from "../Controllers/booking";

const router = express.Router();

router.post("/", createBooking);

export default router;
