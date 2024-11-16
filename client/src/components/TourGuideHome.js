import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import {
    createItinerary,
    deleteItinerary,
    updateItinerary,
    getAllCreatedByEmail,
    Itineraryactivation 
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
                <h1 className="text-2xl font-bold">My Created Itineraries</h1>

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <>
                        <h2 className="text-xl">Itineraries</h2>
                        <button
                            onClick={openCreateModal}
                            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Create New Itinerary
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data.itineraries.map((itinerary) => (
                                <div
                                    key={itinerary._id}
                                    className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                                    onClick={() => handleItineraryClick(itinerary)}
                                >
                                    {itinerary.Picture && (
                                        <img
                                            src={itinerary.Picture}
                                            alt={itinerary.Itinerary_Name}
                                            className="w-full h-32 object-cover mb-2 rounded"
                                        />
                                    )}
                                    <h3 className="text-lg font-semibold">{itinerary.Itinerary_Name}</h3>
                                </div>
                            ))}
                        </div>

                        {selectedItinerary && (
                            <div className="mt-8 border rounded-lg p-4">
                                <h3 className="text-xl font-semibold">{selectedItinerary.Itinerary_Name}</h3>
                                <p><strong>Time:</strong> {selectedItinerary.Timeline}</p>
                                <p><strong>Duration:</strong> {selectedItinerary.Duration}</p>
                                <p><strong>Language:</strong> {selectedItinerary.Language}</p>
                                <p><strong>Tour Price:</strong> ${selectedItinerary.Tour_Price}</p>
                                <p><strong>Date:</strong> {selectedItinerary.Available_Date_Time}</p>
                                <p><strong>Accessibility:</strong> {selectedItinerary.Accessibility ? 'Yes' : 'No'}</p>
                                <p><strong>Pick Up Point:</strong> {selectedItinerary.Pick_Up_Point}</p>
                                <p><strong>Drop Of Point:</strong> {selectedItinerary.Drop_Of_Point}</p>
                                <p><strong>Available Spots:</strong> {selectedItinerary.Empty_Spots}</p>
                                <p><strong>Booked Spots:</strong> {selectedItinerary.Booked}</p>
                                <p><strong>Country:</strong> {selectedItinerary.Country}</p>
                                <p><strong>Rating:</strong> {selectedItinerary.Rating}</p>
                                <p><strong>Flagged:</strong> {selectedItinerary.Flagged ? 'Yes' : 'No'}</p>
                                <p><strong>Tag:</strong> {selectedItinerary.P_Tag}</p>
                                <button
                                    onClick={() => openEditModal(selectedItinerary)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Edit Itinerary
                                </button>
                                <button
                                    onClick={handleDeleteItinerary}
                                    className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete Itinerary
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Itinerary Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-24">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-5/6 overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Itinerary</h2>
                        <form onSubmit={handleUpdateItinerary}>
                        <label className="block mb-2">
                            Itinerary Name:
                                <input
                                    type="text"
                                    name="Itinerary_Name"
                                    value={itineraryData.Itinerary_Name}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                           
                            <label className="block mb-2">
                                Time:
                                <input
                                    type="text"
                                    name="Timeline"
                                    value={itineraryData.Timeline}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Duration:
                                <input
                                    type="text"
                                    name="Duration"
                                    value={itineraryData.Duration}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Language:
                                <input
                                    type="text"
                                    name="Language"
                                    value={itineraryData.Language}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Price:
                                <input
                                    type="number"
                                    name="Tour_Price"
                                    value={itineraryData.Tour_Price}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Date:
                                <input
                                    type="date"
                                    name="Available_Date_Time"
                                    value={itineraryData.Available_Date_Time}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Accessibility:
                                <input
                                    type="number"
                                    name="Accessibility"
                                    value={itineraryData.Accessibility}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Pick_Up_Point:
                                <input
                                    type="text"
                                    name="Pick_Up_Point"
                                    value={itineraryData.Pick_Up_Point}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Drop_Of_Point:
                                <input
                                    type="text"
                                    name="Drop_Of_Point"
                                    value={itineraryData.Drop_Of_Point}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Booked Spots:
                                <input
                                    type="number"
                                    name="Booked"
                                    value={itineraryData.Booked}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Empty_Spots:
                                <input
                                    type="number"
                                    name="Empty_Spots"
                                    value={itineraryData.Empty_Spots}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                            Country:
                                <input
                                    type="text"
                                    name="Country"
                                    value={itineraryData.Country}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <label className="block mb-2">
                                Rating:
                                <input
                                    type="text"
                                    name="Rating"
                                    value={itineraryData.Rating}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                P_Tag:
                                <input
                                    type="text"
                                    name="P_Tag"
                                    value={itineraryData.P_Tag}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                
                                />
                            </label>
                            <label className="block mb-2">
                                Created_By:
                                <input
                                    type="text"
                                    name="Picture"
                                    value={itineraryData.Created_By}
                                    onChange={handleEditItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Update Itinerary
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
                        <h2 className="text-xl font-bold mb-4">Create Itinerary</h2>
                        <form onSubmit={handleCreateItinerary}>
                            <label className="block mb-2">
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
                            <label className="block mb-2">
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
                            <label className="block mb-2">
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
                            <label className="block mb-2">
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
                            <label className="block mb-2">
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
                            <label className="block mb-2">
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
                            <label className="block mb-2">
                                Accessibility:
                                <input
                                    type="checkbox"
                                    name="Accessibility"
                                    checked={newItineraryData.Accessibility}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Pick_Up_Point:
                                <input
                                    type="text"
                                    name="Pick_Up_Point"
                                    value={newItineraryData.Pick_Up_Point}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Drop_Of_Point:
                                <input
                                    type="text"
                                    name="Drop_Of_Point"
                                    value={newItineraryData.Drop_Of_Point}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    required
                                />
                            </label>
                            
                            <label className="block mb-2">
                                Empty_Spots:
                                <input
                                    type="number"
                                    name="Empty_Spots"
                                    value={newItineraryData.Empty_Spots}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
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
                            <label className="block mb-2">
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
                            <label className="block mb-2">
                                Created_By:
                                <input
                                    type="text"
                                    name="Created_By"
                                    value={newItineraryData.Created_By}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            
                            <label className="block mb-2">
                                Picture:
                                <input
                                    type="text"
                                    name="Picture"
                                    value={newItineraryData.Picture}
                                    onChange={handleNewItineraryChange}
                                    className="border rounded w-full px-2 py-1"
                                    
                                />
                            </label>
                            <button
                                type="submit"
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Create Itinerary
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
        </div>
    );
};

export default TourGuideHome;
