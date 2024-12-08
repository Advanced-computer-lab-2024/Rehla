import React, { useState } from "react";
import { signIn, acceptTerms } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import logo from '../images/logoWhite.png'; // Assuming logo is in the same path as in the Home component
import signInImage from '../images/signImage.jpg'; // Replace with your actual image path

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [termsAccepted, setTermsAccepted] = useState(false); // Checkbox state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signIn(email, password);

      if (data && data.status === 403) {
        // If the response is 403, show the modal to accept terms
        setShowModal(true);
      } else {
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
          case "TOURISM GOVERNOR":
            navigate("/TourisimGovernerHome");
            break;
          default:
            setError("Unknown user type");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  };

  const handleAcceptTerms = async () => {
    if (termsAccepted) {
      try {
        await acceptTerms(email); // Update terms accepted status on the backend
        setShowModal(false); // Close the modal
        // You can also proceed to navigate if you want after accepting terms
        //navigate("/TouristHome");
      } catch (err) {
        setError("Failed to accept terms");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-44" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex h-[calc(90vh-90px)]">
        {/* Left Section with Image and Text Overlay */}
        <div className="w-1/2 relative">
          <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dimmer Overlay */}
          <img
            src={signInImage}
            alt="Sign In"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold px-4 text-center">
              Discover. Connect. Explore.
            </h2>
          </div>
        </div>


       {/* Right Section with Sign-In Form */}
<div className="w-1/2 flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
    <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
      Welcome Back!
    </h2>
    <p className="text-gray-500 text-center mb-8">
      Please sign in to continue
    </p>
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your password"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-6 text-center">{error}</p>}
      <div className="flex items-center justify-between mb-6">
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
        >
          Sign In
        </button>
      </div>
      <div className="text-center">
        <a
          href="/forgot-password"
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </a>
      </div>
    </form>
  </div>
</div>

      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} Rehla. All rights reserved.</p>
      </footer>

      {/* Terms Acceptance Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Please Accept Terms and Conditions</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <span className="ml-2">I accept the terms and conditions</span>
            </div>
            <div className="mt-4">
              <button
                onClick={handleAcceptTerms}
                disabled={!termsAccepted}
                className={`w-full bg-black text-white py-2 rounded-lg ${
                  !termsAccepted ? "opacity-50" : "opacity-100"
                }`}
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default SignIn;
