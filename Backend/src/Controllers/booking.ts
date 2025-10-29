import { Request, Response } from "express";
import Booking from "../Models/Booking";
import Experience from "../Models/Experience";


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userName, email, experienceId, date, time, totalPrice, promoCode } = req.body;

    if (!userName || !email || !experienceId || !date || !time || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBooking = await Booking.findOne({ experienceId, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = await Booking.create({
      userName,
      email,
      experienceId,
      date,
      time,
      totalPrice,
      promoCode,
    });

    await Experience.updateOne(
      { _id: experienceId, "slots.date": date, "slots.time": time },
      { $set: { "slots.$.available": false } }
    );

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};
