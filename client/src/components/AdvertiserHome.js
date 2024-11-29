import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import {
    createActivityByAdvertiser,
    readActivity,
    deleteActivityByAdvertiser,
    updateActivityByAdvertiser,
    getAllCreatedByEmail,
    calculateActivityRevenue
} from '../services/api';

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
    const [email, setEmail] = useState(null); // State for advertiser email
    const [revenue, setRevenue] = useState(null); // State to store revenue
    const [loadingg, setLoadingg] = useState(false); // State for loading spinner
    const [errorr, setErrorr] = useState(null); // State for error messages

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
        const storedEmail = localStorage.getItem('email'); // Get email from localStorage
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setErrorr('No email found in local storage. Please sign in again.');
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

    const handleCalculateRevenue = async () => {
        if (!email) {
            setErrorr('Email is required to calculate revenue.');
            return;
        }

        setErrorr(null); // Clear previous errors
        setLoadingg(true); // Show loading spinner

        try {
            const revenueData = await calculateActivityRevenue(email);
            setRevenue(revenueData.revenue); // Set the revenue from the response
        } catch (error) {
            console.errorr('Error calculating revenue:', error.message);
            setErrorr(error.message || 'Failed to calculate revenue.');
        } finally {
            setLoadingg(false); // Hide loading spinner
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
            </div>

            <div className="mt-24">
                <h1 className="text-2xl font-bold">My Created Activities</h1>

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <>
                        <h2 className="text-xl">Activities</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white rounded-lg shadow-lg p-4">
                            {data.activities.map((activity) => (
                                <div
                                key={activity._id}
                                className="bg-blue-50 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
                                
                            >
                                <img
                                    src={activity.Picture}
                                    alt={activity.Name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-700">{activity.Name}</h3>
                                </div>
                            </div>
                            ))}
                            {/* Add New Place Button */}
                            <div
                                onClick={openCreateModal}
                                className="flex items-center justify-center p-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer"
                            >
                                <span className="text-3xl font-bold text-gray-500">+</span>
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
            <h1>Advertiser Dashboard</h1>
            {email ? (
                <div>
                    <p>Signed in as: <strong>{email}</strong></p>
                    <button onClick={handleCalculateRevenue} disabled={loading}>
                        {loading ? 'Calculating...' : 'Calculate Revenue'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {revenue !== null && (
                        <div>
                            <h2>Revenue</h2>
                            <p>${revenue.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p style={{ color: 'red' }}>Please sign in to access this feature.</p>
            )}
        </div>

        </div>
    );
};

export default AdvertiserHome;
