import React, { useState, useEffect } from 'react';
import { getAllCreatedByEmail } from '../services/api'; // Adjust the path as necessary

const AdvertiserActivities = () => {
    const [data, setData] = useState({
        activities: [],
        historicalPlaces: [],
        museums: [],
        itineraries: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem('email'); // Get email from local storage
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
            const result = await getAllCreatedByEmail(email); // Fetch data based on email
            setData(result.data); // Update state with fetched data
        } catch (err) {
            setError(err); // Set error state if there's an issue
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <h1>My Created Activities</h1>

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}

            {!loading && !error && (
                <>
                    <h2>Activities</h2>
                    <ul>
                        {data.activities.map((activity) => (
                            <li key={activity._id}>{activity.Name}</li>
                        ))}
                    </ul>

                    <h2>Historical Places</h2>
                    <ul>
                        {data.historicalPlaces.map((place) => (
                            <li key={place._id}>{place.Name}</li>
                        ))}
                    </ul>

                    <h2>Museums</h2>
                    <ul>
                        {data.museums.map((museum) => (
                            <li key={museum._id}>{museum.Name}</li>
                        ))}
                    </ul>

                    <h2>Itineraries</h2>
                    <ul>
                        {data.itineraries.map((itinerary) => (
                            <li key={itinerary._id}>{itinerary.Itinerary_Name}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AdvertiserActivities;
