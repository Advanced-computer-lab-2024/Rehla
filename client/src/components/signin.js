import React, { useState } from "react";
import { signIn } from "../services/api"; // Your API function
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const data = await signIn(email, password); // Call API to sign in

      // Check user type and redirect to appropriate page
      const userType = data.Type.toUpperCase(); // Convert type to uppercase for easier comparison

      switch (userType) {
        case "TOURIST":
          navigate("/TouristHome"); // Redirect to TouristHome.js
          break;
        case "ADMIN":
          navigate("/AdminHome"); // Redirect to AdminHome.js
          break;
        case "SELLER":
          navigate("/SellerHome"); // Redirect to SellerHome.js
          break;
        case "TOUR_GUIDE":
          navigate("/TourGuideHome"); // Redirect to TourGuideHome.js
          break;
        case "ADVERTISER":
          navigate("/AdvertiserHome"); // Redirect to AdvertiserHome.js
          break;
        default:
          setError("Unknown user type");
      }
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
