import React, { useEffect, useState } from 'react';
import { getSellerProfile, updateSellerProfile } from '../services/api'; // Import your API functions
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Assuming you have a logo file

const SellerProfile = () => {
    const [seller, setSeller] = useState({});
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Shop_Name: '',
        Description: '',
        Shop_Location: '',
        Type: ''
    });
    const navigate = useNavigate();

    // Fetch seller profile data when component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('email'); // Get email from local storage

            if (!email) {
                navigate('/login'); // Redirect to login if no email found
                return;
            }

            try {
                const response = await getSellerProfile({ Email: email });
                setSeller(response);
                setFormData(response); // Set form data for editing
            } catch (error) {
                setError('Failed to fetch profile. Please try again later.');
            }
        };

        fetchProfile();
    }, [navigate]);

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission for updating profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateSellerProfile(formData);
            setSeller(response.seller); // Update the seller state with the new data
            setIsEditing(false); // Stop editing mode
            setError(''); // Clear any previous errors
        } catch (error) {
            setError('Failed to update profile. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100">
            {/* Navigation Bar */}
            <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-16" />
                <div className="space-x-4">
                    <Link to="/SellerHome" className="text-lg font-medium text-white hover:text-blue-500">
                        Home
                    </Link>
                </div>
            </div>

            {/* Main Content with Padding */}
            <div className="flex flex-col items-center mb-8 mt-6"> {/* Added mt-6 for padding */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-32 h-32 rounded-full bg-brandBlue text-white text-center flex items-center justify-center mb-4">
                            <span className="text-4xl font-bold">{seller.Username?.charAt(0)}</span> {/* Initial */}
                        </div>
                        <h2 className="text-3xl font-bold text-brandBlue mb-1">{seller.Shop_Name}</h2>
                    </div>

                    {!isEditing ? (
                        <div className="space-y-4">
                            <p><strong>Username:</strong> {seller.Username}</p>
                            <p><strong>Email:</strong> {seller.Email}</p>
                            <p><strong>Shop Name:</strong> {seller.Shop_Name}</p>
                            <p><strong>Description:</strong> {seller.Description}</p>
                            <p><strong>Shop Location:</strong> {seller.Shop_Location}</p>
                            <p><strong>Type:</strong> {seller.Type}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700">Username:</label>
                                    <input
                                        type="text"
                                        name="Username"
                                        value={formData.Username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Email:</label>
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700">Password:</label>
                                    <input
                                        type="password"
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Shop Name:</label>
                                    <input
                                        type="text"
                                        name="Shop_Name"
                                        value={formData.Shop_Name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700">Description:</label>
                                    <textarea
                                        name="Description"
                                        value={formData.Description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Shop Location:</label>
                                    <input
                                        type="text"
                                        name="Shop_Location"
                                        value={formData.Shop_Location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700">Type:</label>
                                <input
                                    type="text"
                                    name="Type"
                                    value={formData.Type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                    required
                                />
                            </div>

                            <div className="space-x-4">
                                <button
                                    type="submit"
                                    className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
                <p>&copy; 2024 Seller Profile. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SellerProfile;
