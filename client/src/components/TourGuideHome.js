import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createItinerary, getItineraryByName, updateItinerary ,deleteItinerary} from '../services/api'; // Importing API functions
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
        Created_By: ''
    });

    const [searchItineraryName, setSearchItineraryName] = useState('');
    const [retrievedItinerary, setRetrievedItinerary] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [itineraryName, setItineraryName] = useState(''); // To find the itinerary
    const [timeline, setTimeline] = useState('');
    const [duration, setDuration] = useState('');
    const [language, setLanguage] = useState('');
    const [tourPrice, setTourPrice] = useState('');
    const [availableDateTime, setAvailableDateTime] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [pickUpPoint, setPickUpPoint] = useState('');
    const [dropOfPoint, setDropOfPoint] = useState('');
    const [booked, setBooked] = useState(false);
    const [emptySpots, setEmptySpots] = useState('');
    const [country, setCountry] = useState('');
    const [rating, setRating] = useState('');
    const [pTag, setPTag] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');


    const [itinerarydeleteName, setItinerarydeleteName] = useState('');
    const [deletemessage, setdeleteMessage] = useState('');

    const handledeleteInputChange = (e) => {
        setItinerarydeleteName(e.target.value); // Update state with input value
    };

    const handledeleteSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setdeleteMessage(''); // Reset message before deletion attempt

        try {
            const response = await deleteItinerary(itinerarydeleteName); // Call the delete function
            setdeleteMessage(`Success: ${response.message}`); // Display success message
            setItinerarydeleteName(''); // Clear input field
        } catch (error) {
            setdeleteMessage(`Error: ${error.message || 'Failed to delete itinerary.'}`); // Display error message
        }
    };

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
            await createItinerary(itineraryData);
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
                Created_By: ''
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

    const handleUpdateItinerary = async (e) => {
        e.preventDefault();
        setUpdateMessage('');
    
        const itineraryData = {
            Itinerary_Name: itineraryName,
            Timeline: timeline,
            Duration: duration,
            Language: language,
            Tour_Price: tourPrice,
            Available_Date_Time: availableDateTime,
            Accessibility: accessibility,
            Pick_Up_Point: pickUpPoint,
            Drop_Of_Point: dropOfPoint,
            Booked: booked, // This should be a number
            Empty_Spots: emptySpots, // Ensure this is also a number
            Country: country,
            Rating: rating, // This should be a number too
            P_Tag: pTag,
            Created_By: createdBy
        };
    
        console.log('Updating itinerary with data:', itineraryData); // Log the data
    
        try {
            const response = await updateItinerary(itineraryData);
            if (response.success) {
                setUpdateMessage('Itinerary updated successfully!');
            } else {
                setUpdateMessage('Error updating itinerary: ' + response.message);
            }
        } catch (error) {
            console.error('Error updating itinerary:', error);
            setUpdateMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
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
                    <Link to="/TourGuideHome/TourGuideProfile" style={{ textDecoration: 'none', color: 'aliceblue' }}>MyProfile</Link>
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
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '20%',
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
                            type="number"
                            name="Rating"
                            value={itineraryData.Rating}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>P Tag:</label>
                        <input
                            type="text"
                            name="P_Tag"
                            value={itineraryData.P_Tag}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Created_By:</label>
                        <input
                            type="email"
                            name="Created_By"
                            value={itineraryData.Created_By}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Create Itinerary</button>
                    </form>
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                {/* Search Itinerary Form */}
                <div style={{
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '20%',
                   height :'10%',
                }}>
                    <h2 style={{ textAlign: 'center' }}>Search Itinerary</h2>
                    <input
                        type="text"
                        value={searchItineraryName}
                        onChange={(e) => setSearchItineraryName(e.target.value)}
                        placeholder="Enter itinerary name"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button onClick={handleRetrieveItinerary} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Search</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {retrievedItinerary && (
                        <div>
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

                <div style={{
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '20%',
                   height :'10%',
                }}>
            <h2>Delete Itinerary</h2>
            <form onSubmit={handledeleteSubmit}>
                <input 
                    type="text" 
                    value={itinerarydeleteName} 
                    onChange={handledeleteInputChange} 
                    placeholder="Enter Itinerary Name" 
                    required 
                    style={{ width: '90%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Delete Itinerary</button>
            </form>
            {deletemessage && <p>{deletemessage}</p>} {/* Display success/error message */}
        </div>

                {/* Update Itinerary Form */}
                <div style={{
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '25%',
                }}>
                    <h2 style={{ textAlign: 'center' }}>Update Itinerary</h2>
                    <form onSubmit={handleUpdateItinerary}>
                        <label>Itinerary Name (Required):</label>
                        <input
                            type="text"
                            value={itineraryName}
                            onChange={(e) => setItineraryName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Timeline:</label>
                        <input
                            type="text"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Language:</label>
                        <input
                            type="text"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Tour Price:</label>
                        <input
                            type="number"
                            value={tourPrice}
                            onChange={(e) => setTourPrice(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Available Date & Time:</label>
                        <input
                            type="datetime-local"
                            value={availableDateTime}
                            onChange={(e) => setAvailableDateTime(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Accessibility:</label>
                        <input
                            type="text"
                            value={accessibility}
                            onChange={(e) => setAccessibility(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Pick-Up Point:</label>
                        <input
                            type="text"
                            value={pickUpPoint}
                            onChange={(e) => setPickUpPoint(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Drop-Off Point:</label>
                        <input
                            type="text"
                            value={dropOfPoint}
                            onChange={(e) => setDropOfPoint(e.target.value)}
                            
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Booked:</label>
                        <input
                            type="number"
                            value={booked}
                            onChange={(e) => setBooked(Number(e.target.value))} // Convert string to number
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Empty Spots:</label>
                        <input
                            type="number"
                            value={emptySpots}
                            onChange={(e) => setEmptySpots(e.target.value)}
                            
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Country:</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Rating:</label>
                        <input
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>P Tag:</label>
                        <input
                            type="text"
                            value={pTag}
                            onChange={(e) => setPTag(e.target.value)}
                         
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <label>Created_By:</label>
                        <input
                            type="text"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                         
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Update Itinerary</button>
                    </form>
                    {updateMessage && <p style={{ color: 'green' }}>{updateMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default TourGuideHome;