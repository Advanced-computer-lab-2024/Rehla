// src/components/UpcomingEvents.js
import React, { useEffect, useState } from 'react';
import { getAllUpcomingEventsAndPlaces, sortActivities, sortItineraries, filterActivities, filterItineraries, filterPlacesAndMuseums } from '../services/api';

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
            setSortedActivities(sorted);
        } catch (error) {
            setError(error);
        }
    };

    const handleSortItineraries = async (sortBy) => {
        try {
            const sorted = await sortItineraries(sortBy);
            setSortedItineraries(sorted);
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
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    if (error) {
        return <div className="text-red-500 text-center">Error: {error.message}</div>;
    }

    if (!data) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events and Places</h1>

            {/* Itinerary Sorting */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Itineraries</h2>
                <div className="mb-4 space-x-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleSortItineraries('price')}>Sort by Price</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleSortItineraries('rating')}>Sort by Rating</button>
                </div>
                <ul className="space-y-2">
                    {(sortedItineraries || data.upcomingItineraries).map((itinerary) => (
                        <li key={itinerary._id} className="bg-gray-100 p-4 rounded shadow">
                            {itinerary.Itinerary_Name} - <span className="font-semibold">${itinerary.Tour_Price}</span> - Rating: {itinerary.Rating}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Activity Sorting */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Activities</h2>
                <div className="mb-4 space-x-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleSortActivities('price')}>Sort by Price</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleSortActivities('rating')}>Sort by Rating</button>
                </div>
                <ul className="space-y-2">
                    {(sortedActivities || data.upcomingActivities).map((activity) => (
                        <li key={activity._id} className="bg-gray-100 p-4 rounded shadow">
                            {activity.Name} - <span className="font-semibold">${activity.Price}</span> - Rating: {activity.Rating}-<img 
                                        src={activity.Picture} 
                                        alt={activity.Name} 
                                        style={{ width: '200px', height: '200px', objectFit: 'cover' }} 
                                    />
                        </li>
                    ))}
                </ul>
            </section>

            {/* Filter Form for Activities */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Filter Activities</h2>
                <form className="space-y-4" onSubmit={handleFilterActivities}>
                    {/* Activity Filter Form */}
                    <div className="flex flex-wrap -mx-2">
                        {/* Price Filter */}
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Min Price</label>
                            <input type="number" name="minPrice" value={activityFilters.minPrice} onChange={(e) => handleFilterChange(e, setActivityFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Max Price</label>
                            <input type="number" name="maxPrice" value={activityFilters.maxPrice} onChange={(e) => handleFilterChange(e, setActivityFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Start Date</label>
                            <input type="date" name="startDate" value={activityFilters.startDate} onChange={(e) => handleFilterChange(e, setActivityFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">End Date</label>
                            <input type="date" name="endDate" value={activityFilters.endDate} onChange={(e) => handleFilterChange(e, setActivityFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Rating and Category Filter */}
                    <div>
                        <label className="block text-sm font-medium">Rating</label>
                        <input type="number" name="rating" value={activityFilters.rating} onChange={(e) => handleFilterChange(e, setActivityFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <input type="text" name="category" value={activityFilters.category} onChange={(e) => handleFilterChange(e, setActivityFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <button type="submit" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Apply Activity Filters</button>
                </form>
            </section>

            {/* Filtered Activities */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Filtered Activities</h2>
                {filteredActivities ? (
                    <ul className="space-y-2">
                        {filteredActivities.map((activity) => (
                            <li key={activity._id} className="bg-gray-100 p-4 rounded shadow">
                                {activity.Name} - <span className="font-semibold">${activity.Price}</span> - Rating: {activity.Rating}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No activities match the filters.</p>
                )}
            </section>

            {/* Filter Form for Itineraries */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Filter Itineraries</h2>
                <form className="space-y-4" onSubmit={handleFilterItineraries}>
                    {/* Itinerary Filter Form */}
                    <div className="flex flex-wrap -mx-2">
                        {/* Price Filter */}
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Min Price</label>
                            <input type="number" name="minPrice" value={itineraryFilters.minPrice} onChange={(e) => handleFilterChange(e, setItineraryFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Max Price</label>
                            <input type="number" name="maxPrice" value={itineraryFilters.maxPrice} onChange={(e) => handleFilterChange(e, setItineraryFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Start Date</label>
                            <input type="date" name="startDate" value={itineraryFilters.startDate} onChange={(e) => handleFilterChange(e, setItineraryFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">End Date</label>
                            <input type="date" name="endDate" value={itineraryFilters.endDate} onChange={(e) => handleFilterChange(e, setItineraryFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Preferences and Language Filter */}
                    <div>
                        <label className="block text-sm font-medium">Preferences</label>
                        <input type="text" name="preferences" value={itineraryFilters.preferences} onChange={(e) => handleFilterChange(e, setItineraryFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Language</label>
                        <input type="text" name="language" value={itineraryFilters.language} onChange={(e) => handleFilterChange(e, setItineraryFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <button type="submit" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Apply Itinerary Filters</button>
                </form>
            </section>

            {/* Filtered Itineraries */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Filtered Itineraries</h2>
                {filteredItineraries ? (
                    <ul className="space-y-2">
                        {filteredItineraries.map((itinerary) => (
                            <li key={itinerary._id} className="bg-gray-100 p-4 rounded shadow">
                                {itinerary.Itinerary_Name} - <span className="font-semibold">${itinerary.Tour_Price}</span> - Rating: {itinerary.Rating}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No itineraries match the filters.</p>
                )}
            </section>

            {/* Filter Form for Places and Museums */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Filter Places and Museums</h2>
                <form className="space-y-4" onSubmit={handleFilterPlacesAndMuseums}>
                    {/* Places and Museums Filter Form */}
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Category</label>
                            <input type="text" name="category" value={placesAndMuseumsFilters.category} onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="w-1/2 px-2">
                            <label className="block text-sm font-medium">Value</label>
                            <input type="text" name="value" value={placesAndMuseumsFilters.value} onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                    <button type="submit" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Apply Places and Museums Filters</button>
                </form>
            </section>

            {/* Filtered Places and Museums */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Filtered Places and Museums</h2>
                {filteredPlacesAndMuseums ? (
                    <ul className="space-y-2">
                        {filteredPlacesAndMuseums.map((place) => (
                            <li key={place._id} className="bg-gray-100 p-4 rounded shadow">
                                {place.Name} - {place.Description} - {place.Location}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No places or museums match the filters.</p>
                )}
            </section>
        </div>
    );
};

export default UpcomingEvents;
