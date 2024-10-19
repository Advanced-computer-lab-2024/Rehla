import React, { useState } from 'react';
import { registerRequest } from '../services/api'; // Import the API call function

const RegisterRequest = () => {
    const [employee, setEmployee] = useState({
        Username: '',
        Email: '',
        Password: '',
        Type: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerRequest(employee);
            setMessage('Request sent successfully!');
            console.log(response); // Log the response for debugging
        } catch (error) {
            setMessage('Error creating user: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-brandBlue text-center mb-6">Create Signup Request</h1>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username and Email side by side */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username:
                                <input
                                    type="text"
                                    name="Username"
                                    value={employee.Username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email:
                                <input
                                    type="email"
                                    name="Email"
                                    value={employee.Email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Password below Username and Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password:
                            <input
                                type="password"
                                name="Password"
                                value={employee.Password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                            />
                        </label>
                    </div>

                    {/* Type selection dropdown */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Type:
                            <select
                                name="Type"
                                value={employee.Type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                            >
                                <option value="">Select Type</option>
                                <option value="Tour Guide">Tour Guide</option>
                                <option value="Seller">Seller</option>
                                <option value="Advertiser">Advertiser</option>
                            </select>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                    >
                        Sign up
                    </button>
                </form>

                {message && <p className="text-center text-red-500 mt-4">{message}</p>} {/* Show success/error message */}
            </div>
        </div>
    );
};

export default RegisterRequest;
