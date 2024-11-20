import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { readActivity, createTouristActivity } from '../services/api'; // Import the necessary functions
import logo from '../images/logo.png';

const ActivityDetails = () => {
    const { activityName } = useParams(); // Extract activity name from the URL
    const [activityDetails, setActivityDetails] = useState(null); // State to store activity details
    const [error, setError] = useState(null); // State to handle errors
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [email, setEmail] = useState('');
    const [joinError, setJoinError] = useState(null); // State for join errors
    const [joinSuccess, setJoinSuccess] = useState(null); // State for join success

    // Fetch email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                const data = await readActivity(decodeURIComponent(activityName)); // Call the API
                setActivityDetails(data.data); // Assuming `data` contains the activity details
            } catch (err) {
                setError(err.message || 'Failed to fetch activity details.');
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };

        fetchActivityDetails();
    }, [activityName]);

    const handleJoinActivity = async () => {
        try {
            setJoinError(null); // Clear any previous errors
            setJoinSuccess(null); // Clear previous success messages
            const response = await createTouristActivity(email, activityDetails.Name);
            setJoinSuccess(response.message || 'You have successfully joined the activity!');
        } catch (err) {
            setJoinError(err.message || 'Failed to join the activity.');
        }
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

                {/* Add space to push details down */}
                <div className="mt-10 flex justify-center">
                    {activityDetails ? (
                        <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
                            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
                                {activityDetails.Name}
                            </h1>
                            <img
                                src={activityDetails.Picture}
                                alt={activityDetails.Name}
                                className="w-full h-96 object-cover rounded mb-6"
                            />
                            <p className="text-gray-700 mb-4 text-lg">
                                <span className="font-semibold">Price: </span>
                                {activityDetails.Price} {activityDetails.Currency}
                            </p>
                            <p className="text-gray-700 mb-4 text-lg">
                                <span className="font-semibold">Rating: </span>
                                {activityDetails.Rating}
                            </p>
                            <p className="text-gray-700 mb-4 text-lg">
                                <span className="font-semibold">Available Spots: </span>
                                {activityDetails.Available_Spots}
                            </p>

                            <button
                                onClick={handleJoinActivity}
                                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                            >
                                Join Activity
                            </button>

                            {joinError && (
                                <p className="text-red-500 mt-4">{joinError}</p>
                            )}
                            {joinSuccess && (
                                <p className="text-green-500 mt-4">{joinSuccess}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-red-500">Activity details not found.</p>
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
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        © 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights
                        Reserved.
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default ActivityDetails;
