import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';
import { searchEventsPlaces ,getAllTransportation,bookTransportation,
        saveEvent,cancelOrder,getAllNotifications ,markAsSeen,remindUpcomingPaidActivities,
        getTouristProfile ,notifyForAvailableBookings ,cancelSavedEvent } from '../services/api'; // Import the commentOnEvent function
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

    const convertPrice = (price) => {
        return (price * conversionRates[currency]).toFixed(2);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success



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
    
    // Fetch email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
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
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Transportation
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

            <Homet2 />

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
