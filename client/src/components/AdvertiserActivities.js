import React, { useState } from 'react';
import { viewMyCreatedActivities } from '../services/api';

const AdvertiserActivities = () => {
    const [createdActivities, setCreatedActivities] = useState([]); // Initialize as an empty array
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchCreatedActivities = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when fetching
        setError(null); // Clear previous errors
        try {
            const result = await viewMyCreatedActivities(email); // Pass email to the API
            setCreatedActivities(result.activities || []); // Set the activities received from the API
        } catch (error) {
            setError(error.message || 'Error fetching activities');
            setCreatedActivities([]); // Clear activities on error
        } finally {
            setLoading(false); // Stop loading once fetch is done
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value); // Update email state from input
    };

    return (
        <div>
            <h1>View My Created Activities</h1>

            {/* Email input form */}
            <form onSubmit={handleFetchCreatedActivities}>
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
                <button type="submit" style={{ padding: '8px 16px' }}>View My Created Activities</button>
            </form>

            {/* Show loading state */}
            {loading && <p>Loading...</p>}

            {/* Show error message if there's an error */}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {/* Display Created Activities */}
            <h3>My Created Activities</h3>
            {createdActivities.length > 0 ? (
                <ul>
                    {createdActivities.map((activity) => (
                        <li key={activity._id}>
                           Activity Name: {activity.Activity_Name} 
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No activities found for this email.</p>
            )}
        </div>
    );
};

export default AdvertiserActivities;
