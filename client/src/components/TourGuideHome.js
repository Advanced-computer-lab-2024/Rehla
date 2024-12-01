import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import {
    createItinerary,
    deleteItinerary,
    updateItinerary,
    getAllCreatedByEmail,
    Itineraryactivation ,
    calculateItineraryRevenue
} from '../services/api';

const TourGuideHome = () => {
    const [data, setData] = useState({
        itineraries: [],
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert 'activated' / 'deactivated' to boolean
        const accessibilityValue = accessibilitye === 'activated';

        try {
            const response = await Itineraryactivation(itineraryNamee, accessibilityValue);
            setMessageee(response.message);  // Display success message from the API
        } catch (error) {
            setMessageee('Error updating itinerary');
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
                <Link to="/TourGuideHome/TourGuideProfile">My Profile</Link>
                </nav>
            </div>

            <div className="mt-24">

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Created Itineraries</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white rounded-lg shadow-lg p-4">
                                {data.itineraries.map((itinerary) => (
                                    <div
                                        key={itinerary._id}
                                        className="bg-blue-50 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                                        onClick={() => handleItineraryClick(itinerary)}
                                    >
                                        {itinerary.Picture && (
                                            <img
                                                src={itinerary.Picture}
                                                alt={itinerary.Itinerary_Name}
                                                className="w-full h-40 object-cover"
                                            />
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-700">{itinerary.Itinerary_Name}</h3>
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

                            {/*openCreateModal*/}
                            {selectedItinerary && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 mt-20 rounded-lg shadow-lg w-full max-w-7xl overflow-auto relative">
            {/* Close Button */}
            <button
                onClick={() => setSelectedItinerary(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
                ✖
            </button>

            {/* Modal Content */}
            <h3 className="text-2xl font-semibold mb-4 text-center">
                {selectedItinerary.Itinerary_Name}
            </h3>

            {/* Styled Image */}
            <div className="flex justify-center mb-6">
                <img
                    src={selectedItinerary.Picture}
                    alt={selectedItinerary.Itinerary_Name}
                    className="w-full max-w-3xl h-56 object-cover rounded-md shadow"
                />
            </div>

            {/* Data in Columns */}
            <div className="grid grid-cols-2 gap-6">
                <div>
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
                <div>
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
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end mt-6 gap-4">
                <button
                    onClick={() => openEditModal(selectedItinerary)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Edit Itinerary
                </button>
                <button
                    onClick={handleDeleteItinerary}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Delete Itinerary
                </button>
                <button
                    onClick={() => setSelectedItinerary(null)}
                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Close
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
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Edit Itinerary</h2>
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
                            <button
                                onClick={closeEditModal}
                                className="bg-logoOrange text-white px-4 py-2 rounded"
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            )}

            {/* Create Activity Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
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
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Create Itinerary
                            </button>
                            <button
                                onClick={closeCreateModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            
            )}
        <div>
            <h2>Activate or Deactivate Itinerary Accessibility</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Itinerary Name:
                    <input
                        type="text"
                        value={itineraryNamee}
                        onChange={handleItineraryNameChange}
                        required
                    />
                </label>

                <label>
                    Accessibility:
                    <select value={accessibilitye} onChange={handleAccessibilityChange} required>
                        <option value="activated">Activate</option>
                        <option value="deactivated">Deactivate</option>
                    </select>
                </label>

                <button type="submit">{accessibilitye === 'activated' ? 'Deactivate Itinerary' : 'Update Itinerary'}</button>
            </form>

            {messageee && <p>{messageee}</p>} {/* Display success/error message */}
        </div>
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
        </div>
    );
};

export default TourGuideHome;
