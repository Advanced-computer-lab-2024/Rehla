import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookHotel } from '../services/api';
import logo from '../images/logo.png';

const Hotels = () => {
  const [hotelName, setHotelName] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:8000/searchHotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelName, cityCode, checkInDate, checkOutDate, numberOfGuests, numberOfRooms }),
      });
  
      const result = await response.json();
      console.log("API Response:", result); // Log the response
  
      if (response.ok) {
        setHotels(result.hotels);
      } else {
        setError(result.message || 'No hotels found for this search.');
      }
    } catch (err) {
      console.error("Error occurred:", err); // Log the error
      setError('Failed to fetch hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = async (hotel) => {
    const touristEmail = localStorage.getItem('email'); // Get Tourist_Email from localStorage
    if (!touristEmail) {
      alert('Tourist email not found. Please log in.');
      return;
    }

    try {
      const response = await bookHotel({
        Tourist_Email: touristEmail,
        Hotel_Name: hotel.name,
        Hotel_Location: cityCode,
        Check_In: checkInDate,
        Check_Out: checkOutDate,
      });

      if (response.status === 201) {
        alert('Hotel booking created successfully.');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      alert('Failed to book hotel. Please try again later.');
    }
  };

  return (
    <div>
      <div className="NavBar">
        <img src={logo} alt="Logo" />
        <nav className="main-nav">
          <ul className="nav-links">
            <Link to="/TouristHome">Home</Link>
          </ul>
        </nav>
      </div>

      <div className="max-w-full mx-auto p-24">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Search Hotels</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex gap-4 flex-wrap">
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-600">Hotel Name:</span>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-600">City Code:</span>
              <input
                type="text"
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex gap-4 flex-wrap">
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-600">Check-in Date:</span>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-600">Check-out Date:</span>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex gap-4 flex-wrap">
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-600">Number of Guests:</span>
              <input
                type="number"
                value={numberOfGuests}
                min="1"
                onChange={(e) => setNumberOfGuests(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-600">Number of Rooms:</span>
              <input
                type="number"
                value={numberOfRooms}
                min="1"
                onChange={(e) => setNumberOfRooms(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-brandBlue rounded-md hover:bg-logoOrange"
          >
            Search Hotels
          </button>
        </form>

        {/* Loading, Error Handling, and Search Results */}
        {loading ? (
          <p className="mt-4 text-center text-lg text-gray-600">Loading...</p>
        ) : error ? (
          <p className="mt-4 text-center text-red-500">{error}</p>
        ) : hotels.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">Search Results:</h2>
            <div className="space-y-6 mt-4">
              {hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
                  <div className="flex flex-col justify-between mt-4">
                  <div className="text-gray-600">
                    <div>
                      <strong>Location:</strong> {cityCode}
                    </div>
                    <div>
                      <strong>Check-in:</strong> {hotel.checkInDate}
                    </div>
                    <div>
                      <strong>Check-out:</strong> {hotel.checkOutDate}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookHotel(hotel)}
                    className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Book Hotel
                  </button>
                </div>

                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
        <div className="w-full mx-auto md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img src={logo} className="w-12" alt="Flowbite Logo" />
            </a>
            <div className="flex justify-center w-full">
              <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 -ml-14">
                <li>
                  <a href="/" className="hover:underline me-4 md:me-6">About</a>
                </li>
                <li>
                  <a href="/" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                  <a href="/" className="hover:underline me-4 md:me-6">Licensing</a>
                </li>
                <li>
                  <a href="/" className="hover:underline">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Hotels;
