import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

interface Slot {
  date: string;
  time: string;
}

interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  slots: Slot[];
}

const ExperienceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://highway-delite-server-six.vercel.app/api/experiences/${id}`)
      .then((res) => setExperience(res.data))
      .catch((err) => console.error("Error fetching experience:", err));
  }, [id]);

  if (!experience) return <p className="text-center mt-10">Loading...</p>;

  const subtotal = experience.price * quantity;
  const tax = Math.round(subtotal * 0.06);
  const total = subtotal + tax;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
     
    });
  };

    const handleConfirm = () => {
      if (isConfirmActive) {
        // Pass booking details to the booking page via router state
        navigate("/bookings", {
          state: {
            experience,
            quantity,
            selectedDate,
            selectedTime,
            subtotal,
            tax,
            total,
          },
        });
      }
  };

  // ✅ Button active only if both date & time selected
  const isConfirmActive = selectedDate && selectedTime;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      {/* Image + Price section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-80 object-cover rounded-xl shadow-md"
          />
        </div>

        <div className="bg-gray-100 rounded-xl p-5 shadow-md h-fit">
          <div className="flex justify-between text-gray-700 text-sm mb-2">
            <p>Starts at</p>
            <p>₹{experience.price}</p>
          </div>

          <div className="flex justify-between items-center text-gray-700 text-sm mb-2">
            <p>Quantity</p>
            <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
              <button
                className="px-2 text-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="px-2 text-lg"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between text-gray-700 text-sm mb-2">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>

          <div className="flex justify-between text-gray-700 text-sm mb-4">
            <p>Taxes</p>
            <p>₹{tax}</p>
          </div>

          <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-lg">
            <p>Total</p>
            <p>₹{total}</p>
          </div>

          {/* ✅ Confirm button changes color dynamically */}
     <button
      className={`mt-4 w-full py-2 rounded-md font-medium transition-colors ${
        isConfirmActive
          ? "bg-[#FED642] text-black hover:bg-yellow-400"
          : "bg-gray-300 text-gray-700 cursor-not-allowed"
      }`}
      disabled={!isConfirmActive}
      onClick={handleConfirm}
    >
      Confirm
    </button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">{experience.title}</h2>
        <p className="text-gray-500 text-sm mb-3">{experience.location}</p>
        <p className="text-gray-700 leading-relaxed">{experience.description}</p>
      </div>

      {/* Slot Selection */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Choose date</h3>
        <div className="flex flex-wrap gap-2">
          {experience.slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(slot.date)}
              className={`px-4 py-2 text-sm border rounded-md transition ${
                selectedDate === slot.date
                  ? "bg-yellow-300 border-yellow-500"
                  : "bg-gray-100 hover:bg-yellow-100"
              }`}
            >
              {formatDate(slot.date)}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Choose time</h3>
        <div className="flex flex-wrap gap-2">
          {experience.slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedTime(slot.time)}
              className={`px-4 py-2 text-sm border rounded-md transition ${
                selectedTime === slot.time
                  ? "bg-yellow-300 border-yellow-500"
                  : "bg-gray-100 hover:bg-yellow-100"
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md">
          Scenic routes, trained guides, and safety briefing. Minimum age 10.
        </p>
      </div>
    </div>
  );
};

export default ExperienceDetail;
