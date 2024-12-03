import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItineraryByName, createTouristItinerary } from '../services/api';
import logo from '../images/logo.png';

const ItineraryDetails = () => {
    const { itineraryName } = useParams();
    const [itineraryDetails, setItineraryDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [joinError, setJoinError] = useState(null);
    const [joinSuccess, setJoinSuccess] = useState(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        const fetchItineraryDetails = async () => {
            try {
                const data = await getItineraryByName(decodeURIComponent(itineraryName));
                setItineraryDetails(data.itinerary);
            } catch (err) {
                setError(err.message || 'Failed to fetch itinerary details.');
            } finally {
                setLoading(false);
            }
        };

        fetchItineraryDetails();
    }, [itineraryName]);

    const handleJoinItinerary = async () => {
        try {
            setJoinError(null);
            setJoinSuccess(null);
            const response = await createTouristItinerary(email, itineraryDetails.Itinerary_Name);
            setJoinSuccess(response.message || 'You have successfully joined the itinerary!');
        } catch (err) {
            setJoinError(err.message || 'Failed to join the itinerary.');
        }
    };

    const handleCopyLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    if (loading) return <p className="text-center text-blue-500">Loading...</p>;

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <div className="NavBar">
                    <img src={logo} alt="Logo" />
                    <nav className="main-nav">
                        <ul className="nav-links">
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/MyEvents">Events/Places</Link>
                            <Link to="/Flights">Flights</Link>
                            <Link to="/Hotels">Hotels</Link>
                        </ul>
                    </nav>

                    <nav className="signing">
                        <Link to="/TouristHome/TouristProfile">My Profile</Link>
                    </nav>
                </div>

                <div className="mt-10 flex justify-center">
                    {itineraryDetails ? (
                        <div className="p-6 bg-white rounded-lg w-full max-w-none flex flex-col lg:flex-row relative">
                            {/* Image Section */}
                            <div className="lg:w-1/2 flex-shrink-0 relative">
                                <img
                                    src={itineraryDetails.Picture}
                                    alt={itineraryDetails.Itinerary_Name}
                                    className="w-full h-96 object-cover rounded mb-6 lg:mb-0"
                                />
                                {/* Created By Section */}
                                <p className="text-gray-700 mt-4 text-lg text-center">
                                    <span className="font-semibold">Created By: </span>
                                    {itineraryDetails.Created_By}
                                </p>
                            </div>

                            {/* Details Section */}
                            <div className="lg:w-1/2 lg:pl-6">
                                <h1 className="text-4xl font-bold mb-6 text-center lg:text-left text-gray-800">
                                    {itineraryDetails.Itinerary_Name}
                                </h1>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Timeline: </span>
                                    {itineraryDetails.Timeline}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Duration: </span>
                                    {itineraryDetails.Duration}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Language: </span>
                                    {itineraryDetails.Language}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Pick-Up Point: </span>
                                    {itineraryDetails.Pick_Up_Point}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Drop-Off Point: </span>
                                    {itineraryDetails.Drop_Of_Point}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Country: </span>
                                    {itineraryDetails.Country}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Tag: </span>
                                    {itineraryDetails.P_Tag}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Empty Spots: </span>
                                    {itineraryDetails.Empty_Spots}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Date: </span>
                                    {new Date(itineraryDetails.Available_Date_Time)
                                        .toISOString()
                                        .split('T')[0]}
                                </p>

                                {/* Price in Bottom Right */}
                                <p className="absolute bottom-4 right-4 bg-white bg-opacity-80 text-lg lg:text-2xl font-bold text-gray-800 px-4 py-2 rounded-lg">
                                    {itineraryDetails.Tour_Price} {itineraryDetails.Currency || 'USD'}
                                </p>
                                {/* Copy Link Button */}
                                

                                <button
                                    onClick={handleJoinItinerary}
                                    className="bg-logoOrange text-white px-6 py-3 ml-32 rounded hover:bg-green-600"
                                >
                                    Join Itinerary
                                </button>
                                {/* Copy and Share Buttons */}
                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={handleCopyLink}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Copy Link
                                    </button>
                                    
                                </div>
                                

                                {joinError && (
                                    <p className="text-red-500 mt-4">{joinError}</p>
                                )}
                                {joinSuccess && (
                                    <p className="text-green-500 mt-4">{joinSuccess}</p>
                                )}
                                
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500">Itinerary details not found.</p>
                    )}
                </div>
            </div>

            <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a
                            href="/"
                            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                        >
                            <img src={logo} className="w-12" alt="Flowbite Logo" />
                        </a>
                        <div className="flex justify-center w-full">
                            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 -ml-14">
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">
                                        Licensing
                                    </a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                </div>
            </footer>
        </div>
    );
};

export default ItineraryDetails;
