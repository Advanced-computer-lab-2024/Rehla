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
import Joyride from "react-joyride";

const Transportation = () => {
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

    const [isTourOpen, setIsTourOpen] = useState(false);

    const steps = [
        {
            target: '#view-prof', // Target sign-in button
            content: 'Click here to view and edit your profile.',
        },
        {
            target: "#search-form",
            content: "Use this form to search for activities and itineraries.",
        },
        {
            target: "#notification",
            content: "Click here to see all your notifications.",
        },
        {
            target: "#cart",
            content: "Click here to see all your cart items.",
        },
        {
            target: "#curr",
            content: "Click here to switch between currencies.",
        },
        {
            target: '#filter-act', // Target itinerary filter section
            content: 'Use the filter options to narrow down your preferred activities.',
        },
        {
            target: '#view-detailsact', // Target the view details button
            content: 'Click here to view more details of a specific activities.',
        },
        {
            target: '#filter-itinerary', // Target itinerary filter section
            content: 'Use the filter options to narrow down your preferred itineraries.',
        },
        {
            target: '#view-details', // Target the view details button
            content: 'Click here to view more details of a specific itinerary.',
        },
        {
            target: '#museum-section', // Target the museums section
            content: 'Explore fascinating museums and historical places here.',
        },
        {
            target: '#footer', // Target the footer links
            content: 'Find more information about the company and contact us from the footer.',
        },
    ];

    const handleStartTour = () => {
        setIsTourOpen(true);
    };

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
    
    
  

    useEffect(() => {
        console.log("Updated filteredPlacesAndMuseums:", filteredPlacesAndMuseums);
    }, [filteredPlacesAndMuseums]);

    if (error) {
        return <div className="text-red-500 text-center">Error: {error.message}</div>;
    }

    if (!data) {
        return <div className="text-center py-10">Loading...</div>;
    }
    
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
                    <Link to="/Flights" className="text-lg font-medium text-white hover:text-logoOrange">
                        Flights
                    </Link>
                    <Link to="/Hotels" className="text-lg font-medium text-white hover:text-logoOrange">
                        Hotels
                    </Link>
                    <Link to="/Transportation" className="text-lg font-medium text-logoOrange">
                        Transportation
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
            <div className="w-full p-6 bg-white shadow-lg rounded-lg">
    {loadingtransportation && (
        <p className="text-blue-500 text-center mb-4 font-semibold animate-pulse">
            Loading...
        </p>
    )}
    {errortransportation && (
        <p className="text-red-500 text-center mb-4 font-semibold">
            {errortransportation}
        </p>
    )}

    {transportation.length > 0 ? (
        <div className="overflow-x-auto min-h-screen mt-20">
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <thead>
                    <tr className="bg-black text-white text-left">
                        <th className="py-5 px-4 font-semibold">Route #</th>
                        <th className="py-5 px-4 font-semibold">Advertiser Name</th>
                        <th className="py-5 px-4 font-semibold">Email</th>
                        <th className="py-5 px-4 font-semibold">Phone</th>
                        <th className="py-5 px-4 font-semibold">Pickup Location</th>
                        <th className="py-5 px-4 font-semibold">Dropoff Location</th>
                        <th className="py-5 px-4 font-semibold">Pickup Date</th>
                        <th className="py-5 px-4 font-semibold">Pickup Time</th>
                        <th className="py-5 px-4 font-semibold">Dropoff Time</th>
                        <th className="py-5 px-4 font-semibold">Price</th>
                        <th className="py-5 px-4 font-semibold">Availability</th>
                        <th className="py-5 px-4 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transportation.map((item, index) => (
                        <tr 
                            key={item._id} 
                            className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition duration-150`}
                        >
                            <td className="py-3 px-4">{item.Route_Number}</td>
                            <td className="py-3 px-4">{item.Advertiser_Name}</td>
                            <td className="py-3 px-4">{item.Advertiser_Email}</td>
                            <td className="py-3 px-4">{item.Advertiser_Phone}</td>
                            <td className="py-3 px-4">{item.Pickup_Location}</td>
                            <td className="py-3 px-4">{item.Dropoff_Location}</td>
                            <td className="py-3 px-4">{new Date(item.Pickup_Date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{item.Pickup_Time}</td>
                            <td className="py-3 px-4">{item.Droppff_Time}</td>
                            <td className="py-3 px-4 font-bold text-logoOrange">${item.Price}</td>
                            <td className="py-3 px-4">
                                <span 
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.Avilable ? 'text-logoOrange' : 'bg-red-100 text-red-800'}`}
                                >
                                    {item.Avilable ? 'Available' : 'Unavailable'}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleBooking(item.Route_Number)} 
                                    className="bg-black text-white px-3 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-logoOrange"
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


            <footer id="footer" className="bg-black shadow m-0">
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

export default Transportation;
