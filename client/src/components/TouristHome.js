import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import img1 from '../images/img10.jpg';
import img2 from '../images/img4.jpg';
import img3 from '../images/img3.jpg';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';
import { searchEventsPlaces ,getAllTransportation,bookTransportation,
        saveEvent,cancelOrder,getAllNotifications ,markAsSeen,remindUpcomingPaidActivities,
        getTouristProfile ,notifyForAvailableBookings ,cancelSavedEvent,
        getAllUpcomingEventsAndPlaces, sortItineraries, sortActivities,
        filterActivities, filterItineraries, filterPlacesAndMuseums } from '../services/api'; // Import the commentOnEvent function
import Homet2 from '../components/Homet2.js';

const TouristHome = () => {
    //const [tourist, setTourist] = useState(null);
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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [transportation, setTransportation] = useState([]);
    const [loadingtransportation, setLoadingtransportation] = useState(false);
    const [errortransportation, setErrortransportation] = useState(null);
    const [currency, setCurrency] = useState('USD');
    const [conversionRates] = useState({
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35
    });
    //bto3 cancel event 
    const [eventTypeCancel, setEventTypeCancel] = useState('');
    const [eventNameCancel,setEventNameCancel]=useState('');
    const [succesEventCancel,setSuccessEventCancel]=useState('');
    const [errorEventCancel,setErrorEventCancel]=useState('');
    //bto3 el save event
    const [eventType, setEventType] = useState('');
    const [eventName,setEventName]=useState('');
    const [succesEvent,setSuccessEvent]=useState('');
    const [errorEvent,setErrorEvent]=useState('');
    
     //bto3 el cancelOrder
    const [cartNum, setCartNum] = useState('');
    const [succesCancelOrder,setSuccessCancelOrder]=useState('');
    const [errorCancelOrder,setErrorCancelOrder]=useState('');


    const [notifications, setNotifications] = useState([]); // State for notifications
    const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
    const [showModal, setShowModal] = useState(false); // State to show/hide the modal

    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const [sortedActivities, setSortedActivities] = useState(null);
    const [sortedItineraries, setSortedItineraries] = useState(null);
    const [filteredPlacesAndMuseums, setFilteredPlacesAndMuseums] = useState(null);
    const [activityFilters, setActivityFilters] = useState({
        minPrice: '',
        maxPrice: '',
        rating: '',
        category: '',
        startDate: '',
        endDate: ''
    });
    const [itineraryFilters, setItineraryFilters] = useState({
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
        preferences: '',
        language: ''
    });
    const [placesAndMuseumsFilters, setPlacesAndMuseumsFilters] = useState({
        category: '',
        value: ''
    });
    const [activityFilterType, setActivityFilterType] = useState(''); // For activities
    const [itineraryFilterType, setItineraryFilterType] = useState(''); // For itineraries
    const [activityfilterOptions] = useState(['price', 'rating', 'category', 'date']); // Filter options
    const [itineraryfilterOptions] = useState(['price', 'rating', 'Preference Tag', 'date']);

    const [expandedCard, setExpandedCard] = useState(null);

    const convertPrice = (price) => {
        return (price * conversionRates[currency]).toFixed(2);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllUpcomingEventsAndPlaces();
                setData(result);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);
    // Fetch email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSortActivities = async (sortBy) => {
        try {
            const sorted = await sortActivities(sortBy);
            setSortedActivities(sorted);
        } catch (error) {
            setError(error);
        }
    };

    const handleSortItineraries = async (sortBy) => {
        try {
            const sorted = await sortItineraries(sortBy);
            setSortedItineraries(sorted);
        } catch (error) {
            setError(error);
        }
    };

    const handleActivityClick = (activity) => {
        navigate(`/TouristHome/activity-details/${encodeURIComponent(activity.Name)}`); // Encode to make the URL safe
    };

    const handleItineraryClick = (itinerary) => {
        navigate(`/TouristHome/itinerary-details/${encodeURIComponent(itinerary.Itinerary_Name)}`); // Encode to make the URL safe
    };

    const handleFilterActivities = async (e) => {
        e.preventDefault();
        try {
            const filtered = await filterActivities(activityFilters);
            setSortedActivities(filtered.activities); // Update the displayed activities
        } catch (error) {
            setError(error);
        }
    };

    const handleFilterItineraries = async (e) => {
        e.preventDefault();
        try {
            const filtered = await filterItineraries(itineraryFilters);
            setSortedItineraries(filtered); // Update the displayed itineraries
        } catch (error) {
            setError(error);
        }
    };

    const handleActivityFilterChange = (e) => {
        setActivityFilterType(e.target.value);
    };

    const handleItineraryFilterChange = (e) => {
        setItineraryFilterType(e.target.value);
    };

    const handleFilterPlacesAndMuseums = async (e) => {
        e.preventDefault();
        try {
            console.log("Filters being used:", placesAndMuseumsFilters);
            const filtered = await filterPlacesAndMuseums(placesAndMuseumsFilters);

            if (filtered){
                            // Ensure that filtered data contains the expected structure
            console.log("Filtered Data:", filtered);
    
            // Setting the filtered results in state
            setFilteredPlacesAndMuseums(filtered);
    
            // Log the filtered state to confirm it's set
            console.log("State set for filtered places and museums:", filtered);
            }else{
                setFilteredPlacesAndMuseums(null);
                console.log("No data found for the selected filters");
                alert("No data found for the selected filters");
            }
    

            
        } catch (error) {
            console.error("Error fetching filtered data:", error);
           // setError(error);
        }
    };

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
        const fetchTransportation = async () => {
            setLoadingtransportation(true);
            try {
                const data = await getAllTransportation();
                setTransportation(data.transportation); // Use the data returned from the backend
            } catch (err) {
                setErrortransportation(err.message || 'Error fetching transportation');
            } finally {
                setLoadingtransportation(false);
            }
        };

        fetchTransportation();
    }, []);
    
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
    
            const handleNotifyForBookings = async () => {
                try {
                    const response = await notifyForAvailableBookings(storedEmail); // Pass email to notify function
                    setNotificationSuccess(response.message || 'Notifications processed successfully.');
                } catch (err) {
                    setNotificationError(err.message || 'Failed to process notifications.');
                }
            };
    
            handleNotifyForBookings();
        }
    }, []); // This runs only once when the component mounts

    useEffect(() => {
        // Retrieve the user's email from localStorage
        const storedEmaill = localStorage.getItem('email');
        if (storedEmaill) {
            setEmail(storedEmaill);

            // Call the remindUpcomingPaidActivities function
            remindUpcomingPaidActivities(storedEmaill)
                .then(response => {
                    console.log("Reminders created:", response);
                })
                .catch(error => {
                    console.error("Error creating reminders:", error);
                });
        }
    }, []); // Runs once when the component mounts

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
                if (!storedEmail) {
                    throw new Error("User email not found in local storage.");
                }
    
                // Fetch notifications for the signed-in user
                const data = await getAllNotifications(storedEmail);
                setNotifications(data); // Set notifications
                const unread = data.filter((notification) => !notification.seen).length; // Count unread notifications
                setUnreadCount(unread);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
    
        fetchNotifications();
    }, []);
    
    
    const handleFilterChange = (e, setFilters) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    useEffect(() => {
        console.log("Updated filteredPlacesAndMuseums:", filteredPlacesAndMuseums);
    }, [filteredPlacesAndMuseums]);

    if (error) {
        return <div className="text-red-500 text-center">Error: {error.message}</div>;
    }

    if (!data) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // Use sorted or original data based on sorting/filtering
    const activitiesToDisplay = sortedActivities || data.upcomingActivities;
    const itinerariesToDisplay = sortedItineraries || data.upcomingItineraries;
    const museumsToDisplay = filteredPlacesAndMuseums?.museums || data?.museums || [];
    const historicalPlacesToDisplay = filteredPlacesAndMuseums?.historicalPlaces || data?.historicalPlaces || [];
    
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
    

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setUnreadCount(0); // Reset the unread count when the modal is closed
    };
    
    const handleCancelOrder = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Clear previous success or error messages
        setSuccessCancelOrder('');
        setErrorCancelOrder('');
        try {
            // Prepare the cancel data (email and cart number)
            const cancelData = { email, cartNum };
            // Call the cancelOrder API function with the necessary data
            const response = await cancelOrder(cancelData);
            // On success, update the success message
            if (response.message === 'Order deleted successfully') {
                setSuccessCancelOrder(`Order with cart number ${cartNum} has been canceled successfully.`);
                setCartNum('');  // Optionally clear the cart number field
            }
        } catch (error) {
            // Handle errors, log them, and update the error message
            console.error('Failed to cancel order:', error);
            // If the error has a response with a message, use it
            if (error.response && error.response.data && error.response.data.message) {
                setErrorCancelOrder(`Error: ${error.response.data.message}`);
            } else {
                // Fallback to a generic error message
                setErrorCancelOrder('Failed to cancel order. Please try again.');
            }
        }
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Call the saveEvent API function with the necessary data
            const response = await saveEvent({ 
                email, 
                type: eventType, 
                name: eventName 
            });
    
            // On success, update the success message
            setSuccessEvent(`Event added successfully: ${eventName} (${eventType})`);
            
            // Clear the form inputs
            setEmail('');
            setEventType('');
            setEventName('');
        } catch (error) {
            // Handle errors, log them, and update the error message
            console.error('Failed to save event:', error);
    
            if (error.response && error.response.data && error.response.data.message) {
                // Use the error message returned from the server, if available
                setErrorEvent(`Error: ${error.response.data.message}`);
            } else {
                // Fallback to a generic error message
                setErrorEvent('Failed to save event. Please try again.');
            }
        }
    };

    const handleBooking = async (routeNumber) => {
        if (!email) {
            alert('Please provide your email before booking.');
            return;
        }
    
        try {
            const response = await bookTransportation(email, routeNumber);
            alert(response.message); // Show success message from API
        } catch (error) {
            alert(error.message); // Show error message from API
        }
    };

    // Handle search submission
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

    const handleCancelEvent = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Call the cancelSavedEvent API function with the necessary data
            const response = await cancelSavedEvent({
                email,
                type: eventTypeCancel,
                name: eventNameCancel,
            });
    
            // On success, update the success message
            setSuccessEventCancel(`Event canceled successfully: ${eventNameCancel} (${eventTypeCancel})`);
    
            // Clear the form inputs
            setEmail('');
            setEventTypeCancel('');
            setEventNameCancel('');
        } catch (error) {
            // Handle errors, log them, and update the error message
            console.error('Failed to cancel event:', error);
    
            if (error.response && error.response.data && error.response.data.message) {
                // Use the error message returned from the server, if available
                setErrorEventCancel(`Error: ${error.response.data.message}`);
            } else {
                // Fallback to a generic error message
                setErrorEventCancel('Failed to cancel event. Please try again.');
            }
        }
    };
    
    
    return (
    <div>
            <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
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
                        {/* Notification Icon */}
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <div className="relative ml-2"> {/* Reduced ml-4 to ml-2 */}
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
                    <Link to="/" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                        Home
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Activities
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Itineraries
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Historical Places
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Museums
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-white hover:text-blue-500">
                        Gift Shop
                    </Link>
                    <Link to="/MyEvents" className="text-lg font-medium text-white hover:text-blue-500">
                        MyEvents
                    </Link>
                    <Link to="/Flights" className="text-lg font-medium text-white hover:text-blue-500">
                        Flights
                    </Link>
                    <Link to="/Hotels" className="text-lg font-medium text-white hover:text-blue-500">
                        Hotels
                    </Link>
                </nav>            
            </div>

            {/* Notification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-xl text-gray-500"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-3 mb-2 rounded-lg ${
                                            notification.seen ? 'bg-gray-100' : 'bg-yellow-100'
                                        }`}
                                    >
                                        <p className="font-semibold">{notification.title}</p>
                                        <p>{notification.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No notifications available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}


<div className="p-8 rounded"> {/* Add padding here */}
                <div
                    className="flex justify-center items-center rounded h-96 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img1})` }}
                >
                    <div className="bg-black bg-opacity-30 w-full h-full rounded flex items-center justify-center">
                        <h1 className="text-white text-2xl">See The World One REHLA At A Time!</h1>
                    </div>
                </div>
            </div>

            {/* Activity Filters and Sort */}
            <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 ml-10">Discover Your Next Adventure</h2>
            <form onSubmit={handleFilterActivities} className="mb-4 mr-10 ml-auto">
            <div className="flex items-center justify-end space-x-4">
                <select
                    value={activityFilterType}
                    onChange={handleActivityFilterChange}
                    className="border rounded-full p-2"
                >
                    <option value="">Select Filter</option>
                    {activityfilterOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                </select>

                {activityFilterType === 'price' && (
                    <>
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={activityFilters.minPrice}
                            onChange={(e) => setActivityFilters({ ...activityFilters, minPrice: e.target.value })}
                            className="border rounded-full p-2"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={activityFilters.maxPrice}
                            onChange={(e) => setActivityFilters({ ...activityFilters, maxPrice: e.target.value })}
                            className="border rounded-full p-2"
                        />
                    </>
                )}

                {activityFilterType === 'rating' && (
                    <input
                        type="number"
                        placeholder="Rating"
                        value={activityFilters.rating}
                        onChange={(e) => setActivityFilters({ ...activityFilters, rating: e.target.value })}
                        className="border rounded-full p-2"
                    />
                )}

                {activityFilterType === 'category' && (
                    <select
                        value={activityFilters.category}
                        onChange={(e) => setActivityFilters({ ...activityFilters, category: e.target.value })}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Category</option>
                        <option value="exhibitions">Exhibitions</option>
                        <option value="museums">Museums</option>
                        <option value="sports matches">Sports Matches</option>
                        <option value="food">Food</option>
                        <option value="concert">Concert</option>
                        <option value="party">Party</option>
                        <option value="Adventure">Adventure</option>
                    </select>
                )}

                {activityFilterType === 'date' && (
                    <>
                        <input
                            type="date"
                            value={activityFilters.startDate}
                            onChange={(e) => setActivityFilters({ ...activityFilters, startDate: e.target.value })}
                            className="border rounded-full p-2"
                        />
                        <input
                            type="date"
                            value={activityFilters.endDate}
                            onChange={(e) => setActivityFilters({ ...activityFilters, endDate: e.target.value })}
                            className="border rounded-full p-2"
                        />
                    </>
                )}

                <div className="flex justify-end space-x-2">
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700">Filter Activities</button>
                    <button onClick={() => handleSortActivities('price')} className="bg-logoOrange text-white px-4 py-2 rounded-full hover:bg-orange-600">Sort by Price</button>
                </div>
            </div>
        </form>

                <div className="flex overflow-x-auto scrollbar-hide px-6 py-4 gap-6">
                    {activitiesToDisplay.map((activity) => (
                        <div
                        key={activity._id}
                        className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col gallery-item flex-none"
                        onClick={() => handleActivityClick(activity)}
                        >
                        <img
                            src={activity.Picture}
                            alt={activity.Name}
                            className="w-full h-48 object-cover"
                        />
                         <div className="p-4 flex flex-col justify-between flex-grow">
                            <div className="text-lg font-semibold text-gray-800">{activity.Name}</div>
                            <div className="text-sm text-gray-600 mt-2">
                                <span className="font-semibold">{convertPrice(activity.Price)} {currency}</span>
                                <div className="mt-1">Rating: {activity.Rating}</div>
                                <div className="mt-1">Location: {activity.Location}</div>
                            </div>
                            <button 
                                onClick={() => handleActivityClick(activity)} 
                                className="mt-4 bg-black text-white rounded-full py-2 px-4 w-full hover:bg-gray-700"
                            >
                                View Details
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex justify-between items-center mb-10 p-8 ml-10">
                <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-semibold mb-2">Discover Amazing Experiences</h2>
                    <p className="text-gray-700">
                        Experience the best attractions and activities in your area. From exciting adventures to serene cultural experiences, we have something for everyone. Join us to explore, learn, and create unforgettable memories!
                    </p>
                </div>
                <div className="flex-none -mr-10"> {/* Added margin-left to the image container */}
                    <img src={img2} alt="Experience" className="w-4/5 h-auto rounded shadow-lg" />
                </div>
            </section>

            {/* Itinerary Filters and Sort */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 ml-10">Create Unforgettable Memories with Our Itineraries</h2>
                <form onSubmit={handleFilterItineraries} className="mb-4 mr-10 ml-auto">
                <div className="flex items-center justify-end space-x-4">
                    <select
                        value={itineraryFilterType}
                        onChange={handleItineraryFilterChange}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Filter</option>
                        {itineraryfilterOptions.map(option => (
                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                        ))}
                    </select>

                    {itineraryFilterType === 'price' && (
                        <>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={itineraryFilters.minPrice}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, minPrice: e.target.value })}
                                className="border rounded-full p-2"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={itineraryFilters.maxPrice}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, maxPrice: e.target.value })}
                                className="border rounded-full p-2"
                            />
                        </>
                    )}

                    {itineraryFilterType === 'rating' && (
                        <input
                            type="number"
                            placeholder="Rating"
                            value={itineraryFilters.rating}
                            onChange={(e) => setItineraryFilters({ ...itineraryFilters, rating: e.target.value })}
                            className="border rounded-full p-2"
                        />
                    )}

                    {itineraryFilterType === 'preferences' && (
                        <input
                            type="text"
                            placeholder="Preferences"
                            value={itineraryFilters.preferences}
                            onChange={(e) => setItineraryFilters({ ...itineraryFilters, preferences: e.target.value })}
                            className="border rounded-full p-2"
                        />
                    )}

                    {itineraryFilterType === 'date' && (
                        <>
                            <input
                                type="date"
                                value={itineraryFilters.startDate}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, startDate: e.target.value })}
                                className="border rounded-full p-2"
                            />
                            <input
                                type="date"
                                value={itineraryFilters.endDate}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, endDate: e.target.value })}
                                className="border rounded-full p-2"
                            />
                        </>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700">Filter Itineraries</button>
                        <button onClick={() => handleSortItineraries('price')} className="bg-logoOrange text-white px-4 py-2 rounded-full hover:bg-orange-600">Sort by Price</button>
                    </div>
                </div>
            </form>

                <div className="flex overflow-x-auto scrollbar-hide px-6 py-4 gap-6">
                    {itinerariesToDisplay.map((itinerary) => (
                        <div
                        key={itinerary._id}
                        className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col gallery-item flex-none"
                        onClick={() => handleItineraryClick(itinerary)}
                        >
                        <img
                            src={itinerary.Picture}
                            alt={itinerary.Itinerary_Name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                            <div className="text-lg font-semibold text-gray-800">{itinerary.Itinerary_NameName}</div>
                                <div className="text-sm text-gray-600 mt-2">
                                    <span className="font-semibold">{convertPrice(itinerary.Tour_Price)} {currency}</span>
                                    <div className="mt-1">Rating: {itinerary.Rating}</div>
                                    <div className="mt-1">Language: {itinerary.Language}</div>
                                </div>
                                <button 
                                    onClick={() => handleItineraryClick(itinerary)} 
                                    className="mt-4 bg-black text-white rounded-full py-2 px-4 w-full hover:bg-gray-700"
                                >
                                    View Details
                                </button>
                        </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="flex justify-between items-center mb-10 p-8 ml-10">
                
                <div className="flex-none -mr-10"> {/* Added margin-left to the image container */}
                    <img src={img3} alt="Experience" className="w-4/5 h-auto rounded shadow-lg" />
                </div>
                <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-semibold mb-2">Explore Fascinating Museums and Historical Places</h2>
                    <p className="text-gray-700">
                    Discover the rich history and culture around you by visiting captivating museums and iconic historical landmarks. From ancient 
                    artifacts to timeless architecture, these destinations offer a journey through time, filled with stories of the past and heritage. 
                    Whether you're a history enthusiast or just curious, immerse yourself in unique experiences that will inspire, educate, and leave you with lasting memories!
                    </p>
                </div>
            </section>
            <div className="flex overflow-x-auto scrollbar-hide px-6 py-4">
            {filteredPlacesAndMuseums && (
                <section className="mb-10 w-full">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                    Museums and Historical Places
                    </h2>

                    {/* Museums and Historical Places Filter Form */}
                    <form onSubmit={handleFilterPlacesAndMuseums} className="mb-4 flex justify-end gap-4">
                    <select
                        name="category"
                        value={placesAndMuseumsFilters.category}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Category</option>
                        <option value="museums">Museums</option>
                        <option value="historical_places">Historical Places</option>
                    </select>

                    <select
                        name="value"
                        value={placesAndMuseumsFilters.value}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Value</option>
                        {placesAndMuseumsFilters.category === 'museums' && (
                        <>
                            <option value="Historical">Historical</option>
                            <option value="Art Museum">Art Museum</option>
                            <option value="Art">Art</option>
                            <option value="Mix">Mix</option>
                        </>
                        )}
                        {placesAndMuseumsFilters.category === 'historical_places' && (
                        <>
                            <option value="Monuments">Monuments</option>
                            <option value="Ancient Greece">Ancient Greece</option>
                            <option value="Religious">Religious</option>
                            <option value="Sites">Sites</option>
                            <option value="Castle">Castle</option>
                        </>
                        )}
                    </select>

                    <button 
                        type="submit" 
                        className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700"
                    >
                        Filter Places
                    </button>
                    </form>

                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 py-4 gap-6">
                    {filteredPlacesAndMuseums.map((place) => (
                        <div 
                        key={place._id} 
                        className={`card flex-none snap-start ${
                            expandedCard === place._id ? 'w-2/3 p-6' : 'w-96'
                        } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300`}
                        onClick={() => setExpandedCard(expandedCard === place._id ? null : place._id)} 
                        >
                        <img 
                            src={place.pictures || place.Pictures} 
                            alt={place.Name} 
                            className={`w-full object-cover transition-all duration-300 ${expandedCard === place._id ? 'h-64' : 'h-48'}`}
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                            <div className="text-lg font-semibold text-gray-800">
                            {place.Name}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                            <div>
                                <span className="font-semibold">Location: </span>
                                {place.location || place.Location}
                            </div>
                            <div className="mt-1">
                                <span className="font-semibold">Opening Hours: </span>
                                {place.Opening_Hours !== null && place.Opening_Hours !== undefined
                                ? place.Opening_Hours
                                : (place.Opens_At && place.Closes_At) 
                                    ? `${place.Opens_At} - ${place.Closes_At}` 
                                    : 'N/A'}
                            </div>
                            <div className="mt-1">
                                <span className="font-semibold">Starting Prices: </span>
                                {place.S_Tickets_Prices !== null && place.S_Tickets_Prices !== undefined
                                ? convertPrice(place.S_Tickets_Prices)
                                : (place.S_Ticket_Prices !== null && place.S_Ticket_Prices !== undefined 
                                    ? convertPrice(place.S_Ticket_Prices)
                                    : 'N/A')}
                                {currency}
                            </div>

                            {expandedCard === place._id && (
                                <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    {place.description || place.Description || 'No additional description available.'}
                                </p>
                                <div className="mt-1">
                                    <span className="font-semibold">Foreigner Ticket: </span>
                                    {place.F_Tickets_Prices !== null && place.F_Tickets_Prices !== undefined
                                    ? convertPrice(place.F_Tickets_Prices)
                                    : place.F_Ticket_Prices !== null && place.F_Ticket_Prices !== undefined
                                    ? convertPrice(place.F_Ticket_Prices)
                                    : 'N/A'}
                                    {currency}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold">Native Ticket: </span>
                                    {place.N_Tickets_Prices !== null && place.N_Tickets_Prices !== undefined
                                    ? convertPrice(place.N_Tickets_Prices)
                                    : place.N_Ticket_Prices !== null && place.N_Ticket_Prices !== undefined
                                    ? convertPrice(place.N_Ticket_Prices)
                                    : 'N/A'}
                                    {currency}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold">Tag: </span>
                                    {place.Tag || place.Type || 'N/A'}
                                </div>
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </section>
                )}


            </div>

            {/* Museums and Historical Places Section */}
            {!filteredPlacesAndMuseums && (
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                    Museums and Historical Places
                    </h2>

                    {/* Museums and Historical Places Filter Form */}
                    <form 
                    onSubmit={handleFilterPlacesAndMuseums} 
                    className="mb-4 flex justify-end gap-4"
                    >
                    <select
                        name="category"
                        value={placesAndMuseumsFilters.category}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Category</option>
                        <option value="museums">Museums</option>
                        <option value="historical_places">Historical Places</option>
                    </select>

                    <select
                        name="value"
                        value={placesAndMuseumsFilters.value}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Value</option>
                        {placesAndMuseumsFilters.category === 'museums' && (
                        <>
                            <option value="Historical">Historical</option>
                            <option value="Art Museum">Art Museum</option>
                            <option value="Art">Art</option>
                            <option value="Mix">Mix</option>
                        </>
                        )}
                        {placesAndMuseumsFilters.category === 'historical_places' && (
                        <>
                            <option value="Monuments">Monuments</option>
                            <option value="Ancient Greece">Ancient Greece</option>
                            <option value="Religious">Religious</option>
                            <option value="Sites">Sites</option>
                            <option value="Castle">Castle</option>
                        </>
                        )}
                    </select>

                    <button 
                        type="submit" 
                        className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700"
                    >
                        Filter Places
                    </button>
                    </form>

                    <div className="overflow-x-scroll flex gap-4 p-4 scrollbar-hide">
                        {data.museums.map((museum) => (
                            <div 
                            key={museum._id} 
                            className={`card flex-none ${
                                expandedCard === museum._id ? 'w-2/3 p-6' : 'w-96'
                            } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300`}
                            onClick={() => setExpandedCard(expandedCard === museum._id ? null : museum._id)}
                            >
                            <img 
                                src={museum.pictures} 
                                alt={museum.Name} 
                                className={`w-full object-cover transition-all duration-300 ${expandedCard === museum._id ? 'h-64' : 'h-48'}`}
                            />

                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <div className="text-lg font-semibold text-gray-800">
                                {museum.Name}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                <div>
                                    <span className="font-semibold">Location: </span>
                                    {museum.location}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold">Opening Hours: </span>
                                    {museum.Opening_Hours}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold">Starting Prices: </span>
                                    {convertPrice(museum.S_Tickets_Prices)} {currency}
                                </div>
                                </div>
                                {expandedCard === museum._id && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                    {museum.description}
                                    </p>
                                    <div className="mt-1">
                                    <span className="font-semibold">Foreigner Ticket: </span>
                                    {convertPrice(museum.F_Tickets_Prices)} {currency}
                                    </div>
                                    <div className="mt-1">
                                    <span className="font-semibold">Native Ticket: </span>
                                    {convertPrice(museum.N_Tickets_Prices)} {currency}
                                    </div>
                                    <div>
                                    <span className="font-semibold">Tag: </span>
                                    {museum.Tag}
                                    </div>
                                </div>
                                )}
                            </div>
                            </div>
                        ))}

                        {data.historicalPlaces.map((place) => (
                            <div 
                            key={place._id} 
                            className={`card flex-none ${
                                expandedCard === place._id ? 'w-2/3 p-6' : 'w-96'
                            } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300`}
                            onClick={() => setExpandedCard(expandedCard === place._id ? null : place._id)}
                            >
                            <img 
                                src={place.pictures || place.Pictures} 
                                alt={place.Name} 
                                className={`w-full object-cover transition-all duration-300 ${expandedCard === place._id ? 'h-64' : 'h-48'}`}
                            />
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <div className="text-lg font-semibold text-gray-800">
                                {place.Name}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                <div>
                                    <span className="font-semibold">Location: </span>
                                    {place.Location}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold">Opening Hours: </span>
                                    {place.Opens_At} - {place.Closes_At}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold">Starting Price: </span>
                                    {convertPrice(place.S_Ticket_Prices)} {currency}
                                </div>
                                </div>
                                {expandedCard === place._id && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Description: </span>
                                    {place.Description}
                                    </p>
                                    <div className="mt-1">
                                    <span className="font-semibold">Foreigner Ticket: </span>
                                    {convertPrice(place.F_Ticket_Prices)} {currency}
                                    </div>
                                    <div className="mt-1">
                                    <span className="font-semibold">Native Ticket: </span>
                                    {convertPrice(place.N_Ticket_Prices)} {currency}
                                    </div>
                                    <div>
                                    <span className="font-semibold">Tag: </span>
                                    {place.Type}
                                    </div>
                                </div>
                                )}
                            </div>
                            </div>
                        ))}
                        </div>

                </section>
                )}


            <div className="w-full p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Transportation List</h2>
            {loadingtransportation && <p className="text-blue-500 text-center mb-4">Loading...</p>}
            {errortransportation && <p className="text-red-500 text-center mb-4">{errortransportation}</p>}

            {transportation.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">Route Number</th>
                                <th className="py-2 px-4 border">Advertiser Name</th>
                                <th className="py-2 px-4 border">Advertiser Email</th>
                                <th className="py-2 px-4 border">Advertiser Phone</th>
                                <th className="py-2 px-4 border">Pickup Location</th>
                                <th className="py-2 px-4 border">Dropoff Location</th>
                                <th className="py-2 px-4 border">Pickup Date</th>
                                <th className="py-2 px-4 border">Pickup Time</th>
                                <th className="py-2 px-4 border">Dropoff Time</th>
                                <th className="py-2 px-4 border">Price</th>
                                <th className="py-2 px-4 border">Available</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transportation.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{item.Route_Number}</td>
                                    <td className="py-2 px-4 border">{item.Advertiser_Name}</td>
                                    <td className="py-2 px-4 border">{item.Advertiser_Email}</td>
                                    <td className="py-2 px-4 border">{item.Advertiser_Phone}</td>
                                    <td className="py-2 px-4 border">{item.Pickup_Location}</td>
                                    <td className="py-2 px-4 border">{item.Dropoff_Location}</td>
                                    <td className="py-2 px-4 border">{new Date(item.Pickup_Date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">{item.Pickup_Time}</td>
                                    <td className="py-2 px-4 border">{item.Droppff_Time}</td>
                                    <td className="py-2 px-4 border">${item.Price}</td>
                        
                                    <td className="py-2 px-4 border">{item.Avilable ? 'Yes' : 'No'}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleBooking(item.Route_Number)} // Handle booking when the button is clicked
                                            className="bg-brandBlue text-white px-3 py-1 rounded hover:bg-logoOrange"
                                        >
                                            Book Now
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
         
            ) : (
                <p className="text-gray-500 text-center mt-4">No transportation records found.</p>
            )}
        </div>


            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

            {isSearched && searchResults && (
                <div className="search-results">
                    <h2>Search Results:</h2>

                    {searchResults.museums && searchResults.museums.length > 0 && (
                        <div>
                            <h3>Museums:</h3>
                            {searchResults.museums.map(museum => (
                                <div key={museum._id}>
                                    <h4>{museum.Name}</h4>
                                    <p>{museum.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.historicalPlaces && searchResults.historicalPlaces.length > 0 && (
                        <div>
                            <h3>Historical Places:</h3>
                            {searchResults.historicalPlaces.map(place => (
                                <div key={place._id}>
                                    <h4>{place.Name}</h4>
                                    <p>{place.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.activities && (
                        <div>
                            <h3>Activities:</h3>

                            {/* Display activities by name */}
                            {searchResults.activities.name && searchResults.activities.name.length > 0 && (
                                <div>
                                    <h4>By Name:</h4>
                                    {searchResults.activities.name.map(activity => (
                                        <div key={activity._id}>
                                            <h4>{activity.Name}</h4>
                                            {activity.Description && <p>{activity.Description}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Display activities by tags */}
                            {searchResults.activities.tags && searchResults.activities.tags.length > 0 && (
                                <div>
                                    <h4>By Tags:</h4>
                                    {searchResults.activities.tags.map(tag => (
                                        <div key={tag._id}>
                                            <p>{tag.Activity}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Display activities by categories */}
                            {searchResults.activities.categories && searchResults.activities.categories.length > 0 && (
                                <div>
                                    <h4>By Categories:</h4>
                                    {searchResults.activities.categories.map(category => (
                                        <div key={category._id}>
                                            <p>{category.Category}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    {searchResults.itineraries && searchResults.itineraries.length > 0 && (
                        <div>
                            <h3>Itineraries:</h3>
                            {searchResults.itineraries.map(itinerary => (
                                <div key={itinerary._id}>
                                    <h4>{itinerary.Itinerary_Name}</h4>
                                    <p>{itinerary.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/*Cancel an order*/}

            <div>
                <h2>Cancel an Order</h2>
                <form>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Cart Number:</label>
                        <input
                            type="text"
                            value={cartNum}
                            onChange={(e) => setCartNum(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={handleCancelOrder}>
                        Cancel Order
                    </button>
                </form>
                {succesCancelOrder && <p style={{ color: 'green' }}>{succesCancelOrder}</p>}
                {errorCancelOrder && <p style={{ color: 'red' }}>{errorCancelOrder}</p>}
            </div>
            <div>
    <h2>Cancel an Event</h2>
    <form>
        <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Event Type:</label>
            <input
                type="text"
                value={eventTypeCancel}
                onChange={(e) => setEventTypeCancel(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Event Name:</label>
            <input
                type="text"
                value={eventNameCancel}
                onChange={(e) => setEventNameCancel(e.target.value)}
                required
            />
        </div>
        <button onClick={handleCancelEvent}>
            Cancel Event
        </button>
    </form>
    {succesEventCancel && <p style={{ color: 'green' }}>{succesEventCancel}</p>}
    {errorEventCancel && <p style={{ color: 'red' }}>{errorEventCancel}</p>}
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

export default TouristHome;
