import React, { useState } from 'react';
import { registerRequest, uploadGuestDocuments } from '../services/api'; // Import the API call function
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';  // Assuming your logo is stored in the assets folder
import signInImage from '../images/signImage.jpg'; // Replace with your actual image path

const RegisterRequest = () => {
    const [employee, setEmployee] = useState({
        Username: '',
        Email: '',
        Password: '',
        Type: ''
    });

    const [message, setMessage] = useState('');

    const [files, setFiles] = useState([]);

    const handleFileChange = (e, index) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles[index] = selectedFiles;
            return newFiles.flat();
        });
    };

    const handleFileUpload = async () => {
        try {
            const response = await uploadGuestDocuments(employee.Email, employee.Type, files);
            setMessage('Files uploaded successfully!');
            console.log(response); // Log the response for debugging
        } catch (error) {
            setMessage('Error uploading files: ' + error.message);
        }
    };

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
        <div className="min-h-screen flex flex-col justify-between items-center bg-gray-50">
            {/* Header */}
            <div className="w-full mx-auto px-6 py-1 bg-black shadow-md flex justify-center">
                <img src={logo} alt="Logo" className="w-44" />
            </div>

            {/* Main Content */}
            <div className="flex-grow flex h-full">
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
                {/* Form section */}
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mt-8">
                    <h1 className="text-3xl font-bold text-black text-center mb-6">Create Signup Request</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Tour Guide">Tour Guide</option>
                                    <option value="Seller">Seller</option>
                                    <option value="Advertiser">Advertiser</option>
                                </select>
                            </label>
                        </div>

                        {/* File upload fields */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Upload File 1:
                                <input
                                    type="file"
                                    name="files1"
                                    onChange={(e) => handleFileChange(e, 0)}
                                    multiple
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Upload File 2:
                                <input
                                    type="file"
                                    name="files2"
                                    onChange={(e) => handleFileChange(e, 1)}
                                    multiple
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={handleFileUpload}
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Upload Files
                        </button>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Sign up
                        </button>
                    </form>

                    {message && <p className="text-center text-red-500 mt-4">{message}</p>} {/* Show success/error message */}
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-black py-4 text-center text-white">
                <p>&copy; 2024 Employee Registration. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default RegisterRequest;
