import React, { useState } from 'react';
import { viewMyCreatedItineraries } from '../services/api';

const TourGuideItineraries = () => {
    const [createdItineraries, setCreatedItineraries] = useState([]);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchCreatedItineraries = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when fetching
        setError(null); // Clear previous errors
        try {
            const result = await viewMyCreatedItineraries(email); // Pass email to the API
            setCreatedItineraries(result.itineraries || []); // Set the itineraries received from the API
        } catch (error) {
            setError(error.message || 'Error fetching itineraries');
            setCreatedItineraries([]); // Clear itineraries on error
        } finally {
            setLoading(false); // Stop loading once fetch is done
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value); // Update email state from input
    };

    return (
        <div>
            <h1>View My Created Activities and Itineraries</h1>

            {/* Email input form */}
            <form onSubmit={(e) => { handleFetchCreatedItineraries(e); }}>
                <label>
                    Enter your Email:
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        style={{ marginRight: '8px', padding: '8px' }} // Adding some styling
                    />
                </label>
                <button type="submit" style={{ padding: '8px 16px' }}>View My Created Itineraries</button>
            </form>

            {/* Show loading state */}
            {loading && <p>Loading...</p>}

            {/* Show error message if there's an error */}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}


            {/* Display Created Itineraries */}
            <h3>My Created Itineraries</h3>
            {createdItineraries.length > 0 ? (
                <ul>
                    {createdItineraries.map((itinerary) => (
                        <li key={itinerary._id}>
                            Itinerary Name: {itinerary.Itenerary_Name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No itineraries found for this email.</p>
            )}
        </div>
    );
};

export default TourGuideItineraries;
