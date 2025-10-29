import { Request, Response } from "express";
import Experience from "../Models/Experience";


export const getExperiences = async (req: Request, res: Response) => {
  const experiences = await Experience.find();
  res.status(200).json(experiences);
};

export const getExperienceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const experience = await Experience.findById(id);
  if (!experience) return res.status(404).json({ message: "Experience not found" });
  res.status(200).json(experience);
};


//new
export const createExperience = async (req: Request, res: Response) => {
  try {
    const { title, description, location, price, image, slots } = req.body;

    // Validation check
    if (!title || !description || !location || !price || !image) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const newExperience = await Experience.create({
      title,
      description,
      location,
      price,
      image,
      slots,
    });

    return res.status(201).json({
      message: "Experience added successfully",
      data: newExperience,
    });
  } catch (error: any) {
    console.error("Error adding experience:", error.message);
    return res.status(500).json({
      message: "Error adding experience",
      error: error.message,
    });
  }
};