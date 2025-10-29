import express from "express";
import { getRandomPromo } from "../Controllers/promo";

const router = express.Router();


router.get("/random", getRandomPromo); // ✅ new route to get a random promo

export default router;
