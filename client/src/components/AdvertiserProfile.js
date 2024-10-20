import React, { useState, useEffect } from 'react';
import { getAdvertiserProfile, updateAdvertiserProfile } from '../services/api'; // Import the API functions
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const AdvertiserProfile = () => {
    const [advertiser, setAdvertiser] = useState(null); // State to store advertiser profile
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Type: '',
        Link_to_website: '',
        Hotline: '',
        Company_Profile: '',
        Company_Name: ''
    });

    // Fetch the advertiser profile on component load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored after login
                const profileData = await getAdvertiserProfile(email); // Fetch profile by email
                setAdvertiser(profileData.data); // Set fetched profile in state
                setFormData(profileData.data); // Pre-fill form with fetched data
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    // Function to handle when "Edit" button is clicked
    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update form data as the user types
    };

    // Function to save the updated profile
    const handleSave = async () => {
        try {
            await updateAdvertiserProfile(formData); // Send the updated form data to the API
            setIsEditing(false); // Exit edit mode after saving
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // Render loading state if profile is not yet loaded
    if (!advertiser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100">
            {/* Navigation bar */}
            <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-16" />
                <Link to="/AdvertiserHome" className="text-lg font-medium text-white hover:text-blue-500">
                    Home
                </Link>
            </div>

            {/* Main profile section */}
            <div className="flex items-center justify-center flex-grow pt-6">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-32 h-32 rounded-full bg-brandBlue text-white text-center flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold">{advertiser.Username.charAt(0)}</span> {/* Initial */}
                        </div>
                        <h2 className="text-3xl font-bold text-brandBlue mb-2">{advertiser.Company_Name}</h2>
                        <p className="text-gray-600 mb-4">{advertiser.Link_to_website}</p>
                        <button
                            className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile Content */}
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
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue bg-gray-100"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Link to Website:</label>
                                        <input
                                            type="text"
                                            name="Link_to_website"
                                            value={formData.Link_to_website}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Hotline:</label>
                                        <input
                                            type="text"
                                            name="Hotline"
                                            value={formData.Hotline}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Company Profile:</label>
                                        <input
                                            type="text"
                                            name="Company_Profile"
                                            value={formData.Company_Profile}
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
                            <p><strong>Username:</strong> {advertiser.Username}</p>
                            <p><strong>Email:</strong> {advertiser.Email}</p>
                            <p><strong>Link to Website:</strong> {advertiser.Link_to_website}</p>
                            <p><strong>Hotline:</strong> {advertiser.Hotline}</p>
                            <p><strong>Company Profile:</strong> {advertiser.Company_Profile}</p>
                            <p><strong>Company Name:</strong> {advertiser.Company_Name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
                <p>&copy; 2024 Advertiser Profile. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdvertiserProfile;
