import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Promo from "../Models/Promo";

// Generate a random promo code
const generateRandomPromoCode = (): string => {
  return uuidv4().replace(/[^A-Z0-9]/g, '').substring(0, 8).toUpperCase();
};

// Generate random discount value
const generateRandomDiscount = () => {
  // 50% chance for each type
  const isPercentage = Math.random() < 0.5;
  
  if (isPercentage) {
    // Random percentage between 5% and 25%
    return {
      discountType: "PERCENT" as const,
      value: Math.floor(Math.random() * 21) + 5
    };
  } else {
    // Random flat amount between ₹100 and ₹1000 (in steps of 50)
    const flatAmount = (Math.floor(Math.random() * 19) + 2) * 50;
    return {
      discountType: "FLAT" as const,
      value: flatAmount
    };
  }
};

// ✅ Get a random promo code (for user)
export const getRandomPromo = async (req: Request, res: Response) => {
  try {
    const discount = generateRandomDiscount();
    const promoCode = generateRandomPromoCode();

    // Create and save the promo code in the database
    const promo = await Promo.create({
      code: promoCode,
      discountType: discount.discountType,
      value: discount.value,
      createdAt: new Date(),
      isUsed: false
    });

    res.status(200).json({
      message: "Random promo generated successfully",
      promo
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating promo", error });
  }
};

// ✅ Validate Promo Code entered by user
export const validatePromo = async (req: Request, res: Response) => {
  try {
    const { code, userId } = req.body;

    const promo = await Promo.findOne({ 
      code: code.toUpperCase(),
      isUsed: false // Only find unused promos
    });

    if (!promo) {
      return res.status(400).json({ message: "Invalid or already used promo code" });
    }

    // Mark the promo as used
    promo.isUsed = true;
    promo.usedAt = new Date();
    if (userId) {
      promo.usedBy = userId;
    }
    await promo.save();

    res.status(200).json({ message: "Promo valid", discount: promo });
  } catch (error) {
    res.status(500).json({ message: "Error validating promo code", error });
  }
};
