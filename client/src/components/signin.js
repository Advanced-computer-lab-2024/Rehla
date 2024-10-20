
import React, { useState } from "react";
import { signIn } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import logo from '../images/logo.png'; // Assuming logo is in the same path as in the Home component

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signIn(email, password);
      localStorage.setItem('email', email);

      const userType = data.Type.toUpperCase();

      switch (userType) {
        case "TOURIST":
          navigate("/TouristHome");
          break;
        case "ADMIN":
          navigate("/AdminHome");
          break;
        case "SELLER":
          navigate("/SellerHome");
          break;
        case "TOUR_GUIDE":
        case "TOUR GUIDE":
          navigate("/TourGuideHome");
          break;
        case "ADVERTISER":
          navigate("/AdvertiserHome");
          break;
        case "TOURISIM_GOVERNER":
        case "TOURISIM GOVERNER":
          navigate("/TourisimGovernerHome");
          break;
        default:
          setError("Unknown user type");
      }
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar */}
      <div className="bg-brandBlue shadow-md w-full mx-auto px-6 py-4 h-20 flex justify-between items-center ">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-20" />

        {/* Main Navigation */}
        <nav className="flex space-x-6">
        <Link to="/" className="text-lg font-medium text-white hover:text-blue-500">
          Home
        </Link>
        </nav>
      </div>

      {/* Sign In Form */}
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-brandBlue text-center mb-6">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brandBlue text-white py-6 text-center">
      <p>&copy; {new Date().getFullYear()} Rehla. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignIn;
