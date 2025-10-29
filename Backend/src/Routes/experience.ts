import express from "express";
import { createExperience, getExperienceById, getExperiences } from "../Controllers/experience";


const router = express.Router();

router.get("/", getExperiences);
router.get("/:id", getExperienceById);
router.post("/add", createExperience);


export default router;
