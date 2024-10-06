import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createItinerary, getItineraryByName } from '../services/api'; // Importing API functions
import logo from '../images/logo.png';

const TourGuideHome = () => {
    const [itineraryData, setItineraryData] = useState({
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
        Email: ''
    });

    const [searchItineraryName, setSearchItineraryName] = useState('');
    const [retrievedItinerary, setRetrievedItinerary] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItineraryData({
            ...itineraryData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const response = await createItinerary(itineraryData);
            setSuccess('Itinerary created successfully!');
            setItineraryData({
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
                Email: ''
            });
        } catch (error) {
            setError('Error creating itinerary. Please try again.');
        }
    };

    const handleRetrieveItinerary = async () => {
        setError(null);
        setRetrievedItinerary(null);
        console.log(`Retrieving itinerary for: ${searchItineraryName}`); // Log the search term
        try {
            const response = await getItineraryByName(searchItineraryName);
            console.log('Response:', response); // Log the response
            if (response.itinerary) {
                setRetrievedItinerary(response.itinerary);
            } else {
                setError('No itinerary found with that name.');
            }
        } catch (error) {
            console.error('Error fetching itinerary:', error); // Log the error
            setError('Error retrieving itinerary. Please try again.');
        }
    };

    return (
        <div>
            {/* NavBar */}
            <div className="NavBar">
                <img src={logo} alt="" />
                <nav className="main-nav">
                    <ul className="nav-links">
                        <Link to="/" style={{ textDecoration: 'none', color: 'aliceblue' }}>Home</Link>
                        <Link to="/TourGuideItineraries" style={{ textDecoration: 'none', color: 'aliceblue' }}>My Created Itineraries</Link>
                    </ul>
                </nav>
                <nav className="signing">
                    <Link to="/MyProfile" style={{ textDecoration: 'none', color: 'aliceblue' }}>MyProfile</Link>
                </nav>
            </div>

            {/* Main Container */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '80px 20px 0 20px',
            }}>
                {/* Create Itinerary Form */}
                <div style={{
                    padding: '10px', // Reduced padding for smaller height
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '35%',
                }}>
                    <h2 style={{ textAlign: 'center' }}>Create New Itinerary</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Input fields for itinerary data */}
                        <label>Itinerary Name:</label>
                        <input
                            type="text"
                            name="Itinerary_Name"
                            value={itineraryData.Itinerary_Name}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Timeline:</label>
                        <input
                            type="text"
                            name="Timeline"
                            value={itineraryData.Timeline}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="Duration"
                            value={itineraryData.Duration}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Language:</label>
                        <input
                            type="text"
                            name="Language"
                            value={itineraryData.Language}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Tour Price:</label>
                        <input
                            type="number"
                            name="Tour_Price"
                            value={itineraryData.Tour_Price}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Available Date & Time:</label>
                        <input
                            type="datetime-local"
                            name="Available_Date_Time"
                            value={itineraryData.Available_Date_Time}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Accessibility:</label>
                        <input
                            type="text"
                            name="Accessibility"
                            value={itineraryData.Accessibility}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Pick-Up Point:</label>
                        <input
                            type="text"
                            name="Pick_Up_Point"
                            value={itineraryData.Pick_Up_Point}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Drop-Off Point:</label>
                        <input
                            type="text"
                            name="Drop_Of_Point"
                            value={itineraryData.Drop_Of_Point}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Booked:</label>
                        <input
                            type="number"
                            name="Booked"
                            value={itineraryData.Booked}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Empty Spots:</label>
                        <input
                            type="number"
                            name="Empty_Spots"
                            value={itineraryData.Empty_Spots}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Country:</label>
                        <input
                            type="text"
                            name="Country"
                            value={itineraryData.Country}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Rating:</label>
                        <input
                            type="text"
                            name="Rating"
                            value={itineraryData.Rating}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>P_Tag:</label>
                        <input
                            type="text"
                            name="P_Tag"
                            value={itineraryData.P_Tag}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            name="Email"
                            value={itineraryData.Email}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Create Itinerary
                        </button>
                    </form>
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                {/* Search Itinerary Form */}
                <div style={{
                    padding: '10px', // Reduced padding for smaller height
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '35%',
                    height : '10%',
                }}>
                    <h2 style={{ textAlign: 'center' }}>Search Itinerary</h2>
                    <input
                        type="text"
                        value={searchItineraryName}
                        onChange={(e) => setSearchItineraryName(e.target.value)}
                        placeholder="Enter itinerary name"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button onClick={handleRetrieveItinerary} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Search
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {retrievedItinerary && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>Retrieved Itinerary:</h3>
                            <p><strong>Itinerary Name:</strong> {retrievedItinerary.Itinerary_Name}</p>
                            <p><strong>Timeline:</strong> {retrievedItinerary.Timeline}</p>
                            <p><strong>Duration:</strong> {retrievedItinerary.Duration}</p>
                            <p><strong>Language:</strong> {retrievedItinerary.Language}</p>
                            <p><strong>Tour Price:</strong> {retrievedItinerary.Tour_Price}</p>
                            <p><strong>Available Date & Time:</strong> {retrievedItinerary.Available_Date_Time}</p>
                            <p><strong>Accessibility:</strong> {retrievedItinerary.Accessibility}</p>
                            <p><strong>Pick-Up Point:</strong> {retrievedItinerary.Pick_Up_Point}</p>
                            <p><strong>Drop-Off Point:</strong> {retrievedItinerary.Drop_Of_Point}</p>
                            <p><strong>Booked:</strong> {retrievedItinerary.Booked}</p>
                            <p><strong>Empty Spots:</strong> {retrievedItinerary.Empty_Spots}</p>
                            <p><strong>Country:</strong> {retrievedItinerary.Country}</p>
                            <p><strong>Rating:</strong> {retrievedItinerary.Rating}</p>
                            <p><strong>P_Tag:</strong> {retrievedItinerary.P_Tag}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourGuideHome;
