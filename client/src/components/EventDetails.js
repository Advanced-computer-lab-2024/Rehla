import React, { useEffect, useState } from 'react';
import { readActivity, getItineraryByName } from '../services/api'; // Adjust the import path as needed
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const EventDetails = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const selectedName = localStorage.getItem('selectedName');
                const selectedType = localStorage.getItem('selectedType');
                setName(selectedName);
                setType(selectedType);

                console.log('Selected Name:', selectedName);
                console.log('Selected Type:', selectedType);

                if (selectedType === 'activity') {
                    const response = await readActivity(selectedName);
                    console.log('Activity Response:', response);
                    if (response && response.data) {
                        setDetails(response.data);
                    } else {
                        throw new Error('Invalid response structure for activity');
                    }
                } else if (selectedType === 'itinerary') {
                    const response = await getItineraryByName(selectedName);
                    console.log('Itinerary Response:', response);

                    if (response && response.data) {
                        setDetails(response.data);
                    } else if (response && response.itinerary) {
                        setDetails(response.itinerary);
                    } else if (response) {
                        setDetails(response);
                    } else {
                        throw new Error('Invalid response structure for itinerary');
                    }
                }
            } catch (err) {
                console.error('Error fetching details:', err);
                setError(err.message || 'Failed to fetch details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    return (
        <div>
            {/* Header Section */}
            <div className="NavBar flex items-center justify-between p-4 bg-brandBlue shadow-md">
                <img src={logo} alt="Logo" className="h-12" />
                <nav className="main-nav">
                    <ul className="nav-links flex space-x-6">
                        <Link to="/TouristHome" className="text-white font-medium hover:underline">Home</Link>
                    </ul>
                </nav>
                <nav className="signing">
                    <Link to="/TourGuideHome/TourGuideProfile" className="text-white font-medium hover:underline">
                        My Profile
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="p-6 mt-16"> {/* Added margin below the header */}
              <h1 className="text-2xl font-bold mb-4 text-center">Event Details</h1>
                {details && (
                    <div className="mt-4">
                        {details.Picture && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={details.Picture}
                                    alt={type === 'activity' ? details.Name || 'Activity' : details.Itinerary_Name || 'Itinerary'}
                                    className="rounded-lg shadow-lg w-3/4 h-64 object-cover" // Adjusted image height
                                />
                            </div>
                        )}
                       
                        {type === 'activity' ? (
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <p><strong>Name:</strong> {details.Name || 'N/A'}</p>
                                <p><strong>Location:</strong> {details.Location || 'N/A'}</p>
                                <p><strong>Time:</strong> {details.Time || 'N/A'}</p>
                                <p><strong>Duration:</strong> {details.Duration || 'N/A'}</p>
                                <p><strong>Price:</strong> ${details.Price || 'N/A'}</p>
                                <p><strong>Date:</strong> {details.Date ? new Date(details.Date).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Rating:</strong> {details.Rating || 'N/A'}</p>
                                <p><strong>Created By:</strong> {details.Created_By || 'N/A'}</p>
                                <p><strong>Available Spots:</strong> {details.Available_Spots || 'N/A'}</p>
                                <p><strong>Booked Spots:</strong> {details.Booked_Spots || 'N/A'}</p>
                                <p><strong>Flagged:</strong> {details.Flagged ? 'Yes' : 'No'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <p><strong>Itinerary Name:</strong> {details.Itinerary_Name || 'N/A'}</p>
                                <p><strong>Timeline:</strong> {details.Timeline || 'N/A'}</p>
                                <p><strong>Duration:</strong> {details.Duration || 'N/A'}</p>
                                <p><strong>Language:</strong> {details.Language || 'N/A'}</p>
                                <p><strong>Tour Price:</strong> ${details.Tour_Price || 'N/A'}</p>
                                <p><strong>Available Date & Time:</strong> {details.Available_Date_Time ? new Date(details.Available_Date_Time).toLocaleString() : 'N/A'}</p>
                                <p><strong>Accessibility:</strong> {details.Accessibility ? 'Yes' : 'No'}</p>
                                <p><strong>Pick-Up Point:</strong> {details.Pick_Up_Point || 'N/A'}</p>
                                <p><strong>Drop-Off Point:</strong> {details.Drop_Of_Point || 'N/A'}</p>
                                <p><strong>Booked:</strong> {details.Booked || 'N/A'}</p>
                                <p><strong>Country:</strong> {details.Country || 'N/A'}</p>
                                <p><strong>Rating:</strong> {details.Rating || 'N/A'}</p>
                                <p><strong>P_Tag:</strong> {details.P_Tag || 'N/A'}</p>
                                <p><strong>Created By:</strong> {details.Created_By || 'N/A'}</p>
                                <p><strong>Flagged:</strong> {details.Flagged ? 'Yes' : 'No'}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Section */}
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

export default EventDetails;
