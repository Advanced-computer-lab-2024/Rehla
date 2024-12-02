import React, { useState } from "react";
import { signIn, acceptTerms } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import logo from '../images/logo.png'; // Assuming logo is in the same path as in the Home component

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
          case "Tourism Governor":
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
      {/* Navigation bar */}
      <div className="bg-brandBlue shadow-md w-full mx-auto px-6 py-4 h-20 flex justify-between items-center ">
        <img src={logo} alt="Logo" className="w-20" />
        <nav className="flex space-x-6">
          <Link to="/" className="text-lg font-medium text-white hover:text-blue-500">Home</Link>
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
                className={`w-full bg-brandBlue text-white py-2 rounded-lg ${!termsAccepted ? "opacity-50" : "opacity-100"}`}
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
