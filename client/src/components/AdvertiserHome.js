import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
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
    getNotificationsForTourGuide ,markAsSeenn,fetchActivityReport,notifyForFlaggedActivities
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
    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success
    const [emaill, setEmaill] = useState('');
    const handleViewActivityReport = async () => {
        try {
            setErro(null); // Reset errors
    
            // Retrieve email from localStorage
            const email = localStorage.getItem('email');
            if (!email) {
                setErro("No email found. Please sign in.");
                return;
            }
    
            // Fetch the report with the user's email
            const data = await fetchActivityReport(email);
            setActivityReport(data); // Set the report data
        } catch (err) {
            setErro(err.message); // Handle errors
            console.error("Error fetching activity report:", err);
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
            <div className="NavBar">
                <img src={logo} alt="Logo" />
                <nav className="main-nav">
                    <ul className="nav-links">
                        <Link to="/">Home</Link>
                    </ul>
                </nav>

                <nav className="signing">
                    <Link to="/AdvertiserHome/AdvertiserProfile">My Profile</Link>
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
            

            <div className="mt-24">
                <h1 className="text-2xl font-bold">My Created Activities</h1>

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <>
                        <h2 className="text-xl">Activities</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-4">
                            {data.activities.map((activity) => (
                                <div
                                key={activity._id}
                                className="card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                onClick={() => openEditModal(activity)} // Click handler to open the edit modal
                                >
                                <img
                                    src={activity.Picture}
                                    alt={activity.Name}
                                    className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                                <div className="p-4 flex flex-col justify-between flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800">{activity.Name}</h3>
                                </div>
                                </div>
                            ))}

                            {/* Add New Activity Button */}
                            <div
                                onClick={openCreateModal}
                                className="flex items-center justify-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                            >
                                <span className="text-4xl font-bold text-gray-500">+</span>
                            </div>
                            </div>


                        {selectedActivity && (
                            <div className="mt-8 border rounded-lg p-4">
                                <h3 className="text-xl font-semibold">{selectedActivity.Name}</h3>
                                <p><strong>Location:</strong> {selectedActivity.Location}</p>
                                <p><strong>Time:</strong> {selectedActivity.Time}</p>
                                <p><strong>Duration:</strong> {selectedActivity.Duration}</p>
                                <p><strong>Price:</strong> ${selectedActivity.Price}</p>
                                <p><strong>Date:</strong> {selectedActivity.Date}</p>
                                <p><strong>Discount Percent:</strong> {selectedActivity.Discount_Percent}%</p>
                                <p><strong>Booking Available:</strong> {selectedActivity.Booking_Available ? 'Yes' : 'No'}</p>
                                <p><strong>Available Spots:</strong> {selectedActivity.Available_Spots}</p>
                                <p><strong>Booked Spots:</strong> {selectedActivity.Booked_Spots}</p>
                                <p><strong>Rating:</strong> {selectedActivity.Rating}</p>
                                <p><strong>Category:</strong> {selectedActivity.Category}</p>
                                <p><strong>Tag:</strong> {selectedActivity.Tag}</p>
                                <button
                                    onClick={() => openEditModal(selectedActivity)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Edit Activity
                                </button>
                                <button
                                    onClick={handleDeleteActivity}
                                    className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete Activity
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Activity Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-5/6 overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Activity</h2>
                        <form onSubmit={handleUpdateActivity}>
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
                            <button
                                type="submit"
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Update Activity
                            </button>
                            <button
                                onClick={closeEditModal}
                                className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                                type="button"
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Activity Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-5/6 overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Create Activity</h2>
                        <form onSubmit={handleCreateActivity}>
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
                            
                            <button
                                type="submit"
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Create Activity
                            </button>
                            <button
                                onClick={closeCreateModal}
                                className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                                type="button"
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}
 <div>
    <h1>Advertiser Home</h1>
    {loading && <p>Loading activities...</p>}
    {error && <p>Error: {error.message}</p>}
    {messagee && <p>{messagee}</p>}

    {/* Filter Section */}
    <div>
        <h2>Filter Sales Reports</h2>
        <div>
            <label htmlFor="activityFilter">Activity:</label>
            <input
                type="text"
                id="activityFilter"
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                placeholder="Enter activity name"
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

    {/* Activities Section */}
    <div>
        <h2>Sales Reports - Activities</h2>
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
            Fetch All Activity Reports
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
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Activity</th>
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
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Activity}</td>
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
            <h1>Advertiser Home</h1>
            <button onClick={fetchActivityRevenue}>report</button>

            {loading && <p>Loading activity revenue...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && reports.length > 0 && (
                <div>
                    <h2>Activity Revenue Reports</h2>
                    <ul>
                        {reports.map((report, index) => (
                            <li key={index}>
                                <strong>Activity:</strong> {report.Activity} <br />
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
    {/* Button to fetch and view activity report */}
    <button onClick={handleViewActivityReport}>
        View Activity Report
    </button>

    {/* Display the report if available */}
    {activityReport && (
        <div>
            <h2>Activity Report</h2>
            <ul>
                {activityReport.activityDetails.map((activity, index) => (
                    <li key={index}>
                        {activity.activityName} (Date: {new Date(activity.date).toLocaleDateString()}): {activity.attendeesCount} attendees
                    </li>
                ))}
            </ul>
            <p><strong>Total Attendees:</strong> {activityReport.totalAttendees}</p>
        </div>
    )}
</div>





        </div>
    );
};

export default AdvertiserHome;