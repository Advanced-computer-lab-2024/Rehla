// src/components/UpcomingEvents.js
import React, { useEffect, useState } from 'react';
import { getAllUpcomingEventsAndPlaces, sortActivities, sortItineraries, filterActivities, filterItineraries ,filterPlacesAndMuseums } from '../services/api';

const UpcomingEvents = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [sortedActivities, setSortedActivities] = useState(null);
    const [sortedItineraries, setSortedItineraries] = useState(null);
    const [filteredActivities, setFilteredActivities] = useState(null);
    const [filteredItineraries, setFilteredItineraries] = useState(null);
    const [filteredPlacesAndMuseums, setFilteredPlacesAndMuseums] = useState(null);

    // States for filters
    const [activityFilters, setActivityFilters] = useState({
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
        rating: '',
        category: ''
    });
    const [itineraryFilters, setItineraryFilters] = useState({
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
        preferences: '',
        language: ''
    });
    const [placesAndMuseumsFilters, setPlacesAndMuseumsFilters] = useState({
        category: '',
        value: ''
    });



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

    const handleSortActivities = async (sortBy) => {
        try {
            const sorted = await sortActivities(sortBy);
            setSortedActivities(sorted); // Update sorted activities
        } catch (error) {
            setError(error);
        }
    };

    const handleSortItineraries = async (sortBy) => {
        try {
            const sorted = await sortItineraries(sortBy);
            setSortedItineraries(sorted); // Update sorted itineraries
        } catch (error) {
            setError(error);
        }
    };

    const handleFilterActivities = async (e) => {
        e.preventDefault();
        try {
            const filtered = await filterActivities(activityFilters);
            setFilteredActivities(filtered.activities);
        } catch (error) {
            setError(error);
        }
    };

    const handleFilterItineraries = async (e) => {
        e.preventDefault();
        try {
            const filtered = await filterItineraries(itineraryFilters);
            setFilteredItineraries(filtered);
        } catch (error) {
            setError(error);
        }
    };




    const handleFilterPlacesAndMuseums = async (e) => {
        e.preventDefault();
        try {
            const filtered = await filterPlacesAndMuseums(placesAndMuseumsFilters);
            setFilteredPlacesAndMuseums(filtered);
        } catch (error) {
            setError(error);
        }
    };
    const handleFilterChange = (e, setFilters) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Upcoming Events and Places</h1>

            {/* Itinerary Sorting */}
            <h2>Upcoming Itineraries</h2>
            <div>
                <button onClick={() => handleSortItineraries('price')}>Sort by Price</button>
                <button onClick={() => handleSortItineraries('rating')}>Sort by Rating</button>
            </div>
            {sortedItineraries ? (
                <ul>
                    {sortedItineraries.map((itinerary) => (
                        <li key={itinerary._id}>{itinerary.Itinerary_Name} - ${itinerary.Tour_Price} - Rating: {itinerary.Rating}</li>
                    ))}
                </ul>
            ) : data.upcomingItineraries !== 'No upcoming itineraries found' ? (
                <ul>
                    {data.upcomingItineraries.map((itinerary) => (
                        <li key={itinerary._id}>{itinerary.Itinerary_Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming itineraries</p>
            )}

            {/* Activity Sorting */}
            <h2>Upcoming Activities</h2>
            <div>
                <button onClick={() => handleSortActivities('price')}>Sort by Price</button>
                <button onClick={() => handleSortActivities('rating')}>Sort by Rating</button>
            </div>
            {sortedActivities ? (
                <ul>
                    {sortedActivities.map((activity) => (
                        <li key={activity._id}>{activity.Name} - ${activity.Price} - Rating: {activity.Rating}</li>
                    ))}
                </ul>
            ) : data.upcomingActivities !== 'No upcoming activities found' ? (
                <ul>
                    {data.upcomingActivities.map((activity) => (
                        <li key={activity._id}>{activity.Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming activities</p>
            )}

            {/* Filter Form for Activities */}
            <h2>Filter Activities</h2>
            <form onSubmit={handleFilterActivities}>
                <label>
                    Min Price:
                    <input
                        type="number"
                        name="minPrice"
                        value={activityFilters.minPrice}
                        onChange={(e) => handleFilterChange(e, setActivityFilters)}
                    />
                </label>
                <label>
                    Max Price:
                    <input
                        type="number"
                        name="maxPrice"
                        value={activityFilters.maxPrice}
                        onChange={(e) => handleFilterChange(e, setActivityFilters)}
                    />
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        name="startDate"
                        value={activityFilters.startDate}
                        onChange={(e) => handleFilterChange(e, setActivityFilters)}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        name="endDate"
                        value={activityFilters.endDate}
                        onChange={(e) => handleFilterChange(e, setActivityFilters)}
                    />
                </label>
                <label>
                    Rating:
                    <input
                        type="number"
                        name="rating"
                        value={activityFilters.rating}
                        onChange={(e) => handleFilterChange(e, setActivityFilters)}
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={activityFilters.category}
                        onChange={(e) => handleFilterChange(e, setActivityFilters)}
                    />
                </label>
                <button type="submit">Apply Activity Filters</button>
            </form>

            {/* Filter Form for Itineraries */}
            <h2>Filter Itineraries</h2>
            <form onSubmit={handleFilterItineraries}>
                <label>
                    Min Price:
                    <input
                        type="number"
                        name="minPrice"
                        value={itineraryFilters.minPrice}
                        onChange={(e) => handleFilterChange(e, setItineraryFilters)}
                    />
                </label>
                <label>
                    Max Price:
                    <input
                        type="number"
                        name="maxPrice"
                        value={itineraryFilters.maxPrice}
                        onChange={(e) => handleFilterChange(e, setItineraryFilters)}
                    />
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        name="startDate"
                        value={itineraryFilters.startDate}
                        onChange={(e) => handleFilterChange(e, setItineraryFilters)}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        name="endDate"
                        value={itineraryFilters.endDate}
                        onChange={(e) => handleFilterChange(e, setItineraryFilters)}
                    />
                </label>
                <label>
                    Preferences (comma-separated):
                    <input
                        type="text"
                        name="preferences"
                        value={itineraryFilters.preferences}
                        onChange={(e) => handleFilterChange(e, setItineraryFilters)}
                    />
                </label>
                <label>
                    Language:
                    <input
                        type="text"
                        name="language"
                        value={itineraryFilters.language}
                        onChange={(e) => handleFilterChange(e, setItineraryFilters)}
                    />
                </label>
                <button type="submit">Apply Itinerary Filters</button>
            </form>

            {/* Display Filtered Activities */}
            <h2>Filtered Activities</h2>
            {filteredActivities ? (
                <ul>
                    {filteredActivities.map((activity) => (
                        <li key={activity._id}>
                            {activity.Name} - ${activity.Price} - Rating: {activity.Rating}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No filtered activities available</p>
            )}

            {/* Display Filtered Itineraries */}
            <h2>Filtered Itineraries</h2>
            {filteredItineraries ? (
                <ul>
                    {filteredItineraries.map((itinerary) => (
                        <li key={itinerary._id}>
                            {itinerary.Itinerary_Name} - ${itinerary.Tour_Price} - Language: {itinerary.Language}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No filtered itineraries available</p>
            )}

            {/* Museums */}

            <h2>Filter Places and Museums</h2>
            <form onSubmit={handleFilterPlacesAndMuseums}>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={placesAndMuseumsFilters.category}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                    />
                </label>
                <label>
                    Value:
                    <input
                        type="text"
                        name="value"
                        value={placesAndMuseumsFilters.value}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                    />
                </label>
                <button type="submit">Apply Places and Museums Filters</button>
            </form>

            {/* Display Filtered Places and Museums */}
            <h2>Filtered Places and Museums</h2>
            {filteredPlacesAndMuseums ? (
                <ul>
                    {filteredPlacesAndMuseums.map((place) => (
                        <li key={place._id}>
                            {place.Name} 
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No filtered places or museums available</p>
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

            {/* Historical Places */}
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
