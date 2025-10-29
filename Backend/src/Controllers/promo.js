"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePromo = exports.getRandomPromo = void 0;
import uuid_1 from "uuid";
import Promo_1 from "../Models/Promo";
// Generate a random promo code
const generateRandomPromoCode = () => {
    return (0, uuid_1.v4)().replace(/[^A-Z0-9]/g, '').substring(0, 8).toUpperCase();
};
// Generate random discount value
const generateRandomDiscount = () => {
    // 50% chance for each type
    const isPercentage = Math.random() < 0.5;
    if (isPercentage) {
        // Random percentage between 5% and 25%
        return {
            discountType: "PERCENT",
            value: Math.floor(Math.random() * 21) + 5
        };
    }
    else {
        // Random flat amount between ₹100 and ₹1000 (in steps of 50)
        const flatAmount = (Math.floor(Math.random() * 19) + 2) * 50;
        return {
            discountType: "FLAT",
            value: flatAmount
        };
    }
};
// ✅ Get a random promo code (for user)
const getRandomPromo = async (req, res) => {
    try {
        const discount = generateRandomDiscount();
        const promoCode = generateRandomPromoCode();
        // Create and save the promo code in the database
        const promo = await Promo_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error generating promo", error });
    }
};
exports.getRandomPromo = getRandomPromo;
// ✅ Validate Promo Code entered by user
const validatePromo = async (req, res) => {
    try {
        const { code, userId } = req.body;
        const promo = await Promo_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error validating promo code", error });
    }
};
exports.validatePromo = validatePromo;
//# sourceMappingURL=promo.js.map