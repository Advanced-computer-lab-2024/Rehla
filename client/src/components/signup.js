import React, { useState } from 'react';
import { registerTourist } from '../services/api';
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png'; // Assuming your logo is stored in the assets folder
import signInImage from '../images/signImage.jpg'; // Replace with your actual image path


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
      {/* Header */}
      <div className="w-full mx-auto px-6 py-1 bg-black shadow-md flex justify-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-44" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex h-full">
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
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-black text-center mb-6">
          Join as a Tourist!
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Create an account to start your journey
        </p>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username and Email side by side */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="Username"
                value={formin.Username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="Email"
                value={formin.Email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="Password"
              value={formin.Password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Number and Nationality */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                name="Mobile_Number"
                value={formin.Mobile_Number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your mobile number"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nationality
              </label>
              <input
                type="text"
                name="Nationality"
                value={formin.Nationality}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your nationality"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="DOB"
              value={formin.DOB}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Job/Student Dropdown */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Job or Student
            </label>
            <select
              name="Job_Student"
              value={formin.Job_Student}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select an option</option>
              <option value="Job">Job</option>
              <option value="Student">Student</option>
            </select>
          </div>

          {/* Not a Tourist? Link */}
          <div className="text-center">
            <Link to="/signup2" className="text-black hover:underline">
              Not a Tourist?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
      </div>
      

      {/* Footer */}
      <footer className="w-full bg-black py-4 text-center text-white">
        <p>&copy; {new Date().getFullYear()} Rehla. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GetTourist;
