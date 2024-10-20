
import React, { useState } from 'react';
import { registerTourist } from '../services/api';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png'; // Assuming your logo is stored in the assets folder

const GetTourist = () => {
    const [formin, setFormin] = useState({
        Username: '',
        Email: '',
        Password: '',
        Mobile_Number: '',
        Nationality: '',
        DOB: '',
        Job_Student: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormin({ ...formin, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerTourist(formin);
            setMessage('Tourist created successfully!');
            console.log(response);
        } catch (error) {
            setMessage('Error creating user: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between items-center bg-gray-100">
            {/* Logo and Home link section */}
            <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-16" />
                <Link to="/" className="text-lg font-medium text-white hover:text-blue-500">
                    Home
                </Link>
            </div>

            {/* Form section */}
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl mt-6">
                <h1 className="text-3xl font-bold text-brandBlue text-center mb-6">Tourist Sign Up</h1>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username and Email side by side */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username:
                                <input
                                    type="text"
                                    name="Username"
                                    value={formin.Username}
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
                                    value={formin.Email}
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
                                value={formin.Password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mobile Number and Nationality side by side */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mobile Number:
                                <input
                                    type="text"
                                    name="Mobile_Number"
                                    value={formin.Mobile_Number}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nationality:
                                <input
                                    type="text"
                                    name="Nationality"
                                    value={formin.Nationality}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Date of Birth below Mobile Number and Nationality */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Date of Birth:
                            <input
                                type="date"
                                name="DOB"
                                value={formin.DOB}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                            />
                        </label>
                    </div>

                    {/* Job/Student Dropdown */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Job or Student:
                            <select
                                name="Job_Student"
                                value={formin.Job_Student}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                            >
                                <option value="">Select Job</option>
                                <option value="Job">Job</option>
                                <option value="Student">Student</option>
                            </select>
                        </label>
                    </div>

                    <Link
                        to="/signup2"
                        className="text-brandBlue hover:underline mb-4 block text-center"
                    >
                        Not a Tourist?
                    </Link>

                    <button
                        type="submit"
                        className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                    >
                        Sign up
                    </button>
                </form>
                {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            </div>

            {/* Footer */}
            <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
            <p>&copy; {new Date().getFullYear()} Rehla. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default GetTourist;
