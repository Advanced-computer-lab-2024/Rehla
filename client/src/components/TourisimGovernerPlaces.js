import React, { useState, useEffect } from 'react';
import { getAllCreatedByEmail } from '../services/api'; // Adjust the path as necessary

const TourisimGovernerPlaces = () => {
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">My Created Activities</h1>

            {loading && <div className="text-center text-gray-500">Loading...</div>}
            {error && <div className="text-center text-red-600">Error: {error.message}</div>}

            {!loading && !error && (
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activities</h2>
                        <ul className="space-y-2 bg-white rounded-lg shadow-lg p-4">
                            {data.activities.map((activity) => (
                                <li key={activity._id} className="p-2 bg-blue-50 rounded-md shadow-sm">{activity.Name}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historical Places</h2>
                        <ul className="space-y-2 bg-white rounded-lg shadow-lg p-4">
                            {data.historicalPlaces.map((place) => (
                                <li key={place._id} className="p-2 bg-blue-50 rounded-md shadow-sm">{place.Name}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Museums</h2>
                        <ul className="space-y-2 bg-white rounded-lg shadow-lg p-4">
                            {data.museums.map((museum) => (
                                <li key={museum._id} className="p-2 bg-blue-50 rounded-md shadow-sm">{museum.Name}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Itineraries</h2>
                        <ul className="space-y-2 bg-white rounded-lg shadow-lg p-4">
                            {data.itineraries.map((itinerary) => (
                                <li key={itinerary._id} className="p-2 bg-blue-50 rounded-md shadow-sm">{itinerary.Itinerary_Name}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}
        </div>
    );
};

export default TourisimGovernerPlaces;
