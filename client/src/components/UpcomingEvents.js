// src/components/UpcomingEvents.js
import React, { useEffect, useState } from 'react';
import { getAllUpcomingEventsAndPlaces } from '../services/api';

const UpcomingEvents = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllUpcomingEventsAndPlaces();
                setData(result);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Upcoming Events and Places</h1>

            <h2>Upcoming Itineraries</h2>
            {data.upcomingItineraries !== 'No upcoming itineraries found' ? (
                <ul>
                    {data.upcomingItineraries.map((itinerary) => (
                        <li key={itinerary._id}>{itinerary.Itinerary_Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming itineraries</p>
            )}

            <h2>Upcoming Activities</h2>
            {data.upcomingActivities !== 'No upcoming activities found' ? (
                <ul>
                    {data.upcomingActivities.map((activity) => (
                        <li key={activity._id}>{activity.Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming activities</p>
            )}

            <h2>Museums</h2>
            {data.museums !== 'No museums found' ? (
                <ul>
                    {data.museums.map((museum) => (
                        <li key={museum._id}>{museum.Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No museums</p>
            )}

            <h2>Historical Places</h2>
            {data.historicalPlaces !== 'No historical places found' ? (
                <ul>
                    {data.historicalPlaces.map((place) => (
                        <li key={place._id}>{place.Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No historical places</p>
            )}
        </div>
    );
};

export default UpcomingEvents;
