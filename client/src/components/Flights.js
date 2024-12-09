import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookFlight } from '../services/api';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';

import {
  getTouristProfile ,markAsSeen , getAllNotifications } from '../services/api';

const Flights = () => {

  const handleNotificationClick = async () => {
    setShowModal(true); // Show the modal when the notification icon is clicked

    try {
        const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
        if (!storedEmail) {
            throw new Error("User email not found in local storage.");
        }

        // Mark all unseen notifications for the user as seen
        for (const notification of notifications) {
            if (!notification.seen) {
                await markAsSeen(notification._id); // Mark as seen
            }
        }

        // Refresh the notifications for the signed-in user
        const updatedNotifications = await getAllNotifications(storedEmail);
        setNotifications(updatedNotifications); // Set updated notifications
    } catch (error) {
        console.error("Error marking notifications as seen:", error);
    }
};
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    Mobile_Number: '',
    Nationality: '',
    Job_Student: '',
    Type: '',
    Points: 0, 
    Badge: '',
  });

  const [notifications, setNotifications] = useState([]); // State for notifications
  const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        const profileData = await getTouristProfile({ Email: email });
        //setTourist(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
}, []);

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

  const handleBookFlight = async (flight) => {
    const Tourist_Email = localStorage.getItem('email');
    const flightDetails = {
      Tourist_Email,
      Flight_Name: flight.name,
      Price: flight.price?.total,
      Departure_Date: flight.itineraries[0]?.segments[0]?.departure?.at,
      Return_Date: flight.itineraries[0]?.segments.slice(-1)[0]?.arrival?.at,
      Departure: flight.itineraries[0]?.segments[0]?.departure?.iataCode,
      Arrival: flight.itineraries[0]?.segments.slice(-1)[0]?.arrival?.iataCode,
      Duration: flight.itineraries[0]?.duration,
    };

    try {
      const response = await bookFlight(flightDetails);
      if (response.ok) {
        alert('Flight booked successfully!');
      } else {
        alert('Failed to book flight.');
      }
    } catch (err) {
      alert('An error occurred while booking the flight.');
    }
  };

  return (
    <div>
    <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    <div className="flex items-center ml-auto">
                        <nav id="cart" className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/Cart">
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </Link>
                        </nav>
                        {/* Notification Icon */}
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <div id="notification" className="relative ml-2"> {/* Reduced ml-4 to ml-2 */}
                                <FontAwesomeIcon
                                    icon={faBell}
                                    size="1x" // Increased the size to 2x
                                    onClick={handleNotificationClick}
                                    className="cursor-pointer text-white" // Added text-white to make the icon white
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </nav>
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/TouristHome/TouristProfile">
                                {/* Profile Picture */}
                                <div id="view-prof" className="">
                                    {formData.Profile_Pic ? (
                                        <img
                                            src={formData.Profile_Pic}
                                            alt={`${formData.Name}'s profile`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-black text-white text-center flex items-center justify-center border-4 border-white">
                                            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </nav>
                    </div>


                </div>

                {/* Main Navigation */}
                <nav className="flex space-x-6">
                    <Link to="/" className="text-lg font-medium text-white hover:text-logoOrange ">
                        Home
                    </Link>
                    <Link to="/UpcomingActivities" className="text-lg font-medium text-white hover:text-logoOrange">
                        Activities
                    </Link>
                    <Link to="/UpcomingItineraries" className="text-lg font-medium text-white hover:text-logoOrange">
                        Itineraries
                    </Link>
                    <Link to="/HistoricalPlaces" className="text-lg font-medium text-white hover:text-logoOrange">
                        Historical Places
                    </Link>
                    <Link to="/Museums" className="text-lg font-medium text-white hover:text-logoOrange">
                        Museums
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-white hover:text-logoOrange">
                        Gift Shop
                    </Link>
                    <Link to="/MyEvents" className="text-lg font-medium text-white hover:text-logoOrange">
                        MyEvents
                    </Link>
                    <Link to="/Flights" className="text-lg font-medium text-logoOrange">
                        Flights
                    </Link>
                    <Link to="/Hotels" className="text-lg font-medium text-white hover:text-logoOrange">
                        Hotels
                    </Link>
                    <Link to="/Transportation" className="text-lg font-medium text-white hover:text-logoOrange">
                        Transportation
                    </Link>
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
          className="w-full py-3 text-white bg-black rounded-full hover:bg-logoOrange"
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
                <button
                  onClick={() => handleBookFlight(flight)}
                  className="mt-4 py-2 px-4 bg-logoOrange text-white rounded-md"
                >
                  Book Flight
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
    <footer className="bg-black shadow dark:bg-black m-0">
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
