import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { readActivity, shareactivtybyemail,createTouristActivity, saveEvent, 
        checkIfEventSaved,requestNotificationForEvent, getTouristProfile,
        searchEventsPlaces } from '../services/api'; // Import the necessary functions
import logo from '../images/logoWhite.png';
import { HeartIcon,ShareIcon  } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';


function Content() {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [conversionRates] = useState({
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35
    });

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
      const [error, setError] = useState(null); 
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


    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const result = await searchEventsPlaces(searchTerm);
            setSearchResults(result);
            setIsSearched(true);
        } catch (err) {
            setError('Search failed. Please try again later.');
        }
    };

    const convertPrice = (price) => {
        return (price * conversionRates[currency]).toFixed(2);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };
    const { activityName } = useParams(); // Extract activity name from the URL
    // Conditional rendering based on the URL
    if (location.pathname === `/activity-details/${decodeURIComponent(activityName)}`){
        return  <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
        <div className="flex items-center">                
            {/* Logo */}
            <img src={logo} alt="Logo" className="w-44" />

            {/* Search Form */}
            <form className="flex items-center ml-4">
            <input
                type="text"
                placeholder="Search"
                className="border border-gray-300 rounded-full px-72 py-2 w-full max-w-2xl text-sm pl-2"
            />

                <button type="submit" className="bg-white text-black rounded-full ml-2 p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </form>
            <div className="flex items-center ml-auto">
                <select 
                    value={currency} 
                    onChange={handleCurrencyChange} 
                    className="rounded p-1 mx-2 bg-transparent text-white"
                >
                    <option value="USD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">USD</option>
                    <option value="EUR" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">EUR</option>
                    <option value="GBP" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">GBP</option>
                    <option value="JPY" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">JPY</option>
                    <option value="CAD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">CAD</option>
                    <option value="AUD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">AUD</option>
                </select>

                {/* Sign In/Sign Up Navigation */}
                <nav className="flex space-x-6 ml-4">
                    <Link to="/signin" className="text-lg font-medium text-white hover:text-logoOrange">
                        Sign in
                    </Link>
                    <Link to="/signup" className="text-lg font-medium text-white hover:text-logoOrange">
                        Sign up
                    </Link>
                </nav>
            </div>

        </div>

        {/* Main Navigation */}
        <nav className="flex space-x-6">
            <Link to="/" className="text-lg font-medium text-white hover:logoOrange">
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
            <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-logoOrange">
                Transportation
            </Link>
        </nav>            
    </div>;
    } else if (location.pathname === `/TouristHome/activity-details/${decodeURIComponent(activityName)}`) {
        return  <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
        <div className="flex items-center">                
            {/* Logo */}
            <img src={logo} alt="Logo" className="w-44" />

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex items-center ml-4">
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-full px-72 py-2 w-full max-w-2xl text-sm pl-2"
            />

                <button type="submit" className="bg-white text-black rounded-full ml-2 p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </form>
            <div className="flex items-center ml-auto">
                <select 
                    value={currency} 
                    onChange={handleCurrencyChange} 
                    className="rounded p-1 mx-2 bg-transparent text-white"
                >
                    <option value="USD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">USD</option>
                    <option value="EUR" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">EUR</option>
                    <option value="GBP" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">GBP</option>
                    <option value="JPY" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">JPY</option>
                    <option value="CAD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">CAD</option>
                    <option value="AUD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">AUD</option>
                </select>
                <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                    <Link to="/Cart">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                </nav>
                
                <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                    <Link to="/TouristHome/TouristProfile">
                        {/* Profile Picture */}
                        <div className="">
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
            <Link to="/" className="text-lg font-medium text-white hover:logoOrange">
                Home
            </Link>
            <Link to="/eventsplaces" className="text-lg font-medium text-white hover:logoOrange">
                Activities
            </Link>
            <Link to="/eventsplaces" className="text-lg font-medium text-white hover:logoOrange">
                Itineraries
            </Link>
            <Link to="/eventsplaces" className="text-lg font-medium text-white hover:logoOrange">
                Historical Places
            </Link>
            <Link to="/eventsplaces" className="text-lg font-medium text-white hover:logoOrange">
                Museums
            </Link>
            <Link to="/products" className="text-lg font-medium text-white hover:logoOrange">
                Gift Shop
            </Link>
            <Link to="/MyEvents" className="text-lg font-medium text-white hover:logoOrange">
                MyEvents
            </Link>
            <Link to="/Flights" className="text-lg font-medium text-white hover:logoOrange">
                Flights
            </Link>
            <Link to="/Hotels" className="text-lg font-medium text-white hover:logoOrange">
                Hotels
            </Link>
        </nav>            
          </div>;
    } else {
        return <div>Welcome to the Home Page</div>;
    }
}

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
            <Content />
            <div className="container mx-auto px-6 py-10">
            <div className="flex items-center justify-center h-6">
                    <h1 className="text-4xl font-bold mb-6 text-center lg:text-left text-gray-800">
                            {activityDetails.Name}
                                </h1>
                                </div>
                <div className="mt-4 flex justify-center">
                    {activityDetails ? (
                        <div className="p-6 bg-white rounded-lg w-full max-w-none flex flex-col lg:flex-row relative">
                            {/* Image Section */}
                            <div className="lg:w-2/3 mb-6 lg:mb-0 lg:mr-6">
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
                                    className={`p-3 rounded-full ${isSaved ? 'bg-red-500' : 'bg-white'}`}
                                >
                                    <HeartIcon
                                        className={`w-6 h-6 ${isSaved ? 'text-white' : 'text-gray-500'} fill-current`}
                                    />
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
                                        className="bg-black text-white px-4 py-2 w-1/2 rounded-full"
                                    >
                                        Share via Email
                                    </button>
                                        <button
                                            onClick={handleCopyLink}
                                            className="bg-black text-white px-4 py-2 w-1/2 rounded-full"
                                        >
                                            Copy Link
                                        </button>
                                    

                                </div>
                            </div>
                        )}
                    </div>

            </div>

            <footer className="bg-black shadow m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="w-44" alt="Flowbite Logo" />
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

export default ActivityDetails;
