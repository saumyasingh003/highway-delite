
import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state as { bookingId?: string; amount?: number } | null;

  useEffect(() => {
    // Redirect if no booking details are present
    if (!bookingDetails?.bookingId) {
      navigate('/');
    }
  }, [bookingDetails, navigate]);

  // Generate a random reference ID
  const generateRefID = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const refId = generateRefID();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Green Check Icon */}
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />

      {/* Booking Confirmation Text */}
      <div className="md:text-3xl text-xl font-semibold text-gray-900">Booking Confirmed</div>
      <p className="text-gray-600 mt-2">Booking ID: {bookingDetails?.bookingId || refId}</p>
      {bookingDetails?.amount && (
        <p className="text-gray-600 mt-1">Amount Paid: ₹{bookingDetails.amount}</p>
      )}

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Payment;
