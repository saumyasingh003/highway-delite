import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, setIsSearching } = useSearch();

  const handleSearch = () => {
    setIsSearching(true);
    // Reset searching state after a brief delay
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full shadow-md">
      {/* Main navbar */}
      <div className="bg-white flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 gap-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img
            src="logo.png"
            alt="Logo"
            className="h-14 w-auto md:h-16"
          />
        </div>

        {/* Search Section */}
        <div className="flex items-center w-full md:w-auto justify-center md:justify-end space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search experiences by name or location..."
            className="bg-gray-100 px-4 py-2 rounded-md w-full md:w-[450px] lg:w-[400px] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
          />
          <button 
            onClick={handleSearch}
            className="bg-[#FED643] hover:bg-yellow-500 text-black font-medium px-5 py-2 rounded-md whitespace-nowrap transition-all duration-300">
            Search
          </button>
        </div>
        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">Hello, {user.name}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700">Login</Link>
              <Link to="/register" className="text-sm text-gray-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
