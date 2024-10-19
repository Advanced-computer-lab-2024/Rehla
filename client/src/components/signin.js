import React, { useState } from "react";
import { signIn } from "../services/api";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
  );
};

export default SignIn;
