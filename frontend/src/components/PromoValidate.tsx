import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift, RotateCw } from "lucide-react";

interface PromoCode {
  code: string;
  discountType: "PERCENT" | "FLAT";
  value: number;
}

const PromoValidate: React.FC = () => {
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  const fetchPromo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/promo/random");
      if (response.data.promo) {
        setPromo(response.data.promo);
        setError("");
      } else {
        throw new Error("No promo received");
      }
    } catch (error) {
      setError("Couldn't generate promo code. Please try again.");
      setPromo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  const handleGetNewCode = () => {
    fetchPromo();
  };

  const handleApplyPromo = () => {
    if (promo && bookingData) {
      // Calculate new total based on promo type
      const subtotal = bookingData.subtotal;
      const tax = bookingData.tax;
      let discount = 0;

      if (promo.discountType === "PERCENT") {
        discount = (subtotal * promo.value) / 100;
      } else {
        discount = promo.value;
      }

      const newTotal = subtotal + tax - discount;

      // Navigate back to booking with updated price
      navigate("/bookings", {
        state: {
          ...bookingData,
          promoCode: promo.code,
          discount,
          total: newTotal
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RotateCw className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10">
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <Gift className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
        
        {error ? (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleGetNewCode}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </button>
          </>
        ) : promo ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">Special Offer!</h2>
            <p className="text-gray-600 mb-4">
              {promo.discountType === "PERCENT" ? 
                `Get ${promo.value}% off on your booking` :
                `Get ₹${promo.value} off on your booking`}
            </p>
            <div className="bg-white p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500">Your Promo Code</p>
              <p className="text-xl font-bold text-gray-800">{promo.code}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleApplyPromo}
                className="bg-[#FED642] hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-md transition w-full"
              >
                Apply Code
              </button>
              <button
                onClick={handleGetNewCode}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCw className="w-4 h-4" />
                Get Another Code
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">No promo codes available</p>
            <button
              onClick={handleGetNewCode}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PromoValidate;