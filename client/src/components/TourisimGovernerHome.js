// TourisimGovernerHome.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logo.png';
import {
    createMuseum,
    readMuseum,
    createHistoricalPlace,
    readHistoricalPlace,
    updateMuseum,
    updateHistoricalPlace,
    deleteMuseum,
    deleteHistoricalPlace
} from '../services/api'; // Adjust the import path based on your project structure

const TourisimGovernerHome = () => {
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
    const [museumUpdateData, setMuseumUpdateData] = useState({ ...museumData });

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

    // Update Museum
    const handleUpdateMuseum = async (e) => {
        e.preventDefault();
        try {
            const response = await updateMuseum(museumUpdateData);
            setMuseumResponse(response.data);
        } catch (error) {
            console.error(error);
            setMuseumResponse({ error: error.message });
        }
    };

    // Update Historical Place
    const handleUpdateHistoricalPlace = async (e) => {
        e.preventDefault();
        try {
            const response = await updateHistoricalPlace(placeUpdateData);
            setPlaceResponse(response.data);
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
            <div className="NavBar">
                <img src={logo} alt="" />
                <nav className="main-nav">
                    <ul className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/CreateTag">Create Tag</Link>
                        <Link to="/MyPlaces" style={{ textDecoration: 'none', color: 'aliceblue' }}>My Places</Link>
                    </ul>
                </nav>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <h1 className="text-3xl font-bold mb-8 text-center">Tourism Governor Home</h1>

            {/* Museum Form */}
            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Create Museum</h2>
                <form onSubmit={handleCreateMuseum} className="space-y-4">
                    {Object.keys(museumData).map((key) => (
                        <input
                            key={key}
                            placeholder={key.replace(/_/g, ' ')}
                            value={museumData[key]}
                            onChange={(e) => setMuseumData({ ...museumData, [key]: e.target.value })}
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
            </section>

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

            <section className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Update Museum</h2>
                <form onSubmit={handleUpdateMuseum} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Museum Name to Update"
                        value={museumUpdateData.Name}
                        onChange={(e) => setMuseumUpdateData({ ...museumUpdateData, Name: e.target.value })}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {Object.keys(museumUpdateData).map((key) => (
                        <input
                            key={key}
                            placeholder={key.replace(/_/g, ' ')}
                            value={museumUpdateData[key]}
                            onChange={(e) => setMuseumUpdateData({ ...museumUpdateData, [key]: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition duration-200"
                    >
                        Update Museum
                    </button>
                </form>
            </section>

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

        </div>
    );
};

export default TourisimGovernerHome
