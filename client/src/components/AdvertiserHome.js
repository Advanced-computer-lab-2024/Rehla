import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Notification icon
import {
    createActivityByAdvertiser,
    readActivity,
    deleteActivityByAdvertiser,
    updateActivityByAdvertiser,
    getAllCreatedByEmail,
    calculateActivityRevenue, fetchAllSalesReportsemail,
    fetchFilteredAdvertiserSalesReport,
    getNotificationsForTourGuide ,markAsSeenn,
    fetchActivityReport,notifyForFlaggedActivities,
    filterActivityAttendeesByMonth, getAdvertiserProfile
} from '../services/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AdvertiserHome = () => {
    const [data, setData] = useState({
        activities: [],
    });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [activityData, setActivityData] = useState({});
    const [newActivityData, setNewActivityData] = useState({
        Name: '',
        Location: '',
        Time: '',
        Duration: '',
        Price: '',
        Date: '',
        Discount_Percent: '',
        Booking_Available: false,
        Available_Spots: '',
        Booked_Spots: '',
        Rating: '',
        Category: '',
        Tag: '',
        Created_By: '',
        Picture: '',
    });
    
    const [salesReports, setSalesReports] = useState([]);
    const [messagee, setMessagee] = useState('');
    const [dataa, setDataa] = useState({ activities: [] });
    const [revenues, setRevenues] = useState({}); // Store activity revenues
    const [loadingg, setLoadingg] = useState(false);
    const [errorr, setErrorr] = useState(null);
    const [reports, setReports] = useState([]);
    const [activityFilter, setActivityFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [activityReport, setActivityReport] = useState(null); // State to store the report data
    const [erro, setErro] = useState(null); // State to handle any errors
    const [filteredActivityReport, setFilteredActivityReport] = useState(null); // State to store the filtered report data
    const [monthh, setMonthh] = useState(''); // State to store the selected month
    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success
    const [emaill, setEmaill] = useState('');
    // Function to fetch the general activity report
    const handleViewActivityReport = async () => {
        try {
            setErro(null); // Reset errors
            const email = localStorage.getItem('email');
            if (!email) {
                setErro("No email found. Please sign in.");
                return;
            }
            const data = await fetchActivityReport(email);
            setActivityReport(data);
            setFilteredActivityReport(null); // Hide the filtered report
        } catch (err) {
            setErro(err.message);
            console.error("Error fetching activity report:", err);
        }
    };
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Mobile_Number: '',
        Experience: '',
        Previous_work: '',
        Type: ''
    });

    const [currency, setCurrency] = useState('USD');
    const [conversionRates] = useState({
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35
    });

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
            const profileData = await getAdvertiserProfile({ Email: email });
            //setTourist(profileData);
            setFormData(profileData);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        };
        fetchProfile();
    }, []);

    // Function to filter activity attendees by month
    const handleFilterActivityByMonth = async () => {
        try {
            setErro(null); // Reset errors
            const email = localStorage.getItem('email');
            if (!email) {
                setErro("No email found. Please sign in.");
                return;
            }
            if (!monthh || monthh < 1 || monthh > 12) {
                setErro("Please enter a valid month (1-12).");
                return;
            }
            const data = await filterActivityAttendeesByMonth(email, parseInt(monthh, 10));
            setFilteredActivityReport(data);
            setActivityReport(null); // Hide the general report
        } catch (err) {
            setErro(err.message);
            console.error("Error filtering activity attendees by month:", err);
        }
    };



    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmaill(storedEmail);
    
            const handleNotifyForBookings = async () => {
                try {
                    const response = await notifyForFlaggedActivities(storedEmail); // Pass email to notify function
                    setNotificationSuccess(response.message || 'Notifications processed successfully.');
                } catch (err) {
                    setNotificationError(err.message || 'Failed to process notifications.');
                }
            };
    
            handleNotifyForBookings();
        }
    }, []); // This runs only once when the component mounts
    

    // Fetch notifications for flagged activities
    useEffect(() => {
        const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

        if (email) {
            const fetchNotifications = async () => {
                try {
                    const data = await getNotificationsForTourGuide(email); // Fetch all notifications
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
                        await markAsSeenn(notification._id); // Mark as seen
                    }
                }
                // Refresh the notifications to show the updated status
                const updatedNotifications = await getNotificationsForTourGuide();
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

        const fetchActivityRevenue = async () => {
            try {
                const email = localStorage.getItem('email');
                setLoading(true);
                const reportsData = await calculateActivityRevenue(email);
                setReports(reportsData);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error(err);
                setError('Failed to fetch activity revenue. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

     

    
    
    const handleCalculateRevenue = async (activityName) => {
        try {
            const result = await calculateActivityRevenue(activityName);
            setMessagee(`Revenue for '${activityName}' calculated successfully.`);
            console.log(result);
        } catch (err) {
            setMessagee(`Error calculating revenue for '${activityName}'.`);
            console.error(err);
        }
    };

    const handleFetchSalesReports = async () => {
        try {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
    
            if (!email) {
                setMessagee('No email found. Please sign in again.');
                return;
            }
    
            const reports = await fetchAllSalesReportsemail(email); // Pass the email to the API function
            setSalesReports(reports);
        } catch (err) {
            setMessagee('Error fetching sales reports.');
            console.error(err);
        }
    };
    

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    const openEditModal = (activity) => {
        setActivityData(activity);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const handleEditActivityChange = (e) => {
        const { name, value, type, checked } = e.target;
        setActivityData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleUpdateActivity = async (e) => {
        e.preventDefault();
        try {
            const response = await updateActivityByAdvertiser(activityData);
            console.log('Activity updated successfully:', response);
            fetchActivities(localStorage.getItem('email'));
            closeEditModal();
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    const handleDeleteActivity = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
        if (confirmDelete) {
            try {
                await deleteActivityByAdvertiser(selectedActivity.Name);
                console.log('Activity deleted successfully');
                fetchActivities(localStorage.getItem('email'));
                setSelectedActivity(null);
            } catch (error) {
                console.error('Error deleting activity:', error);
            }
        }
    };

    const openCreateModal = () => {
        setNewActivityData({
            Name: '',
            Location: '',
            Time: '',
            Duration: '',
            Price: '',
            Date: '',
            Discount_Percent: '',
            Available_Spots: '',
            Category: '',
            Tag: '',
            Created_By: localStorage.getItem('email') || '' // Assuming Created_By is the email of the advertiser
        });
        //setLocationData(''); // Reset location data
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const handleNewActivityChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewActivityData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateActivity = async (e) => {
        e.preventDefault();
        try {
            const response = await createActivityByAdvertiser(newActivityData);
            console.log('Activity created successfully:', response);
            fetchActivities(localStorage.getItem('email'));
            closeCreateModal();
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    };

    const handleFilterFetchSalesReports = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            const reports = await fetchFilteredAdvertiserSalesReport(email, activityFilter, startDate, endDate, month);
            setSalesReports(reports);  // Store the reports in your state
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setMessagee('Error fetching sales reports.');
            console.error(err);
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
                        <Link to="/AdvertiserHome" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                            My Activities
                        </Link>
                        <a onClick={openCreateModal} href="#uh" className="text-lg font-medium font-family-cursive text-white hover:text-blue-500">
                            Create
                        </a>
                        <Link to="/AdvertiserHome/AdvertiserGuideReport" className="text-lg font-medium text-white hover:text-blue-500">
                            Reports
                        </Link>
                    </nav>

                    <div className="flex items-center ml-auto">
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
            

            <div className="mt-4">
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <>
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-4">
                                {data.activities.map((activity) => (
                                    <div
                                    key={activity._id}
                                    className="card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                    >
                                    {activity.Picture && (
                                        <img
                                        src={activity.Picture}
                                        alt={activity.Name}
                                        className="w-full h-48 "
                                        />
                                    )}
                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div className="text-lg font-semibold text-gray-800">{activity.Name}</div>
                                        <div className="text-sm text-gray-600 mt-2">
                                        <span className="font-semibold">{convertPrice(activity.Price)} {currency}</span>
                                        <div className="mt-1">Rating: {activity.Rating}</div>
                                        <div className="mt-1">Language: {activity.Language}</div>
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
                        {/*openActivityModal*/}
                        {selectedActivity && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white p-6 mt-20 rounded-lg shadow-lg w-full max-w-5xl relative">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setSelectedActivity(null)}
                                        className="absolute top-4 right-4 p-2 focus:outline-none"
                                    >
                                        <div className="relative w-5 h-8">
                                            <div className="absolute w-full h-1 bg-black transform rotate-45" />
                                            <div className="absolute w-full h-1 bg-black transform -rotate-45" />
                                        </div>
                                    </button>
                                    {/* Modal Content */}
                                    <h3 className="text-2xl font-semibold mb-6 text-center">
                                        {selectedActivity.Name}
                                    </h3>

                                    {/* Flex Layout for Image and Details */}
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Styled Image */}
                                        <div className="flex-shrink-0 w-full md:w-1/3">
                                            <img
                                                src={selectedActivity.Picture}
                                                alt={selectedActivity.Name}
                                                className="w-full h-72 object-cover rounded-md shadow-md"
                                            />
                                        </div>

                                        {/* Activity Details */}
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <div className="space-y-4">
                                            <p><strong>Location:</strong> {selectedActivity.Location}</p>
                                            <p><strong>Time:</strong> {selectedActivity.Time}</p>
                                            <p><strong>Duration:</strong> {selectedActivity.Duration}</p>
                                            <p><strong>Price:</strong> ${selectedActivity.Price}</p>
                                            <p><strong>Date:</strong> {selectedActivity.Date}</p>
                                            <p><strong>Discount Percent:</strong> {selectedActivity.Discount_Percent}%</p>
                                            </div>
                                            <div className="space-y-4">
                                            <p><strong>Booking Available:</strong> {selectedActivity.Booking_Available ? 'Yes' : 'No'}</p>
                                            <p><strong>Available Spots:</strong> {selectedActivity.Available_Spots}</p>
                                            <p><strong>Booked Spots:</strong> {selectedActivity.Booked_Spots}</p>
                                            <p><strong>Rating:</strong> {selectedActivity.Rating}</p>
                                            <p><strong>Category:</strong> {selectedActivity.Category}</p>
                                            <p><strong>Tag:</strong> {selectedActivity.Tag}</p>
                                            </div>
                                        </div>

                                    </div>
                                    
                                    {/* Footer Actions */}
                                    <div className="flex justify-end mt-6 gap-4">
                                        <button
                                            onClick={() => openEditModal(selectedActivity)}
                                            className="bg-black text-white px-4 py-2 rounded"
                                        >
                                            Edit Activity
                                        </button>
                                        <button
                                            onClick={handleDeleteActivity}
                                            className="bg-logoOrange text-white px-4 py-2 rounded"
                                        >
                                            Delete Activity
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Activity Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-auto relative">
                        <h2 className="text-xl font-bold mb-4">Edit Activity</h2>
                        <form onSubmit={handleUpdateActivity}>
                        <div className="grid grid-cols-3 gap-4">
                            <label className="block mb-2">
                                Activity Name:
                                <input
                                    type="text"
                                    name="Name"
                                    value={activityData.Name}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Location:
                                <input
                                    type="text"
                                    name="Location"
                                    value={activityData.Location}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Time:
                                <input
                                    type="text"
                                    name="Time"
                                    value={activityData.Time}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Duration:
                                <input
                                    type="text"
                                    name="Duration"
                                    value={activityData.Duration}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Price:
                                <input
                                    type="number"
                                    name="Price"
                                    value={activityData.Price}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Date:
                                <input
                                    type="date"
                                    name="Date"
                                    value={activityData.Date}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Discount Percent:
                                <input
                                    type="number"
                                    name="Discount_Percent"
                                    value={activityData.Discount_Percent}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Booking Available:
                                <input
                                    type="checkbox"
                                    name="Booking_Available"
                                    checked={activityData.Booking_Available}
                                    onChange={handleEditActivityChange}
                                    className="ml-2"
                                />
                            </label>
                            <label className="block mb-2">
                                Available Spots:
                                <input
                                    type="number"
                                    name="Available_Spots"
                                    value={activityData.Available_Spots}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Booked Spots:
                                <input
                                    type="number"
                                    name="Booked_Spots"
                                    value={activityData.Booked_Spots}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Rating:
                                <input
                                    type="number"
                                    name="Rating"
                                    value={activityData.Rating}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Category:
                                <input
                                    type="text"
                                    name="Category"
                                    value={activityData.Category}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Tag:
                                <input
                                    type="text"
                                    name="Tag"
                                    value={activityData.Tag}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Created By:
                                <input
                                    type="text"
                                    name="Created_By"
                                    value={activityData.Created_By}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Picture URL:
                                <input
                                    type="text"
                                    name="Picture"
                                    value={activityData.Picture}
                                    onChange={handleEditActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="submit"
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                Update Activity
                            </button>
                            <button
                                onClick={closeEditModal}
                                className="absolute top-4 right-4 p-2 focus:outline-none"
                                type="button"
                            >
                                <div className="relative w-5 h-8">
                                    <div className="absolute w-full h-1 bg-black transform rotate-45" />
                                    <div className="absolute w-full h-1 bg-black transform -rotate-45" />
                                </div>
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Activity Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-28">
                    <div className="bg-white p-6 shadow-lg w-full relative min-h-[600px]">
                        <h2 className="text-xl font-bold mb-4">Create Activity</h2>
                        <form onSubmit={handleCreateActivity}>
                        <div className="grid grid-cols-3 gap-4">
                            <label className="block mb-2">
                                Activity Name:
                                <input
                                    type="text"
                                    name="Name"
                                    value={newActivityData.Name}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Location:
                                <input
                                    type="text"
                                    name="Location"
                                    value={newActivityData.Location}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Time:
                                <input
                                    type="text"
                                    name="Time"
                                    value={newActivityData.Time}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Duration:
                                <input
                                    type="text"
                                    name="Duration"
                                    value={newActivityData.Duration}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Price:
                                <input
                                    type="number"
                                    name="Price"
                                    value={newActivityData.Price}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Date:
                                <input
                                    type="date"
                                    name="Date"
                                    value={newActivityData.Date}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Discount Percent:
                                <input
                                    type="number"
                                    name="Discount_Percent"
                                    value={newActivityData.Discount_Percent}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            
                            <label className="block mb-2">
                                Available Spots:
                                <input
                                    type="number"
                                    name="Available_Spots"
                                    value={newActivityData.Available_Spots}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Category:
                                <input
                                    type="text"
                                    name="Category"
                                    value={newActivityData.Category}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Tag:
                                <input
                                    type="text"
                                    name="Tag"
                                    value={newActivityData.Tag}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Created By:
                                <input
                                    type="text"
                                    name="Created_By"
                                    value={newActivityData.Created_By}
                                    onChange={handleNewActivityChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="submit"
                                className="bg-black text-white px-4 py-2 rounded-full"
                            >
                                Create Activity
                            </button>
                            <button
                                onClick={closeCreateModal}
                                className="absolute top-4 right-4 p-2 focus:outline-none"
                                type="button"
                            >
                                <div className="relative w-5 h-8">
                                    <div className="absolute w-full h-1 bg-black transform rotate-45" />
                                    <div className="absolute w-full h-1 bg-black transform -rotate-45" />
                                </div>
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}        
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

export default AdvertiserHome;