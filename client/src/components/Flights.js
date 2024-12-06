import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookFlight } from '../services/api';
import logo from '../images/logo.png';

const Flights = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/searchFlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, departureDate, returnDate, adults }),
      });

      const result = await response.json();
      if (response.ok) {
        setFlights(result.flights);
      } else {
        setError(result.message || 'No flights found for this search.');
      }
    } catch (err) {
      setError('Failed to fetch flights. Please try again later.');
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Search Flights</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="flex gap-4 flex-wrap">
          <label className="flex-1">
            <span className="block text-sm font-semibold text-gray-600">Origin:</span>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex-1">
            <span className="block text-sm font-semibold text-gray-600">Destination:</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex gap-4 flex-wrap">
          <label className="flex-1">
            <span className="block text-sm font-semibold text-gray-600">Departure Date:</span>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex-1">
            <span className="block text-sm font-semibold text-gray-600">Return Date:</span>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex gap-4 flex-wrap">
          <label className="flex-1">
            <span className="block text-sm font-semibold text-gray-600">Adults:</span>
            <input
              type="number"
              value={adults}
              min="1"
              onChange={(e) => setAdults(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white bg-brandBlue rounded-md hover:bg-logoOrange"
        >
          Search Flights
        </button>
      </form>

      {/* Loading, Error Handling, and Search Results */}
      {loading ? (
        <p className="mt-4 text-center text-lg text-gray-600">Loading...</p>
      ) : error ? (
        <p className="mt-4 text-center text-red-500">{error}</p>
      ) : flights.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Search Results:</h2>
          <div className="space-y-6 mt-4">
            {flights.map((flight, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-gray-800">Flight Offer {index + 1}</h3>
                <div className="flex justify-between mt-4">
                  <div className="text-gray-600">
                    <strong>Price:</strong> {flight.price?.total} {flight.price?.currency}
                  </div>
                  <div className="text-gray-600">
                    <strong>Departure:</strong> {flight.itineraries[0]?.segments[0]?.departure?.iataCode}
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-gray-600">
                    <strong>Arrival:</strong> {flight.itineraries[0]?.segments.slice(-1)[0]?.arrival?.iataCode}
                  </div>
                  <div className="text-gray-600">
                    <strong>Duration:</strong> {flight.itineraries[0]?.duration}
                  </div>
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

export default Flights;
