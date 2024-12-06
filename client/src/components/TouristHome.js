import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';
import { searchEventsPlaces ,getAllTransportation,bookTransportation,
        saveEvent,cancelOrder,getAllNotifications ,markAsSeen,remindUpcomingPaidActivities  } from '../services/api'; // Import the commentOnEvent function
import Homet2 from '../components/Homet2.js';

const TouristHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [transportation, setTransportation] = useState([]);
    const [loadingtransportation, setLoadingtransportation] = useState(false);
    const [errortransportation, setErrortransportation] = useState(null);
    
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
                const data = await getAllNotifications(); // Fetch all notifications
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
        
        // Mark all notifications as seen when the icon is clicked
        try {
            for (const notification of notifications) {
                if (!notification.seen) {
                    await markAsSeen(notification._id); // Mark as seen
                }
            }
            // Refresh the notifications to show the updated status
            const updatedNotifications = await getAllNotifications();
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


    
    return (
<div>
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
                    <Link to="/Cart">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                </nav>

                <nav className="signing">
                    <Link to="/TouristHome/TouristProfile">My Profile</Link>
                </nav>

                {/* Notification Icon */}
                <nav className="signing">
                    <div className="relative ml-4"> {/* Added margin-left for spacing */}
                        <FontAwesomeIcon
                            icon={faBell}
                            size="2x" // Increased the size to 2x
                            onClick={handleNotificationClick}
                            className="cursor-pointer text-white" // Added text-white to make the icon white
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
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

            {/* Main content */}
            <div className="content">
                <h1>Welcome to the Home Page!</h1>
                {/* Other content goes here */}
            </div>

            {/* Search Section */}
            <div className="search flex items-center mb-4">
                <label 
                    htmlFor="search-bar" 
                    className="text-lg font-medium text-gray-700 mr-4"
                >
                    Search Events/Places:
                </label>
                <form 
                    onSubmit={handleSearch} 
                    className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                >
                    <input
                        id="search-bar"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                        className="p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="bg-brandBlue text-white py-2 px-4 hover:bg-blue-600 transition duration-300"
                    >
                        Search
                    </button>
                </form>
            </div>

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

export default TouristHome;
