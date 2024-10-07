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
            <h1>Tourism Governor Home</h1>

            {/* Museum Form */}
            <h2>Create Museum</h2>
            <form onSubmit={handleCreateMuseum}>
                {Object.keys(museumData).map((key) => (
                    <input
                        key={key}
                        placeholder={key.replace(/_/g, ' ')}
                        value={museumData[key]}
                        onChange={(e) => setMuseumData({ ...museumData, [key]: e.target.value })}
                        required
                    />
                ))}
                <button type="submit">Create Museum</button>
            </form>

            <h2>Read Museum</h2>
            <form onSubmit={handleReadMuseum}>
                <input
                    type="text"
                    placeholder="Enter Museum Name"
                    value={museumName}
                    onChange={(e) => setMuseumName(e.target.value)}
                    required
                />
                <button type="submit">Read Museum</button>
            </form>

            <h2>Update Museum</h2>
            <form onSubmit={handleUpdateMuseum}>
                <input
                    type="text"
                    placeholder="Enter Museum Name to Update"
                    value={museumUpdateData.Name}
                    onChange={(e) => setMuseumUpdateData({ ...museumUpdateData, Name: e.target.value })}
                    required
                />
                {Object.keys(museumUpdateData).map((key) => (
                    <input
                        key={key}
                        placeholder={key.replace(/_/g, ' ')}
                        value={museumUpdateData[key]}
                        onChange={(e) => setMuseumUpdateData({ ...museumUpdateData, [key]: e.target.value })}
                        required
                    />
                ))}
                <button type="submit">Update Museum</button>
            </form>

            <h2>Delete Museum</h2>
            <form onSubmit={handleDeleteMuseum}>
                <input
                    type="text"
                    placeholder="Enter Museum Name to Delete"
                    value={deleteMuseumName}
                    onChange={(e) => setDeleteMuseumName(e.target.value)}
                    required
                />
                <button type="submit">Delete Museum</button>
            </form>

            {/* Historical Place Form */}
            <h2>Create Historical Place</h2>
            <form onSubmit={handleCreateHistoricalPlace}>
                {Object.keys(placeData).map((key) => (
                    <input
                        key={key}
                        placeholder={key.replace(/_/g, ' ')}
                        value={placeData[key]}
                        onChange={(e) => setPlaceData({ ...placeData, [key]: e.target.value })}
                        required
                    />
                ))}
                <button type="submit">Create Historical Place</button>
            </form>

            <h2>Read Historical Place</h2>
            <form onSubmit={handleReadHistoricalPlace}>
                <input
                    type="text"
                    placeholder="Enter Historical Place Name"
                    value={historicalPlaceName}
                    onChange={(e) => setHistoricalPlaceName(e.target.value)}
                    required
                />
                <button type="submit">Read Historical Place</button>
            </form>

            <h2>Update Historical Place</h2>
            <form onSubmit={handleUpdateHistoricalPlace}>
                <input
                    type="text"
                    placeholder="Enter Historical Place Name to Update"
                    value={placeUpdateData.Name}
                    onChange={(e) => setPlaceUpdateData({ ...placeUpdateData, Name: e.target.value })}
                    required
                />
                {Object.keys(placeUpdateData).map((key) => (
                    <input
                        key={key}
                        placeholder={key.replace(/_/g, ' ')}
                        value={placeUpdateData[key]}
                        onChange={(e) => setPlaceUpdateData({ ...placeUpdateData, [key]: e.target.value })}
                        required
                    />
                ))}
                <button type="submit">Update Historical Place</button>
            </form>

            <h2>Delete Historical Place</h2>
            <form onSubmit={handleDeleteHistoricalPlace}>
                <input
                    type="text"
                    placeholder="Enter Historical Place Name to Delete"
                    value={deleteHistoricalPlaceName}
                    onChange={(e) => setDeleteHistoricalPlaceName(e.target.value)}
                    required
                />
                <button type="submit">Delete Historical Place</button>
            </form>

            {/* Museum Response */}
            {museumResponse && museumResponse.data && (
                <div>
                    <h3>Museum Response:</h3>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <tbody>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.Name}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.description}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Pictures</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.pictures}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Location</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.location}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Country</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.Country}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Opening Hours</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.Opening_Hours}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Standard Ticket Prices</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.S_Tickets_Prices}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Foreign Ticket Prices</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.F_Tickets_Prices}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>National Ticket Prices</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.N_Tickets_Prices}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Tag</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.Tag}</td>
                            </tr>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Created By</th>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{museumResponse.data.Created_By}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Historical Place Response */}
            {placeResponse && placeResponse.data && (
    <div>
        <h3>Historical Place Response:</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Name}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Description}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Pictures</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Pictures}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Location</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Location}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Country</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Country}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Opens At</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Opens_At}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Closes At</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Closes_At}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Standard Ticket Prices</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.S_Ticket_Prices}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Foreign Ticket Prices</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.F_Ticket_Prices}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>National Ticket Prices</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.N_Ticket_Prices}</td>
                </tr>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Created By</th>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{placeResponse.data.Created_By}</td>
                </tr>
            </tbody>
        </table>
    </div>
)}
        </div>
    );
};

export default TourisimGovernerHome
