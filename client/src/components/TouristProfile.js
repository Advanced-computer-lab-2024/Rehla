import React, { useState, useEffect } from 'react';
import { getTouristProfile, updateTouristProfile } from '../services/api'; // Import API functions
import { Link } from 'react-router-dom';
import logo from '../images/logo.png'; // Replace with your logo path

const TouristProfile = () => {
  const [tourist, setTourist] = useState(null); // State for storing tourist profile
  const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    Mobile_Number: '',
    Nationality: '',
    Job_Student: ''
  });

  // Fetch tourist profile on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email'); // Assuming email is stored after login
        const profileData = await getTouristProfile({ Email: email });
        setTourist(profileData); // Set profile data
        setFormData(profileData); // Pre-fill form with fetched data
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data as user types
  };

  // Function to save the updated profile
  const handleSave = async () => {
    try {
      await updateTouristProfile(formData); // Send the updated form data to the API
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Function to enable edit mode
  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  if (!tourist) {
    return <div>Loading...</div>; // Render loading state if profile is not loaded yet
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Navigation Bar */}
      <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-16" />
        <Link to="/TouristHome" className="text-lg font-medium text-white hover:text-blue-500">
          Home
        </Link>
      </div>

      {/* Main Profile Section */}
      <div className="flex items-center justify-center flex-grow pt-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-brandBlue text-white text-center flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">{tourist.Username.charAt(0)}</span> {/* Initial */}
            </div>
            <h2 className="text-3xl font-bold text-brandBlue mb-2">{tourist.Username}</h2> {/* Replaced Email with Username */}
            <button
              className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Content or Form */}
          {isEditing ? (
            <div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                    <input
                      type="text"
                      name="Username"
                      value={formData.Username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                      type="password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number:</label>
                    <input
                      type="text"
                      name="Mobile_Number"
                      value={formData.Mobile_Number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nationality:</label>
                    <input
                      type="text"
                      name="Nationality"
                      value={formData.Nationality}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job/Student:</label>
                    <input
                      type="text"
                      name="Job_Student"
                      value={formData.Job_Student}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                >
                  Save Profile
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4 text-gray-700">
              <p><strong>Username:</strong> {tourist.Username}</p>
              <p><strong>Email:</strong> {tourist.Email}</p>
              <p><strong>Mobile Number:</strong> {tourist.Mobile_Number}</p>
              <p><strong>Nationality:</strong> {tourist.Nationality}</p>
              <p><strong>Job/Student:</strong> {tourist.Job_Student}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
        <p>&copy; 2024 Tourist Profile. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TouristProfile;
