import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Booking: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    promo: "",
    agree: false,
  });
  const [promoError, setPromoError] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const validateForm = () => {
    const errors: { name?: string; email?: string } = {};

    if (!form.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!form.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Please enter a valid email';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Expect booking data from router state (pushed from ExperienceDetail)
  const state = (location.state || {}) as any;
  const experience = state.experience;
  const quantity = state.quantity ?? 1;
  const date = state.selectedDate ?? "";
  const time = state.selectedTime ?? "";
  const subtotal = state.subtotal ?? 0;
  const tax = state.tax ?? 0;
  const discount = state.discount ?? 0;
  const total = state.total ?? (subtotal + tax - discount);
  const promoCode = state.promoCode ?? "";

  // Restore form state from location state
  React.useEffect(() => {
    // Restore previous form state if available
    if (state.formState) {
      setForm(state.formState);
    }
    // Set promo code if it was passed from PromoValidate
    else if (promoCode) {
      setForm(prev => ({ ...prev, promo: promoCode }));
    }
  }, [state.formState, promoCode]);

  const handleGetPromo = () => {
    // Navigate to promo validation page with current booking data
    navigate("/promo/validate", {
      state: {
        experience,
        quantity,
        selectedDate: date,
        selectedTime: time,
        subtotal,
        tax,
        total
      }
    });
  };

  const handleApplyPromo = async () => {
    if (!form.promo) return;

    try {
            if (!validateForm()) {
              return; // Stop if validation fails
            }

      // Validate the entered promo code
      const response = await axios.post("http://localhost:5000/api/promo/validate", {
        code: form.promo,
        userId: state.userId // Pass user ID if available
      });
      
      const promo = response.data.discount;
      let newDiscount = 0;
      if (promo.discountType === "PERCENT") {
        newDiscount = (subtotal * promo.value) / 100;
      } else {
        newDiscount = promo.value;
      }

      // Update total with discount
      const newTotal = subtotal + tax - newDiscount;
      
      // Update the location state with new values while preserving form state
      navigate("", {
        state: {
          ...state,
          discount: newDiscount,
          total: newTotal,
          promoCode: form.promo,
          promoDetails: promo, // Store the full promo details
          formState: form // Preserve form state
        },
        replace: true
      });
      
      setPromoError("");
    } catch (error) {
      setPromoError("Unable to apply promo code. Please try again.");
    }
  };

  // If no booking state provided, show a friendly message
  if (!experience) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center text-gray-600">
          No booking information found. Please select an experience first.
        </p>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="bg-[#FED642] px-4 py-2 rounded-md"
          >
            Browse Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Form */}
      <div className="md:col-span-2">
        <h2 className="text-lg font-medium mb-4">Checkout</h2>

        <div className="bg-gray-100 p-6 rounded-xl shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full mt-1 p-2 rounded-md bg-white border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-yellow-300 outline-none`}
              />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full mt-1 p-2 rounded-md bg-white border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-yellow-300 outline-none`}
              />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={form.promo}
                  onChange={(e) => {
                    setForm({ ...form, promo: e.target.value.toUpperCase() });
                    // Clear error when user starts typing
                    if (promoError) setPromoError("");
                  }}
                  className={`w-full p-2 rounded-md bg-white border ${
                    promoError ? 'border-red-300' : state.promoCode ? 'border-green-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-yellow-300 outline-none uppercase`}
                  disabled={state.promoCode !== undefined}
                />
                {state.promoCode && (
                  <p className="text-xs text-green-600 mt-1">Promo code applied successfully!</p>
                )}
              </div>
              {!state.promoCode ? (
                <button 
                  onClick={handleApplyPromo}
                  className="bg-black text-white px-4 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
                  disabled={!form.promo}
                >
                  Apply
                </button>
              ) : (
                <button 
                  onClick={() => {
                    // Remove promo code while preserving other form state
                    const updatedForm = { ...form, promo: '' };
                    setForm(updatedForm);
                    navigate('', {
                      state: {
                        ...state,
                        promoCode: undefined,
                        discount: 0,
                        total: subtotal + tax,
                        formState: updatedForm
                      },
                      replace: true
                    });
                  }}
                  className="bg-red-500 text-white px-2  py-0 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
            {promoError && <p className="text-red-500 text-sm">{promoError}</p>}
            
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <button
              onClick={handleGetPromo}
              className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center justify-center gap-1 w-full"
            >
              <span>Get a random promo code</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              className="accent-yellow-400"
            />
            <label className="text-sm text-gray-600">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>
      </div>

      {/* Right: Summary Card */}
      <div className="bg-gray-100 rounded-xl shadow-sm p-6 h-fit">
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <p>Experience</p>
            <p className="font-medium">{experience.title}</p>
          </div>
          <div className="flex justify-between">
            <p>Date</p>
            <p>{date}</p>
          </div>
          <div className="flex justify-between">
            <p>Time</p>
            <p>{time}</p>
          </div>
          <div className="flex justify-between">
            <p>Qty</p>
            <p>{quantity}</p>
          </div>

          <div className="border-t border-gray-300 my-3" />

          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Taxes</p>
            <p>₹{tax}</p>
          </div>
          
          {discount > 0 && (
            <>
              <div className="flex justify-between text-green-600">
                <div className="flex items-center gap-1">
                  <p>Promo Discount</p>
                  <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                    {promoCode}
                  </span>
                </div>
                <p>-₹{discount}</p>
              </div>
              <p className="text-xs text-green-600 text-right mt-0.5">
                Promo code applied successfully!
              </p>
            </>
          )}

          <div className="border-t border-gray-300 my-3" />

          <div className="flex justify-between text-lg font-semibold">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
        </div>

        <button
          onClick={async () => {
            // Use validateForm helper to check fields
            if (!validateForm()) return;

            try {
              const bookingData = {
                userName: form.name,
                email: form.email,
                experienceId: experience._id,
                date,
                time,
                totalPrice: total,
                promoCode: promoCode || undefined,
              };

              const response = await axios.post('http://localhost:5000/api/bookings', bookingData);

              if (response.status === 201) {
                navigate('/payment', {
                  state: {
                    bookingId: response.data.booking._id,
                    amount: total,
                  },
                });
              }
            } catch (error: any) {
              alert(error.response?.data?.message || 'Error creating booking');
            }
          }}
          className={`mt-5 w-full py-2 rounded-md font-medium transition ${
            form.agree && form.name && form.email
              ? 'bg-[#FED642] hover:bg-yellow-400 text-black'
              : 'bg-gray-300 text-gray-700 cursor-not-allowed'
          }`}
          disabled={!form.agree || !form.name || !form.email}
        >
          Pay and Confirm
        </button>
      </div>
    </div>
  );
};

export default Booking;
