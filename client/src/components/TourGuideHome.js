
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
        Booked: false,
        Empty_Spots: '',
        Country: '',
        Rating: '',
        P_Tag: ''
    });
    
    const [searchData, setSearchData] = useState({
        itineraryName: '',
        retrievedItinerary: null, // To hold the retrieved itinerary data
        searchError: null // To hold search error message
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItineraryData({
            ...itineraryData,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        setSearchData({
            ...searchData,
            itineraryName: e.target.value,
            searchError: null // Reset the search error on input change
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
                Booked: false,
                Empty_Spots: '',
                Country: '',
                Rating: '',
                P_Tag: ''
            });
        } catch (error) {
            setError('Error creating itinerary. Please try again.');
        }
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSearchData((prev) => ({
            ...prev,
            retrievedItinerary: null,
            searchError: null // Reset search error message
        }));
    
        try {
            // Ensure you're passing the correct itinerary name
            const response = await getItineraryByName(searchData.itineraryName);
            
            // Check if the response has the itinerary or if there was an error
            if (response && response.itinerary) { // Adjust based on your API response structure
                setSearchData((prev) => ({
                    ...prev,
                    retrievedItinerary: response.itinerary // Assuming response contains the itinerary
                }));
            } else {
                setSearchData((prev) => ({
                    ...prev,
                    searchError: response ? response.message || 'No itinerary found with that name.' : 'Error retrieving itinerary. Please try again.'
                }));
            }
        } catch (error) {
            console.error('Error retrieving itinerary:', error);
            setSearchData((prev) => ({
                ...prev,
                searchError: 'Error retrieving itinerary. Please try again.'
            }));
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

            {/* Container for both forms */}
            <div style={{
                display: 'flex', // Use flexbox for layout
                justifyContent: 'space-around', // Space out forms evenly
                margin: '80px 0 0 20px', // Spacing from top and left
            }}>
                {/* Create Itinerary Form */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '35%', // Adjust width to make form smaller
                }}>
                    <h2 style={{ textAlign: 'center' }}>Create New Itinerary</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Itinerary Name:</label>
                        <input 
                            type="text" 
                            name="Itinerary_Name" 
                            value={itineraryData.Itinerary_Name} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />
                        
                        <label>Timeline:</label>
                        <input 
                            type="text" 
                            name="Timeline" 
                            value={itineraryData.Timeline} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Duration:</label>
                        <input 
                            type="text" 
                            name="Duration" 
                            value={itineraryData.Duration} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Language:</label>
                        <input 
                            type="text" 
                            name="Language" 
                            value={itineraryData.Language} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Tour Price:</label>
                        <input 
                            type="number" 
                            name="Tour_Price" 
                            value={itineraryData.Tour_Price} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Available Date & Time:</label>
                        <input 
                            type="datetime-local" 
                            name="Available_Date_Time" 
                            value={itineraryData.Available_Date_Time} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Accessibility:</label>
                        <input 
                            type="text" 
                            name="Accessibility" 
                            value={itineraryData.Accessibility} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Pick-Up Point:</label>
                        <input 
                            type="text" 
                            name="Pick_Up_Point" 
                            value={itineraryData.Pick_Up_Point} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Drop-Off Point:</label>
                        <input 
                            type="text" 
                            name="Drop_Of_Point" 
                            value={itineraryData.Drop_Of_Point} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />
                         <label>Booked:</label>
                        <input 
                            type="number" 
                            name="Booked" 
                            value={itineraryData.Booked} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />
                        <label>Empty Spots:</label>
                        <input 
                            type="number" 
                            name="Empty_Spots" 
                            value={itineraryData.Empty_Spots} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Country:</label>
                        <input 
                            type="text" 
                            name="Country" 
                            value={itineraryData.Country} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Rating:</label>
                        <input 
                            type="number" 
                            name="Rating" 
                            value={itineraryData.Rating} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <label>Tags:</label>
                        <input 
                            type="text" 
                            name="P_Tag" 
                            value={itineraryData.P_Tag} 
                            onChange={handleInputChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />

                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Itinerary</button>
                    </form>

                    {/* Show success or error message */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                </div>

                {/* Search Itinerary by Name */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '35%', // Adjust width to make form smaller
                }}>
                    <h2 style={{ textAlign: 'center' }}>Search Itinerary</h2>
                    <form onSubmit={handleSearchSubmit}>
                        <label>Itinerary Name:</label>
                        <input 
                            type="text" 
                            value={searchData.itineraryName} 
                            onChange={handleSearchChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
                        />
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Search Itinerary</button>
                    </form>

                    {/* Display search error message */}
                    {searchData.searchError && <p style={{ color: 'red' }}>{searchData.searchError}</p>}

                    {/* Display retrieved itinerary data */}
                    {searchData.retrievedItinerary && renderRetrievedItinerary(searchData.retrievedItinerary)}
                </div>
            </div>
        </div>
    );
};

// Function to display retrieved itinerary details
const renderRetrievedItinerary = (itinerary) => (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>Retrieved Itinerary</h3>
        {Object.entries(itinerary).map(([key, value]) => (
            <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>
        ))}
    </div>
);

export default TourGuideHome