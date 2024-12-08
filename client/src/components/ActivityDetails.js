import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { readActivity, shareactivtybyemail,createTouristActivity, saveEvent, checkIfEventSaved,requestNotificationForEvent } from '../services/api'; // Import the necessary functions
import logo from '../images/logo.png';
import { HeartIcon,ShareIcon  } from '@heroicons/react/24/outline';

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
    const [recipientEmail, setRecipientEmail] = useState(''); // State for recipient email
    const [isModalOpen, setIsModalOpen] = useState(false);

    
    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success


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
            if (!email) {
                alert('Cannot save event without logging');
              }

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
            const email = localStorage.getItem('email');
            if (!email) {
                alert('Cannot join event without logging');
            }
            setJoinError(null); // Clear any previous errors
            setJoinSuccess(null); // Clear previous success messages
            const response = await createTouristActivity(email, activityDetails.Name);
            setJoinSuccess(response.message || 'You have successfully joined the activity!');
        } catch (err) {
            setJoinError(err.message || 'Failed to join the activity.');
        }
    };

    const handleNotificationRequest = async () => {
        try {
            const email = localStorage.getItem('email');
            if (!email) {
                alert('Cannot request notification without logging');
            }
            setNotificationError(null); // Clear previous errors
            setNotificationSuccess(null); // Clear previous success messages

            const response = await requestNotificationForEvent(email, activityDetails._id); // Request notification
            setNotificationSuccess(response.message || 'Notification request submitted successfully!');
        } catch (err) {
            setNotificationError(err.message || 'Failed to request notification.');
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
        shareactivtybyemail(recipientEmail, currentUrl)
            .then((response) => {
                alert(response.message || 'Email sent successfully!');
            })
            .catch((err) => {
                alert(err.message || 'Failed to send email.');
            });
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
                            <div className="lg:w-1/2 mb-6 lg:mb-0 lg:mr-6">
                                <img
                                    src={activityDetails.Picture}
                                    alt={activityDetails.Name}
                                    className="w-full h-[400px] object-cover rounded-lg mt-4"
                                />
                                <p className="text-gray-700 mt-4 text-lg text-center">
                                    <span className="font-semibold">Created By: </span>
                                    {activityDetails.Created_By}
                                </p>
                            </div>

                            {/* Details Section (two columns layout) */}
                            <div className="lg:w-1/2 mt-10">
                                <h1 className="text-4xl font-bold mb-6 text-center lg:text-left text-gray-800">
                                    {activityDetails.Name}
                                </h1>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Rating: </span>
                                        {activityDetails.Rating}
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Available Spots: </span>
                                        {activityDetails.Available_Spots}
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Location: </span>
                                        {activityDetails.Location}
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Time: </span>
                                        {activityDetails.Time}
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Duration: </span>
                                        {activityDetails.Duration}
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Date: </span>
                                        {new Date(activityDetails.Date).toISOString().split("T")[0]}
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                    <span className="font-semibold">Price: </span>
                                    {activityDetails.Price} {activityDetails.Currency}
                                </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">Discount Percent: </span>
                                        {activityDetails.Discount_Percent}%
                                    </p>
                                </div>


                                {/* Buttons Section */}
                                <div className="mt-20 flex gap-4 justify-end flex-col lg:flex-row">
                                    <button
                                        onClick={handleJoinActivity}
                                        className="bg-black text-white px-6 py-3 rounded-full"
                                    >
                                        Join Activity
                                    </button>
                                    <button
                                        onClick={handleNotificationRequest}
                                        className="bg-black text-white px-6 py-3 mt-4 lg:mt-0 lg:ml-4 rounded-full"
                                    >
                                        Request Notification
                                    </button>
                                </div>

                                {/* Notification messages */}
                                {notificationError && (
                                    <p className="text-red-500 mt-4">{notificationError}</p>
                                )}
                                {notificationSuccess && (
                                    <p className="text-green-500 mt-4">{notificationSuccess}</p>
                                )}
                            </div>

                            {/* Icons for Share and Save in the Top Right Corner */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-4">
                                <button
                                    onClick={handleOpenModal}
                                    className="bg-black text-white p-3 rounded-full"
                                >
                                    <ShareIcon className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleSaveEvent}
                                    className={`bg-white p-3 rounded-full ${isSaved ? 'bg-red-500' : 'bg-gray-200'}`}
                                >
                                    <HeartIcon className={`w-6 h-6 ${isSaved ? 'text-white' : 'text-gray-600'}`} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500">Activity details not found.</p>
                    )}

                        {/* Modal for Share */}
                        {isModalOpen && (
                            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
                                    {/* Close Button (X) */}
                                    <button
                                        onClick={handleCloseModal}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                    >
                                        <span className="text-2xl">×</span>
                                    </button>

                                    <h2 className="text-2xl font-bold mb-4 text-center">Share Activity</h2>

                                    <div className="mb-4">
                                        <button
                                            onClick={handleCopyLink}
                                            className="bg-brandBlue text-white px-4 py-2 w-full rounded-full mb-4"
                                        >
                                            Copy Link
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            placeholder="Enter recipient's email"
                                            value={recipientEmail}
                                            onChange={(e) => setRecipientEmail(e.target.value)}
                                            className="border border-gray-300 rounded-full px-4 py-2 w-full"
                                        />
                                    </div>
                                    <button
                                        onClick={handleShareViaEmail}
                                        className="bg-brandBlue text-white px-4 py-2 w-full rounded-full"
                                    >
                                        Share via Email
                                    </button>
                                </div>
                            </div>
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
