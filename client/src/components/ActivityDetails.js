import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { readActivity, createTouristActivity, saveEvent, checkIfEventSaved} from '../services/api'; // Import the necessary functions
import logo from '../images/logo.png';
import { HeartIcon } from '@heroicons/react/24/outline';

const ActivityDetails = () => {
    const { activityName } = useParams(); // Extract activity name from the URL
    const [activityDetails, setActivityDetails] = useState(null); // State to store activity details
    const [error, setError] = useState(null); // State to handle errors
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [email, setEmail] = useState('');
    const [joinError, setJoinError] = useState(null); // State for join errors
    const [joinSuccess, setJoinSuccess] = useState(null); // State for join success
    const [succesEvent, setSuccessEvent] = useState(''); // State for success message
    const [errorEvent, setErrorEvent] = useState(''); // State for error message
    const [isSaved, setIsSaved] = useState(null);
    const [message, setMessage] = useState("");

    // Fetch email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);


    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        
        const handleCheckEvent = async () => {
            if (storedEmail && activityDetails?.Name) {
                const result = await checkIfEventSaved(storedEmail, activityDetails.Name);
                setIsSaved(result.isSaved);
                setMessage(result.message);
                console.log(result.isSaved);
            }
        };

        handleCheckEvent();  // Call the function when the component mounts

    }, [activityDetails?.Name]);

    // Handle saving the event (bookmarking)
    const handleSaveEvent = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const email = localStorage.getItem('email');
            const eventType = 'Activity'; // Always set to 'Activity'
            const eventName = activityDetails.Name; // Use activity name from the API

            // Call the saveEvent API function with the necessary data
            const response = await saveEvent({ 
                email, 
                type: eventType, 
                name: eventName // Pass the activity name
            });


            // On success, update the success message
            setSuccessEvent(`Event added successfully`);
            setIsSaved(true); // Mark as saved
            // Clear the success message after a delay
            //window.location.reload(); 
        } catch (error) {
            // Handle errors, log them, and update the error message
            console.error('Failed to save event:', error);

            if (error.response && error.response.data && error.response.data.message) {
                setErrorEvent(`Error: ${error.response.data.message}`);
            } else {
                setErrorEvent('Failed to save event. Please try again.');
            }
        }
    };

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

    const handleCopyLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    const handleShareViaEmail = () => {
        const currentUrl = window.location.href;
        const mailtoLink = `mailto:?subject=Check out this activity!&body=Hey, check out this activity: ${currentUrl}`;
        window.location.href = mailtoLink;
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
                    {activityDetails ? (
                        <div className="p-6 bg-white rounded-lg w-full max-w-none flex flex-col lg:flex-row relative">
                            {/* Image Section */}
                            <div className="lg:w-1/2 flex-shrink-0 relative">
                                <img
                                    src={activityDetails.Picture}
                                    alt={activityDetails.Name}
                                    className="w-full h-96 object-cover rounded mb-6 lg:mb-0"
                                />
                                <p className="text-gray-700 mt-4 text-lg text-center">
                                    <span className="font-semibold">Created By: </span>
                                    {activityDetails.Created_By}
                                </p>
                            </div>

                            {/* Details Section */}
                            <div className="lg:w-1/2 lg:pl-6">
                                <h1 className="text-4xl font-bold mb-6 text-center lg:text-left text-gray-800">
                                    {activityDetails.Name}
                                </h1>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Rating: </span>
                                    {activityDetails.Rating}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Available Spots: </span>
                                    {activityDetails.Available_Spots}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Location: </span>
                                    {activityDetails.Location}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Time: </span>
                                    {activityDetails.Time}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Duration: </span>
                                    {activityDetails.Duration}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Date: </span>
                                    {new Date(activityDetails.Date).toISOString().split("T")[0]}
                                </p>
                                <p className="text-gray-700 mb-4 text-lg">
                                    <span className="font-semibold">Discount Percent: </span>
                                    {activityDetails.Discount_Percent}%
                                </p>

                                <p className="absolute bottom-4 right-4 bg-white bg-opacity-80 text-lg lg:text-2xl font-bold text-gray-800 px-4 py-2 rounded-lg">
                                    {activityDetails.Price} {activityDetails.Currency}
                                </p>

                                <div className="mt-6 flex gap-4 justify-start">
                                <button
                                    onClick={handleJoinActivity}
                                    className="bg-logoOrange text-white px-6 py-3 rounded"
                                >
                                    Join Activity
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="bg-brandBlue text-white px-4 py-2 rounded"
                                >
                                    Copy Link
                                </button>
                                <button
                                    onClick={handleShareViaEmail}
                                    className="bg-brandBlue text-white px-4 py-2 rounded"
                                >
                                    Share via Email
                                </button>
                                <button
                                    onClick={handleSaveEvent}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded ${
                                        isSaved ? 'bg-red-500' : 'bg-gray-200'
                                    }`}
                                >
                                    <HeartIcon
                                        className={`w-6 h-6 ${isSaved ? 'text-white' : 'text-gray-600'}`}
                                    />
                                    <span className={`text-lg ${isSaved ? 'text-white' : 'text-gray-800'}`}>
                                        {isSaved ? 'Saved' : 'Save'}
                                    </span>
                                </button>
                            </div>
                             </div>
                             </div>
                    ) : (
                        <p className="text-red-500">Activity details not found.</p>
                    )}
                </div>
            </div>

            <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
                {/* Footer content remains unchanged */}
            </footer>
        </div>
    );
};

export default ActivityDetails;
