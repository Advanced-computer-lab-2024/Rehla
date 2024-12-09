// TourisimGovernerHome.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logoWhite.png';
import {
    createMuseum,
    readMuseum,
    createHistoricalPlace,
    readHistoricalPlace,
    updateMuseum,
    updateHistoricalPlace,
    deleteMuseum,
    deleteHistoricalPlace,
    getAllCreatedByEmail
} from '../services/api'; // Adjust the import path based on your project structure

const TourisimGovernerHome = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMuseum, setSelectedMuseum] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);


    const [isPlaceEditModalOpen, setIsPlaceEditModalOpen] = useState(false);



    const [selectedHistoricalPlace, setSelectedHistoricalPlace] = useState(null);


    const handleMuseumClick = (museum) => {
        setSelectedMuseum(museum);
        setIsEditModalOpen(true); // Open the modal
    };

    // Function to toggle the modal's visibility
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const toggleEditModal = (museum) =>{
        setSelectedMuseum(museum);
        setDeleteMuseumName(museum.Name); // Set the name of the selected museum
        setIsEditModalOpen(!isEditModalOpen);
    } 

    const togglePlaceModal = () => setIsPlaceModalOpen(!isPlaceModalOpen);

     

    const handleHistoricalPlaceClick = (historicalPlace) => {
        setSelectedHistoricalPlace(historicalPlace);
    };

    const openEditModal = (historicalPlace) =>{
        setSelectedHistoricalPlace(historicalPlace);
        setIsPlaceEditModalOpen(true);
    }

    const togglePlaceEditModal = (HistoricalPlace) =>{
       
        setIsPlaceEditModalOpen(!isPlaceEditModalOpen);
    } 

    // State for Museum data
    const [museumData, setMuseumData] = useState({
        Name: '',
        description: '',
        pictures: '',
        location: '',
        Country: '',
        Opening_Hours: '',
        S_Tickets_Prices: '',
        F_Tickets_Prices: '',
        N_Tickets_Prices: '',
        Tag: '',
        Created_By: ''
    });
    const [museumResponse, setMuseumResponse] = useState(null);

    // State for Museum update data
    const [museumUpdateData, setMuseumUpdateData] = useState({
        Name: '',
        description: '',
        pictures: '',
        location: '',
        Country: '',
        Opening_Hours: '',
        S_Tickets_Prices: '',
        F_Tickets_Prices: '',
        N_Tickets_Prices: '',
        Tag: '',
        Created_By: ''
    });
    // State for Historical Place data
    const [placeData, setPlaceData] = useState({
        Name: '',
        Description: '',
        Pictures: '',
        Location: '',
        Country: '',
        Opens_At: '',
        Closes_At: '',
        S_Ticket_Prices: '',
        F_Ticket_Prices: '',
        N_Ticket_Prices: '',
        Created_By: ''
    });
    const [placeResponse, setPlaceResponse] = useState(null);

    // State for Historical Place update data
    const [placeUpdateData, setPlaceUpdateData] = useState({ ...placeData });

    // State for reading data
    const [museumName, setMuseumName] = useState('');
    const [historicalPlaceName, setHistoricalPlaceName] = useState('');

    // State for delete data
    const [deleteMuseumName, setDeleteMuseumName] = useState('');
    const [deleteHistoricalPlaceName, setDeleteHistoricalPlaceName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState({
        activities: [],
        historicalPlaces: [],
        museums: [],
        itineraries: [],
    });

    useEffect(() => {
        const email = localStorage.getItem('email'); // Get email from local storage
        if (email) {
            fetchPlaces(email);
        } else {
            setError(new Error('No email found in local storage'));
            setLoading(false);
        }
    }, []);

    const fetchPlaces = async (email) => {
        setLoading(true); // Set loading state
        try {
            const result = await getAllCreatedByEmail(email); // Fetch data based on email
            setData(result.data); // Update state with fetched data
        } catch (err) {
            setError(err); // Set error state if there's an issue
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Create Museum
    const handleCreateMuseum = async (e) => {
        e.preventDefault();
        try {
            const response = await createMuseum(museumData);
            setMuseumResponse(response.data);
        } catch (error) {
            console.error(error);
            setMuseumResponse({ error: error.message });
        }
    };

    // Read Museum
    const handleReadMuseum = async (e) => {
        e.preventDefault();
        try {
            const response = await readMuseum(museumName);
            setMuseumResponse(response.data);
        } catch (error) {
            console.error(error);
            setMuseumResponse({ error: error.message });
        }
    };

    // Create Historical Place
    const handleCreateHistoricalPlace = async (e) => {
        e.preventDefault();
        try {
            const response = await createHistoricalPlace(placeData);
            setPlaceResponse(response.data);
        } catch (error) {
            console.error(error);
            setPlaceResponse({ error: error.message });
        }
    };

    // Read Historical Place
    const handleReadHistoricalPlace = async (e) => {
        e.preventDefault();
        try {
            const response = await readHistoricalPlace(historicalPlaceName);
            setPlaceResponse(response.data);
        } catch (error) {
            console.error(error);
            setPlaceResponse({ error: error.message });
        }
    };

    // Handle form submission
    const handleUpdateMuseum = async (e) => {
        e.preventDefault();
        try {
            const response = await updateMuseum(museumUpdateData);
            setMuseumResponse({ message: 'Museum updated successfully!', data: response.data });
            alert('Museum updated successfully!');
        } catch (error) {
            setMuseumResponse({
                error: error.response?.data?.message || 'An error occurred while updating the museum'
            });
        }
    };

    // Update Historical Place
    const handleUpdateHistoricalPlace = async (e) => {
        e.preventDefault();
        try {
            const response = await updateHistoricalPlace(placeUpdateData);
            setPlaceResponse(response.data);
            alert('Historical place updated successfully!');
        } catch (error) {
            console.error(error);
            setPlaceResponse({ error: error.message });
        }
    };

    // Delete Museum
    const handleDeleteMuseum = async (e) => {
        e.preventDefault();
        try {
            const response = await deleteMuseum(deleteMuseumName);
            setMuseumResponse(response.data);
        } catch (error) {
            console.error(error);
            setMuseumResponse({ error: error.message });
        }
    };

    // Delete Historical Place
    const handleDeleteHistoricalPlace = async (e) => {
        e.preventDefault();
        try {
            const response = await deleteHistoricalPlace(deleteHistoricalPlaceName);
            setPlaceResponse(response.data);
        } catch (error) {
            console.error(error);
            setPlaceResponse({ error: error.message });
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
                        <Link to="/TourisimGovernerHome" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                            My LandMarks
                        </Link>
                        <Link to="/createTag" href="#uh" className="text-lg font-medium font-family-cursive text-white hover:text-blue-500">
                            Create Tag
                        </Link>
                        
                    </nav>
                </div>            
            </div>
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historical Places</h2>
                <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-4">
                                {data.historicalPlaces.map((place) => (
                                    <div
                                    key={place._id}
                                    className="card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                    >
                                    {place.Pictures && (
                                        <img
                                        src={place.Pictures}
                                        alt={place.Name}
                                        className="w-full h-48 "
                                        />
                                    )}
                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div className="text-lg font-semibold text-gray-800">{place.Name}</div>
                                        <div className="text-sm text-gray-600 mt-2">
                                        </div>
                                        <button 
                                        onClick={() => handleHistoricalPlaceClick(place)} 
                                        className="mt-4 bg-black text-white rounded-full py-2 px-4 w-full hover:bg-gray-700"
                                        >
                                        View Details
                                        </button>
                                        
                                    </div>
                                    </div>
                                ))}
                            </div>


                        </section>

            </section>

            {selectedHistoricalPlace && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white p-6 mt-20 rounded-lg shadow-lg w-full max-w-5xl relative">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setSelectedHistoricalPlace(null)}
                                        className="absolute top-4 right-4 p-2 focus:outline-none"
                                    >
                                        <div className="relative w-5 h-8">
                                            <div className="absolute w-full h-1 bg-black transform rotate-45" />
                                            <div className="absolute w-full h-1 bg-black transform -rotate-45" />
                                        </div>
                                    </button>
                                    {/* Modal Content */}
                                    <h3 className="text-2xl font-semibold mb-6 text-center">
                                        {selectedHistoricalPlace.Name}
                                    </h3>

                                    {/* Flex Layout for Image and Details */}
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Styled Image */}
                                        <div className="flex-shrink-0 w-full md:w-1/3">
                                            <img
                                                src={selectedHistoricalPlace.Pictures}
                                                alt={selectedHistoricalPlace.Name}
                                                className="w-full h-72 object-cover rounded-md shadow-md"
                                            />
                                        </div>

                                        {/* Activity Details */}
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <div className="space-y-4">
                                            <p><strong>Description:</strong> {selectedHistoricalPlace.Description}</p>
                                            <p><strong>Location:</strong> {selectedHistoricalPlace.Location}</p>
                                            <p><strong>Country:</strong> {selectedHistoricalPlace.Country}</p>
                                            <p><strong>Opens_At:</strong> {selectedHistoricalPlace.Opens_At}</p>
                                            <p><strong>Closes_At:</strong> {selectedHistoricalPlace.Closes_At}</p>
                                            </div>
                                            <div className="space-y-4">
                                            <p><strong>S_Ticket_Prices:</strong> ${selectedHistoricalPlace.S_Ticket_Prices}</p>
                                            <p><strong>F_Ticket_Prices:</strong> ${selectedHistoricalPlace.F_Ticket_Prices}</p>
                                            <p><strong>N_Ticket_Prices:</strong> ${selectedHistoricalPlace.N_Ticket_Prices}</p>
                                            <p><strong>Tag:</strong> {selectedHistoricalPlace.Type}</p>
                                            </div>
                                        </div>

                                    </div>
                                    
                                    {/* Footer Actions */}
                                    <div className="flex justify-end mt-6 gap-4">
                                        <button
                                            onClick={() => openEditModal(selectedHistoricalPlace)}
                                            className="bg-black text-white px-4 py-2 rounded"
                                        >
                                            Edit Place
                                        </button>
                                        <button
                                            onClick={selectedHistoricalPlace}
                                            className="bg-logoOrange text-white px-4 py-2 rounded"
                                        >
                                            Delete Place
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Museums</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-4">
                    {data.museums.map((museum) => (
                        <div
                        key={museum._id}
                        className="card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer"
                        onClick={() => handleMuseumClick(museum)} // Click handler for museums
                        >
                        <img
                            src={museum.pictures}
                            alt={museum.Name}
                            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">{museum.Name}</h3>
                        </div>
                        </div>
                    ))}

                    {/* Add New Museum Button */}
                    <div
                        onClick={toggleModal}
                        className="flex items-center justify-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                    >
                        <span className="text-4xl font-bold text-gray-500">+</span>
                    </div>
                    </div>

            </section>




           {/* Modal museums */}
           {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md max-h-[500px] overflow-auto">
                        <h2 className="text-2xl font-semibold mb-4">Create Museum</h2>
                        <form onSubmit={handleCreateMuseum} className="space-y-4">
                            {Object.keys(museumData).map((key) => (
                                <input
                                    key={key}
                                    placeholder={key.replace(/_/g, ' ')}
                                    value={museumData[key]}
                                    onChange={(e) =>
                                        setMuseumData({ ...museumData, [key]: e.target.value })
                                    }
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Create Museum
                            </button>
                        </form>
                        <button
                            onClick={toggleModal}
                            className="mt-4 text-red-500 hover:underline"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Read Museum</h2>
                <form onSubmit={handleReadMuseum} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Museum Name"
                        value={museumName}
                        onChange={(e) => setMuseumName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                        Read Museum
                    </button>
                </form>
            </section>
            {isPlaceModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full h-auto max-h-[500px] overflow-y-auto">
                    <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Create Historical Place</h2>
                        <form onSubmit={handleCreateHistoricalPlace} className="space-y-4">
                            {Object.keys(placeData).map((key) => (
                                <input
                                    key={key}
                                    placeholder={key.replace(/_/g, ' ')}
                                    value={placeData[key]}
                                    onChange={(e) => setPlaceData({ ...placeData, [key]: e.target.value })}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Create Historical Place
                            </button>
                            <button
                                onClick={togglePlaceModal}
                                className="mt-4 text-red-500 hover:underline"
                            >
                                Close
                            </button>
                        </form>
                    </section>
                    </div>
                </div>    
            )}

            {/* Modal for Updating Historical Place */}
            {isPlaceEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full h-auto max-h-[500px] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Update Historical Place</h2>
                        <form onSubmit={handleUpdateHistoricalPlace} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name (required)"
                                value={selectedHistoricalPlace?.Name || ''}
                                onChange={(e) =>
                                    setSelectedHistoricalPlace({ ...selectedHistoricalPlace, Name: e.target.value })
                                }
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={placeUpdateData?.Description || selectedHistoricalPlace?.Description || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, Description: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Pictures URL"
                                value={placeUpdateData?.Pictures || selectedHistoricalPlace?.Pictures || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, Pictures: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={placeUpdateData?.Location || selectedHistoricalPlace?.Location || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, Location: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={placeUpdateData?.Country || selectedHistoricalPlace?.Country || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, Country: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Opens At"
                                value={placeUpdateData?.Opens_At || selectedHistoricalPlace?.Opens_At || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, Opens_At: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Closes At"
                                value={placeUpdateData?.Closes_At || selectedHistoricalPlace?.Closes_At || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, Closes_At: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Standard Ticket Price"
                                value={placeUpdateData?.S_Ticket_Prices || selectedHistoricalPlace?.S_Ticket_Prices || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, S_Ticket_Prices: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Family Ticket Price"
                                value={placeUpdateData?.F_Ticket_Prices || selectedHistoricalPlace?.F_Ticket_Prices || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, F_Ticket_Prices: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="New Ticket Price"
                                value={placeUpdateData?.N_Ticket_Prices || selectedHistoricalPlace?.N_Ticket_Prices || ''}
                                onChange={(e) =>
                                    setPlaceUpdateData({ ...selectedHistoricalPlace, N_Ticket_Prices: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Created By"
                                value={selectedHistoricalPlace?.Created_By || ''}
                                onChange={(e) =>
                                    setSelectedHistoricalPlace({ ...selectedHistoricalPlace, Created_By: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition duration-200"
                            >
                                Update Historical Place
                            </button>
                            <button
                                type="button"
                                onClick={togglePlaceEditModal}
                                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Updating Museum */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full h-auto max-h-[500px] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Update Museum</h2>
                        <form onSubmit={handleUpdateMuseum} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Museum Name (required)"
                                value={selectedMuseum?.Name || ''}
                                onChange={(e) =>
                                    setSelectedMuseum({ ...selectedMuseum, Name: e.target.value })
                                }
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={museumUpdateData?.description || selectedMuseum?.description || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, description: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Pictures URL"
                                value={museumUpdateData?.pictures || selectedMuseum?.pictures || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, pictures: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={museumUpdateData?.location || selectedMuseum?.location || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, location: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={museumUpdateData?.Country || selectedMuseum?.Country || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, Country: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Opening Hours"
                                value={museumUpdateData?.Opening_Hours || selectedMuseum?.Opening_Hours || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, Opening_Hours: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Standard Ticket Price"
                                value={museumUpdateData?.S_Tickets_Prices || selectedMuseum?.S_Tickets_Prices || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, S_Tickets_Prices: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Family Ticket Price"
                                value={museumUpdateData?.F_Tickets_Prices || selectedMuseum?.F_Tickets_Prices || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, F_Tickets_Prices: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="New Ticket Price"
                                value={museumUpdateData?.N_Tickets_Prices || selectedMuseum?.N_Tickets_Prices || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, N_Tickets_Prices: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Tag"
                                value={museumUpdateData?.Tag || selectedMuseum?.Tag || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, Tag: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {/* Add Created_By field if necessary */}
                            <input
                                type="text"
                                placeholder="Created By"
                                value={selectedMuseum?.Created_By || ''}
                                onChange={(e) =>
                                    setMuseumUpdateData({ ...selectedMuseum, Created_By: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Update Museum
                            </button>
                            <button
                                type="button"
                                onClick={toggleEditModal}
                                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}



            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Delete Museum</h2>
                <form onSubmit={handleDeleteMuseum} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Museum Name to Delete"
                        value={deleteMuseumName}
                        onChange={(e) => setDeleteMuseumName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                        Delete Museum
                    </button>
                </form>
            </section>


            <h1 className="text-3xl font-bold mb-8 text-center">Historical Places</h1>

            {/* Historical Place Form */}
            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Create Historical Place</h2>
                <form onSubmit={handleCreateHistoricalPlace} className="space-y-4">
                    {Object.keys(placeData).map((key) => (
                        <input
                            key={key}
                            placeholder={key.replace(/_/g, ' ')}
                            value={placeData[key]}
                            onChange={(e) => setPlaceData({ ...placeData, [key]: e.target.value })}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Create Historical Place
                    </button>
                </form>
            </section>

            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Read Historical Place</h2>
                <form onSubmit={handleReadHistoricalPlace} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Historical Place Name"
                        value={historicalPlaceName}
                        onChange={(e) => setHistoricalPlaceName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                        Read Historical Place
                    </button>
                </form>
            </section>

            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Update Historical Place</h2>
                <form onSubmit={handleUpdateHistoricalPlace} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Historical Place Name to Update"
                        value={placeUpdateData.Name}
                        onChange={(e) => setPlaceUpdateData({ ...placeUpdateData, Name: e.target.value })}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {Object.keys(placeUpdateData).map((key) => (
                        <input
                            key={key}
                            placeholder={key.replace(/_/g, ' ')}
                            value={placeUpdateData[key]}
                            onChange={(e) => setPlaceUpdateData({ ...placeUpdateData, [key]: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition duration-200"
                    >
                        Update Historical Place
                    </button>
                </form>
            </section>

            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Delete Historical Place</h2>
                <form onSubmit={handleDeleteHistoricalPlace} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Historical Place Name to Delete"
                        value={deleteHistoricalPlaceName}
                        onChange={(e) => setDeleteHistoricalPlaceName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                        Delete Historical Place
                    </button>
                </form>
            </section>


            {/* Museum Response */}
            {museumResponse && museumResponse.data && (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Museum Response</h3>
                    <table className="table-auto w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Name</th>
                                <td className="px-4 py-2">{museumResponse.data.Name}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Description</th>
                                <td className="px-4 py-2">{museumResponse.data.description}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Pictures</th>
                                <td className="px-4 py-2">{museumResponse.data.pictures}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Location</th>
                                <td className="px-4 py-2">{museumResponse.data.location}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Country</th>
                                <td className="px-4 py-2">{museumResponse.data.Country}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Opening Hours</th>
                                <td className="px-4 py-2">{museumResponse.data.Opening_Hours}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Standard Ticket Prices</th>
                                <td className="px-4 py-2">{museumResponse.data.S_Tickets_Prices}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Foreign Ticket Prices</th>
                                <td className="px-4 py-2">{museumResponse.data.F_Tickets_Prices}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">National Ticket Prices</th>
                                <td className="px-4 py-2">{museumResponse.data.N_Tickets_Prices}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Tag</th>
                                <td className="px-4 py-2">{museumResponse.data.Tag}</td>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Created By</th>
                                <td className="px-4 py-2">{museumResponse.data.Created_By}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Historical Place Response */}
            {placeResponse && placeResponse.data && (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Historical Place Response</h3>
                    <table className="table-auto w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Name</th>
                                <td className="px-4 py-2">{placeResponse.data.Name}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Description</th>
                                <td className="px-4 py-2">{placeResponse.data.Description}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Pictures</th>
                                <td className="px-4 py-2">{placeResponse.data.Pictures}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Location</th>
                                <td className="px-4 py-2">{placeResponse.data.Location}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Country</th>
                                <td className="px-4 py-2">{placeResponse.data.Country}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Opens At</th>
                                <td className="px-4 py-2">{placeResponse.data.Opens_At}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Closes At</th>
                                <td className="px-4 py-2">{placeResponse.data.Closes_At}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Standard Ticket Prices</th>
                                <td className="px-4 py-2">{placeResponse.data.S_Ticket_Prices}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">Foreign Ticket Prices</th>
                                <td className="px-4 py-2">{placeResponse.data.F_Ticket_Prices}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left font-medium">National Ticket Prices</th>
                                <td className="px-4 py-2">{placeResponse.data.N_Ticket_Prices}</td>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Created By</th>
                                <td className="px-4 py-2">{placeResponse.data.Created_By}</td>
                            </tr>
                        </tbody>
                    </table>
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

export default TourisimGovernerHome