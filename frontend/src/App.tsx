import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Experiences from "./components/Experience";
import ExperienceDetail from "./components/ExperienceDetail";
import Booking from "./components/Booking";
import Payment from "./components/Payment";
import Login from "./components/Login";
import Register from "./components/Register";
import PromoValidate from "./components/PromoValidate";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Experiences />} />
            <Route 
              path="/experiences/:id" 
              element={
                <ProtectedRoute>
                  <ExperienceDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment" 
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/promo/validate" 
              element={
                <ProtectedRoute>
                  <PromoValidate />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
