import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell } from '@fortawesome/free-solid-svg-icons'; // Notification icon
import {
    createItinerary,
    deleteItinerary,
    updateItinerary,
    getAllCreatedByEmail,
    Itineraryactivation ,
    calculateItineraryRevenue,
    fetchAllSalesReportsitinemail,
    fetchFilteredTourGuideSalesReport,
    getNotificationsForTourGuidet,
    markAsSeennt,
    fetchItineraryReport,
    getTourGuideProfile
} from '../services/api';

const TourGuideHome = () => {
    const [data, setData] = useState({
        itineraries: [],
    });

    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Mobile_Number: '',
        Experience: '',
        Previous_work: '',
        Type: ''
    });
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [itineraryData, setItineraryData] = useState({});
    const [newItineraryData, setNewItineraryData] = useState({
        Itinerary_Name: '',
        Timeline: '',
        Duration: '',
        Language: '',
        Tour_Price: '',
        Available_Date_Time: '',
        Accessibility: '',
        Pick_Up_Point: '',
        Drop_Of_Point: '',
        Booked: '',
        Empty_Spots: '',
        Country: '',
        Rating: '',
        P_Tag: '',
        Created_By: ''
    });
    const [itineraryNamee, setItineraryNamee] = useState('');
    const [accessibilitye, setAccessibilitye] = useState('deactivated'); // Default to 'deactivated'
    const [messageee, setMessageee] = useState('');

    const [email, setEmail] = useState(null); // Advertiser email
    const [itineraryDataa, setItineraryDataa] = useState(null); // Revenue data
    const [loadingg, setLoadingg] = useState(false); // Loading indicator
    const [errorr, setErrorr] = useState(null); // Error messages

    const [currency, setCurrency] = useState('USD');
    const [conversionRates] = useState({
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35
    });

    const [salesReports, setSalesReports] = useState([]);
    const [messagee, setMessagee] = useState('');
    const [reports, setReports] = useState([]);
    const [itineraryFilter, setItineraryFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [month, setMonth] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [itineraryReport, setItineraryReport] = useState(null);
    const [erro, setErro] = useState(null); // State to handle any errors

    const handleViewItineraryReport = async () => {
        try {
            setErro(null);
            const email = localStorage.getItem('email');
            if (!email) {
                setErro("No email found. Please sign in.");
                return;
            }
            const data = await fetchItineraryReport(email);
            setItineraryReport(data);
        } catch (err) {
            setErro("An error occurred while fetching the itinerary report.");
            console.error(err);
        }
    };

    const convertPrice = (price) => {
        return (price * conversionRates[currency]).toFixed(2);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const email = localStorage.getItem('email');
            const profileData = await getTourGuideProfile({ Email: email });
            //setTourist(profileData);
            setFormData(profileData);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        };
        fetchProfile();
    }, []);

    // Fetch notifications for flagged activities
    useEffect(() => {
        const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

        if (email) {
            const fetchNotifications = async () => {
                try {
                    const data = await getNotificationsForTourGuidet(email); // Fetch all notifications
                    setNotifications(data); // Set notifications
                    const unread = data.filter((notification) => !notification.seen).length; // Count unread notifications
                    setUnreadCount(unread);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            };
    
            fetchNotifications();
        }
        }, []);

        const handleNotificationClick = async () => {
            setShowModal(true); // Show the modal when the notification icon is clicked
            
            // Mark all notifications as seen when the icon is clicked
            try {
                for (const notification of notifications) {
                    if (!notification.seen) {
                        await markAsSeennt(notification._id); // Mark as seen
                    }
                }
                // Refresh the notifications to show the updated status
                const updatedNotifications = await getNotificationsForTourGuidet();
                setNotifications(updatedNotifications); // Set updated notifications
            } catch (error) {
                console.error("Error marking notifications as seen:", error);
            }
        };
    
        const handleCloseModal = () => {
            setShowModal(false); // Close the modal
            setUnreadCount(0); // Reset the unread count when the modal is closed
        };





    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            fetchActivities(email);
        } else {
            setError(new Error('No email found in local storage'));
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        const storedEmail = localStorage.getItem('email'); // Fetch email from localStorage
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setErrorr('No email found in local storage. Please sign in again.');
        }
    }, []);

    const handleFetchSalesReports = async () => {
        try {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
    
            if (!email) {
                setMessagee('No email found. Please sign in again.');
                return;
            }
    
            const reports = await fetchAllSalesReportsitinemail(email); // Pass the email to the API function
            setSalesReports(reports);
        } catch (err) {
            setMessagee('Error fetching itinerary sales reports.');
            console.error(err);
        }
    };

    const fetchitinRevenue = async () => {
        try {
            const email = localStorage.getItem('email');
            setLoading(true);
            const reportsData = await calculateItineraryRevenue(email);
            setReports(reportsData);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error(err);
            setError('Failed to fetch activity revenue. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async (email) => {
        setLoading(true);
        try {
            const result = await getAllCreatedByEmail(email);
            setData(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleItineraryClick = (itinerary) => {
        setSelectedItinerary(itinerary);
    };

    const openEditModal = (itinerary) => {
        setItineraryData(itinerary);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const handleEditItineraryChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItineraryData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleUpdateItinerary = async (e) => {
        e.preventDefault();
        try {
            const response = await updateItinerary(itineraryData);
            console.log('Itinerary updated successfully:', response);
            fetchActivities(localStorage.getItem('email'));
            closeEditModal();
        } catch (error) {
            console.error('Error updating Itinerary:', error);
        }
    };

    const handleDeleteItinerary = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Itinerary?");
        if (confirmDelete) {
            try {
                await deleteItinerary(selectedItinerary.Itinerary_Name);
                console.log('Itinerary deleted successfully');
                fetchActivities(localStorage.getItem('email'));
                setSelectedItinerary(null);
            } catch (error) {
                console.error('Error deleting Itinerary:', error);
            }
        }
    };
    const openCreateModal = () => {
        setNewItineraryData({
            Itinerary_Name: '',
        Timeline: '',
        Duration: '',
        Language: '',
        Tour_Price: '',
        Available_Date_Time: '',
        Accessibility: '',
        Pick_Up_Point: '',
        Drop_Of_Point: '',
        Booked: '',
        Empty_Spots: '',
        Country: '',
        Rating: '',
        P_Tag: '',
        Created_By: localStorage.getItem('email') || '',
        Picture: ''
        });
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const handleNewItineraryChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewItineraryData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateItinerary = async (e) => {
        e.preventDefault();
        try {
            const response = await createItinerary(newItineraryData);
            console.log('Itinerary created successfully:', response);
            fetchActivities(localStorage.getItem('email'));
            closeCreateModal();
        } catch (error) {
            console.error('Error creating Itinerary:', error);
        }
    };

    // Handle input change for itinerary name
    const handleItineraryNameChange = (e) => {
        setItineraryNamee(e.target.value);
    };

    // Handle dropdown change for accessibility
    const handleAccessibilityChange = (e) => {
        setAccessibilitye(e.target.value);  // Set to 'activated' or 'deactivated'
    };

    // Handle form submission to activate or deactivate itinerary
    const handleSubmit = async (accessibility) => {
        // Convert 'activated' / 'deactivated' to boolean
        const accessibilityValue = accessibility === "activated";
    
        try {
            const response = await Itineraryactivation(selectedItinerary.Itinerary_Name, accessibilityValue);
            setMessageee(response.message); // Display success message from the API
        } catch (error) {
            setMessageee("Error updating itinerary");
        }
    };
    

    const handleCalculateRevenue = async () => {
        if (!email) {
            setErrorr('Email is required to calculate revenue.');
            return;
        }

        setErrorr(null); // Clear previous errors
        setLoadingg(true); // Show loading spinner

        try {
            const revenueDataa = await calculateItineraryRevenue(email);
            setItineraryDataa(revenueDataa); // Set fetched revenue data
        } catch (errorr) {
            console.error('Error calculating itinerary revenue:', errorr.message);
            setErrorr(errorr.message || 'Failed to calculate revenue.');
        } finally {
            setLoadingg(false); // Hide loading spinner
        }
    };

    const handleFilterFetchSalesReports = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            const reports = await fetchFilteredTourGuideSalesReport(email, itineraryFilter, startDate, endDate, month); // Send filters to API
            setSalesReports(reports);
            setLoading(false);
        } catch (err) {
            setMessagee("Error fetching filtered sales reports.");
            setError(err);
            setLoading(false);
        }
    };


    return (
        <div>
            <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Main Navigation */}
                    <nav className="flex space-x-6">
                        <Link to="/TourGuideHome" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                            Home
                        </Link>
                        <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                            Create
                        </Link>
                        <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                            Reports
                        </Link>
                    </nav>

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
                            <Link to="/TourGuideHome/TourGuideProfile">
                                {/* Profile Picture */}
                                <div className="">
                                    {formData.Profile_Pic ? (
                                        <img
                                            src={formData.Profile_Pic}
                                            alt={`${formData.Name}'s profile`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-black text-white text-center flex items-center justify-center border-2 border-white">
                                            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </nav>
                    </div>


                </div>            
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
            <div className="">

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Created Itineraries</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4">
                                {data.itineraries.map((itinerary) => (
                                    <div
                                        key={itinerary._id}
                                        className="rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
                                        onClick={() => handleItineraryClick(itinerary)}
                                    >
                                        {itinerary.Picture && (
                                            <img
                                                src={itinerary.Picture}
                                                alt={itinerary.Itinerary_Name}
                                                className="w-72 h-72 object-cover rounded duration-300 ease-in-out hover:scale-105"
                                            />
                                        )}
                                        <div className="text-md font-medium text-center mt-2">
                                            {itinerary.Itinerary_Name}
                                        </div>
                                    </div>
                                ))}
                                {/* Add New Itinerary Button */}
                                <div
                                    onClick={openCreateModal}
                                    className="flex items-center justify-center p-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer"
                                >
                                    <span className="text-3xl font-bold text-gray-500">+</span>
                                </div>
                            </div>
                        </section>

                        {/*openItineraryModal*/}
                        {selectedItinerary && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white p-6 mt-20 rounded-lg shadow-lg w-full max-w-5xl relative">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setSelectedItinerary(null)}
                                        className="absolute top-4 right-4 p-2 focus:outline-none"
                                    >
                                        <div className="relative w-5 h-8">
                                            <div className="absolute w-full h-1 bg-brandBlue transform rotate-45" />
                                            <div className="absolute w-full h-1 bg-brandBlue transform -rotate-45" />
                                        </div>
                                    </button>
                                    {/* Modal Content */}
                                    <h3 className="text-2xl font-semibold mb-6 text-center">
                                        {selectedItinerary.Itinerary_Name}
                                    </h3>

                                    {/* Flex Layout for Image and Details */}
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Styled Image */}
                                        <div className="flex-shrink-0 w-full md:w-1/3">
                                            <img
                                                src={selectedItinerary.Picture}
                                                alt={selectedItinerary.Itinerary_Name}
                                                className="w-full h-72 object-cover rounded-md shadow-md"
                                            />
                                        </div>

                                        {/* Itinerary Details */}
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <div className="space-y-4">
                                                <p>
                                                    <strong>Time:</strong> {selectedItinerary.Timeline}
                                                </p>
                                                <p>
                                                    <strong>Duration:</strong> {selectedItinerary.Duration}
                                                </p>
                                                <p>
                                                    <strong>Language:</strong> {selectedItinerary.Language}
                                                </p>
                                                <p>
                                                    <strong>Tour Price:</strong> ${selectedItinerary.Tour_Price}
                                                </p>
                                                <p>
                                                    <strong>Date:</strong> {selectedItinerary.Available_Date_Time}
                                                </p>
                                                <p>
                                                    <strong>Accessibility:</strong> {selectedItinerary.Accessibility ? 'Yes' : 'No'}
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <p>
                                                    <strong>Pick Up Point:</strong> {selectedItinerary.Pick_Up_Point}
                                                </p>
                                                <p>
                                                    <strong>Drop Off Point:</strong> {selectedItinerary.Drop_Of_Point}
                                                </p>
                                                <p>
                                                    <strong>Available Spots:</strong> {selectedItinerary.Empty_Spots}
                                                </p>
                                                <p>
                                                    <strong>Booked Spots:</strong> {selectedItinerary.Booked}
                                                </p>
                                                <p>
                                                    <strong>Country:</strong> {selectedItinerary.Country}
                                                </p>
                                                <p>
                                                    <strong>Rating:</strong> {selectedItinerary.Rating}
                                                </p>
                                                <p>
                                                    <strong>Active:</strong> {selectedItinerary.isActive ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                    
                                    {/* Footer Actions */}
                                    <div className="flex justify-end mt-6 gap-4">
                                        <button
                                            onClick={() => openEditModal(selectedItinerary)}
                                            className="bg-brandBlue text-white px-4 py-2 rounded"
                                        >
                                            Edit Itinerary
                                        </button>
                                        <button
                                            onClick={handleDeleteItinerary}
                                            className="bg-logoOrange text-white px-4 py-2 rounded"
                                        >
                                            Delete Itinerary
                                        </button>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const newAccessibility = selectedItinerary.isActive ? "deactivated" : "activated";
                                                setAccessibilitye(newAccessibility); // Update the state for potential UI sync
                                                await handleSubmit(newAccessibility).then(() => {
                                                    window.location.reload(); // Refresh the page; // Pass the desired value directly
                                                });
                                            }}
                                            className="bg-brandBlue text-white px-4 py-2 rounded"
                                        >
                                            {selectedItinerary.isActive ? "Deactivate Itinerary" : "Activate Itinerary"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Itinerary Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-auto relative">
                    <h2 className="text-xl font-bold mb-4">Edit Itinerary</h2>
                    <button
                        onClick={closeEditModal}
                        className="absolute top-4 right-4 p-2 focus:outline-none"
                        type="button"
                    >
                        <div className="relative w-5 h-8">
                            <div className="absolute w-full h-1 bg-brandBlue transform rotate-45" />
                            <div className="absolute w-full h-1 bg-brandBlue transform -rotate-45" />
                        </div>
                    </button>
                    <form onSubmit={handleUpdateItinerary}>
                        <div className="grid grid-cols-3 gap-4">
                            <label className="block">
                                Itinerary Name:
                                <input
                                    type="text"
                                    name="Itinerary_Name"
                                    value={itineraryData.Itinerary_Name}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Time:
                                <input
                                    type="text"
                                    name="Timeline"
                                    value={itineraryData.Timeline}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Duration:
                                <input
                                    type="text"
                                    name="Duration"
                                    value={itineraryData.Duration}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Language:
                                <input
                                    type="text"
                                    name="Language"
                                    value={itineraryData.Language}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Price:
                                <input
                                    type="number"
                                    name="Tour_Price"
                                    value={itineraryData.Tour_Price}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Date:
                                <input
                                    type="date"
                                    name="Available_Date_Time"
                                    value={itineraryData.Available_Date_Time}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Accessibility:
                                <input
                                    type="number"
                                    name="Accessibility"
                                    value={itineraryData.Accessibility}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Pick-Up Point:
                                <input
                                    type="text"
                                    name="Pick_Up_Point"
                                    value={itineraryData.Pick_Up_Point}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Drop-Off Point:
                                <input
                                    type="text"
                                    name="Drop_Of_Point"
                                    value={itineraryData.Drop_Of_Point}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Booked Spots:
                                <input
                                    type="number"
                                    name="Booked"
                                    value={itineraryData.Booked}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Empty Spots:
                                <input
                                    type="number"
                                    name="Empty_Spots"
                                    value={itineraryData.Empty_Spots}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Country:
                                <input
                                    type="text"
                                    name="Country"
                                    value={itineraryData.Country}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Rating:
                                <input
                                    type="text"
                                    name="Rating"
                                    value={itineraryData.Rating}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                P_Tag:
                                <input
                                    type="text"
                                    name="P_Tag"
                                    value={itineraryData.P_Tag}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Created By:
                                <input
                                    type="text"
                                    name="Created_By"
                                    value={itineraryData.Created_By}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="submit"
                                className="bg-brandBlue text-white px-4 py-2 rounded"
                            >
                                Update Itinerary
                            </button>
                            
                        </div>
                    </form>
                </div>
            </div>
            
            )}

            {/* Create Activity Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative">
                    <h2 className="text-xl font-bold mb-4">Create Itinerary</h2>
                    <form onSubmit={handleCreateItinerary}>
                        <div className="grid grid-cols-3 gap-4">
                            <label className="block">
                                Itinerary Name:
                                <input
                                    type="text"
                                    name="Itinerary_Name"
                                    value={newItineraryData.Itinerary_Name}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Timeline:
                                <input
                                    type="text"
                                    name="Timeline"
                                    value={newItineraryData.Timeline}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Duration:
                                <input
                                    type="text"
                                    name="Duration"
                                    value={newItineraryData.Duration}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Language:
                                <input
                                    type="text"
                                    name="Language"
                                    value={newItineraryData.Language}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Price:
                                <input
                                    type="number"
                                    name="Tour_Price"
                                    value={newItineraryData.Tour_Price}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Date:
                                <input
                                    type="date"
                                    name="Available_Date_Time"
                                    value={newItineraryData.Available_Date_Time}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Accessibility:
                                <input
                                    type="checkbox"
                                    name="Accessibility"
                                    checked={newItineraryData.Accessibility}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-6 h-6"
                                />
                            </label>
                            <label className="block">
                                Pick-Up Point:
                                <input
                                    type="text"
                                    name="Pick_Up_Point"
                                    value={newItineraryData.Pick_Up_Point}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Drop-Off Point:
                                <input
                                    type="text"
                                    name="Drop_Of_Point"
                                    value={newItineraryData.Drop_Of_Point}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Empty Spots:
                                <input
                                    type="number"
                                    name="Empty_Spots"
                                    value={newItineraryData.Empty_Spots}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Country:
                                <input
                                    type="text"
                                    name="Country"
                                    value={newItineraryData.Country}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                P_Tag:
                                <input
                                    type="text"
                                    name="P_Tag"
                                    value={newItineraryData.P_Tag}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block">
                                Created By:
                                <input
                                    type="text"
                                    name="Created_By"
                                    value={newItineraryData.Created_By}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block">
                                Picture:
                                <input
                                    type="text"
                                    name="Picture"
                                    value={newItineraryData.Picture}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="submit"
                                className="bg-brandBlue text-white px-4 py-2 rounded"
                            >
                                Create Itinerary
                            </button>
                            <button
                                onClick={closeCreateModal}
                                className="absolute top-4 right-4 p-2 focus:outline-none"
                                type="button"
                            >
                                <div className="relative w-5 h-8">
                                    <div className="absolute w-full h-1 bg-brandBlue transform rotate-45" />
                                    <div className="absolute w-full h-1 bg-brandBlue transform -rotate-45" />
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            
            )}
        
        <div>
            <h1>Advertiser Dashboard</h1>
            {email ? (
                <div>
                    <p>Signed in as: <strong>{email}</strong></p>
                    <button onClick={handleCalculateRevenue} disabled={loadingg}>
                        {loadingg ? 'Calculating...' : 'Calculate Itinerary Revenue'}
                    </button>
                    {errorr && <p style={{ color: 'red' }}>{errorr}</p>}
                    {itineraryDataa && (
                        <div>
                            <h2>Total Revenue: ${itineraryDataa.totalRevenue.toFixed(2)}</h2>
                            <h3>Itinerary Details</h3>
                            <ul>
                                {itineraryDataa.itineraryDetails.map((itinerary, index) => (
                                    <li key={index}>
                                        <strong>{itinerary.itineraryName}</strong> - 
                                        Price per unit: ${itinerary.tourPrice.toFixed(2)}, 
                                        Paid bookings: {itinerary.paidCount}, 
                                        Revenue: ${itinerary.revenue.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!itineraryDataa && !loadingg && (
                        <p>No revenue data available. Click "Calculate Itinerary Revenue" to fetch data.</p>
                    )}
                </div>
            ) : (
                <p style={{ color: 'red' }}>Please sign in to access this feature.</p>
            )}
        </div>
        
        <div>
    <h1>Tour Guide Home</h1>
    {loading && <p>Loading itineraries...</p>}
    {error && <p>Error: {error.message}</p>}
    {messagee && <p>{messagee}</p>}

    {/* Filter Section */}
    <div>
        <h2>Filter Sales Reports</h2>
        <div>
            <label htmlFor="itineraryFilter">Itinerary:</label>
            <input
                type="text"
                id="itineraryFilter"
                value={itineraryFilter}
                onChange={(e) => setItineraryFilter(e.target.value)}
                placeholder="Enter itinerary name"
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="endDate">End Date:</label>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="month">Month:</label>
            <input
                type="month"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <button
            onClick={handleFilterFetchSalesReports}
            style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Apply Filters
        </button>
    </div>

    {/* Itineraries Section */}
    <div>
        <h2>Sales Reports - Itineraries</h2>
        <button
            onClick={handleFetchSalesReports}
            style={{
                marginBottom: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Fetch All Itinerary Reports
        </button>
        {salesReports.length > 0 ? (
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontSize: "1rem",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Itinerary</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Revenue</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Sales</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {salesReports.map((report) => (
                        <tr
                            key={report.Report_no}
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: report.Report_no % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                        >
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Itinerary}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>${report.Revenue}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Sales}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {new Date(report.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No sales reports available.</p>
        )}
    </div>
</div>

            <div>
            
            <button onClick={fetchitinRevenue}>report</button>

            {loading && <p>Loading Itinerary revenue...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && reports.length > 0 && (
                <div>
                    <h2>Itinerary Revenue Reports</h2>
                    <ul>
                        {reports.map((report, index) => (
                            <li key={index}>
                                <strong>Itinerary:</strong> {report.Itinerary} <br />
                                <strong>Revenue:</strong> ${report.Revenue.toFixed(2)} <br />
                                <strong>Sales:</strong> {report.Sales} <br />
                                <strong>Price:</strong> ${report.Price.toFixed(2)} <br />
                                <strong>Report No:</strong> {report.Report_no}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!loading && !error && reports.length === 0 && <p>No reports found.</p>}
        </div>
        <div>
    {/* Button to fetch and view itinerary report */}
    <button onClick={handleViewItineraryReport}>
        View Itinerary Report
    </button>

    {/* Display the itinerary report if available */}
    {itineraryReport && (
        <div>
            <h2>Itinerary Report</h2>
            <ul>
                {itineraryReport.itineraryDetails.map((itinerary, index) => (
                    <li key={index}>
                        {itinerary.itineraryName}: {itinerary.attendeesCount} attendees
                    </li>
                ))}
            </ul>
            <p><strong>Total Attendees:</strong> {itineraryReport.totalAttendees}</p>
        </div>
    )}
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

export default TourGuideHome;
