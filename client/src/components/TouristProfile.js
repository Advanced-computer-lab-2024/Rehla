import React, { useState, useEffect } from 'react';
import { getTouristProfile, updateTouristProfile, gettouristprofilepic } from '../services/api';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const TouristProfile = () => {
  const [tourist, setTourist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    Mobile_Number: '',
    Nationality: '',
    Job_Student: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // State to hold the image preview

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        const profileData = await getTouristProfile({ Email: email });
        setTourist(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateTouristProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    window.location.reload();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

 


  if (!tourist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-16" />
        <Link to="/TouristHome" className="text-lg font-medium text-white hover:text-blue-500">
          Home
        </Link>
      </div>

      <div className="flex items-center justify-center flex-grow pt-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
          <div className="flex flex-col items-center mb-8">
            {tourist.profilePicture ? (
              <img
                src={tourist.profilePicture}
                alt={`${tourist.Username}'s Profile`}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-brandBlue text-white text-center flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">{tourist.Username.charAt(0)}</span>
              </div>
            )}
            <h2 className="text-3xl font-bold text-brandBlue mb-2">{tourist.Username}</h2>
            <button
              className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
              onClick={handleEdit}
            >
              Edit Profile
            </button >
          </div>

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
                  onClick={() => window.location.reload()}
                  className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
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
              <p><strong>Nationality:</strong> {tourist.Nationality }</p>
              <p><strong>Job/Student:</strong> {tourist.Job_Student}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
        <p>&copy; 2024 Tourist Profile. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TouristProfile;