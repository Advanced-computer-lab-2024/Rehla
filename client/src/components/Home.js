import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUpcomingEventsAndPlaces, sortActivities, sortItineraries, filterActivities, filterItineraries } from '../services/api';
import logo from '../images/logo.png';
import img1 from '../images/img2.jpg';

const Home = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [sortedActivities, setSortedActivities] = useState(null);
    const [sortedItineraries, setSortedItineraries] = useState(null);
    const [activityFilters, setActivityFilters] = useState({
        minPrice: '',
        maxPrice: '',
        rating: '',
        category: '',
        startDate: '',
        endDate: ''
    });
    const [itineraryFilters, setItineraryFilters] = useState({
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
        preferences: '',
        language: ''
    });
    
    const [activityFilterType, setActivityFilterType] = useState(''); // For activities
    const [itineraryFilterType, setItineraryFilterType] = useState(''); // For itineraries
    const [activityfilterOptions] = useState(['price', 'rating', 'category', 'date']); // Filter options
    const [itineraryfilterOptions] = useState(['price', 'rating', 'Preference Tag', 'date']);

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
            setSortedActivities(filtered.activities); // Update the displayed activities
        } catch (error) {
            setError(error);
        }
    };

    const handleFilterItineraries = async (e) => {
        e.preventDefault();
        try {
            const filtered = await filterItineraries(itineraryFilters);
            setSortedItineraries(filtered); // Update the displayed itineraries
        } catch (error) {
            setError(error);
        }
    };

    const handleActivityFilterChange = (e) => {
        setActivityFilterType(e.target.value);
    };

    const handleItineraryFilterChange = (e) => {
        setItineraryFilterType(e.target.value);
    };

    if (error) {
        return <div className="text-red-500 text-center">Error: {error.message}</div>;
    }

    if (!data) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // Use sorted or original data based on sorting/filtering
    const activitiesToDisplay = sortedActivities || data.upcomingActivities;
    const itinerariesToDisplay = sortedItineraries || data.upcomingItineraries;

    return (
        <div className="bg-white shadow-md">
            <div className="w-full mx-auto px-6 py-4 bg-brandBlue flex justify-between items-center">
                {/* Logo */}
                <img src={logo} alt="Logo" className="w-20" />

                {/* Main Navigation */}
                <nav className="flex space-x-6">
                    <Link to="/" className="text-lg font-medium text-white-700 hover:text-blue-500">
                        Home
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white-700 hover:text-blue-500">
                        Events/Places
                    </Link>
                </nav>

                {/* Sign In/Sign Up Navigation */}
                <nav className="flex space-x-6">
                    <Link to="/signin" className="text-lg font-medium text-white-700 hover:text-blue-500">
                        Sign in
                    </Link>
                    <Link to="/signup" className="text-lg font-medium text-white-700 hover:text-blue-500">
                        Sign up
                    </Link>
                </nav>
            </div>

            <div
                className="flex justify-center items-center py-6 h-96 bg-cover bg-center"
                style={{ backgroundImage: `url(${img1})` }}
            >
                <div className="bg-black bg-opacity-30 w-full h-full flex items-center justify-center">
                    <h1 className="text-white text-2xl">See The World One REHLA At A Time!</h1>
                </div>
            </div>

            {/* Activity Filters and Sort */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Activities</h2>
                <form onSubmit={handleFilterActivities} className="mb-4">
                    <select
                        value={activityFilterType}
                        onChange={handleActivityFilterChange}
                        className="border rounded p-1 mx-1"
                    >
                        <option value="">Select Filter</option>
                        {activityfilterOptions.map(option => (
                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                        ))}
                    </select>

                    {activityFilterType === 'price' && (
                        <>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={activityFilters.minPrice}
                                onChange={(e) => setActivityFilters({ ...activityFilters, minPrice: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={activityFilters.maxPrice}
                                onChange={(e) => setActivityFilters({ ...activityFilters, maxPrice: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                        </>
                    )}

                    {activityFilterType === 'rating' && (
                        <input
                            type="number"
                            placeholder="Rating"
                            value={activityFilters.rating}
                            onChange={(e) => setActivityFilters({ ...activityFilters, rating: e.target.value })}
                            className="border rounded p-1 mx-1"
                        />
                    )}

                    {activityFilterType === 'category' && (
                        <select
                            value={activityFilters.category}
                            onChange={(e) => setActivityFilters({ ...activityFilters, category: e.target.value })}
                            className="border rounded p-1 mx-1"
                        >
                            <option value="">Select Category</option>
                            <option value="exhibitions">exhibitions</option>
                            <option value="museums">museums</option>
                            <option value="sports matches">sports matches</option>
                            <option value="food">food</option>
                            <option value="concert">concert</option>
                            <option value="party">party</option>
                            <option value="Adventure">Adventure</option>
                        </select>
                    )}

                    {activityFilterType === 'date' && (
                        <>
                            <input
                                type="date"
                                value={activityFilters.startDate}
                                onChange={(e) => setActivityFilters({ ...activityFilters, startDate: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                            <input
                                type="date"
                                value={activityFilters.endDate}
                                onChange={(e) => setActivityFilters({ ...activityFilters, endDate: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                        </>
                    )}

                    <button type="submit" className="bg-brandBlue text-white px-3 py-1 rounded">Filter Activities</button>
                    <button onClick={() => handleSortActivities('price')} className="bg-green-500 text-white px-3 py-1 rounded ml-2">Sort by Price</button>
                </form>
                <div className="flex overflow-x-auto scrollbar-hide gap-6 px-6 py-4">
                    {activitiesToDisplay.map((activity) => (
                        <div
                        key={activity._id}
                        className="gallery-item flex-none flex flex-col items-center w-80"
                        >
                        <img
                            src={activity.Picture}
                            alt={activity.Name}
                            className="w-80 h-80 object-cover rounded duration-300 ease-in-out hover:scale-105"
                        />
                        <div className="text-md font-medium text-center mt-2">{activity.Name}</div>
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold">${activity.Price}</span> - Rating: {activity.Rating}
                        </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Itinerary Filters and Sort */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Itineraries</h2>
                <form onSubmit={handleFilterItineraries} className="mb-4">
                    <select
                        value={itineraryFilterType}
                        onChange={handleItineraryFilterChange}
                        className="border rounded p-1 mx-1"
                    >
                        <option value="">Select Filter</option>
                        {itineraryfilterOptions.map(option => (
                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                        ))}
                    </select>

                    {itineraryFilterType === 'price' && (
                        <>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={itineraryFilters.minPrice}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, minPrice: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={itineraryFilters.maxPrice}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, maxPrice: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                        </>
                    )}

                    {itineraryFilterType === 'rating' && (
                        <input
                            type="number"
                            placeholder="Rating"
                            value={itineraryFilters.rating}
                            onChange={(e) => setItineraryFilters({ ...itineraryFilters, rating: e.target.value })}
                            className="border rounded p-1 mx-1"
                        />
                    )}

                    {itineraryFilterType === 'Preference Tag' && (
                        <select
                            value={itineraryFilters.preferences}
                            onChange={(e) => setItineraryFilters({ ...itineraryFilters, preferences: e.target.value })}
                            className="border rounded p-1 mx-1"
                        >
                            <option value="">Select Preference</option>
                            <option value="Historic Areas">Historic Areas</option>
                            <option value="Beaches">Beaches</option>
                            <option value="Family-Friendly">Family-Friendly</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Budget-Friendly">Budget-Friendly</option>
                           
                        
                        </select>
                    )}

                    {itineraryFilterType === 'date' && (
                        <>
                            <input
                                type="date"
                                value={itineraryFilters.startDate}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, startDate: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                            <input
                                type="date"
                                value={itineraryFilters.endDate}
                                onChange={(e) => setItineraryFilters({ ...itineraryFilters, endDate: e.target.value })}
                                className="border rounded p-1 mx-1"
                            />
                        </>
                    )}

                    <button type="submit" className="bg-brandBlue text-white px-3 py-1 rounded">Filter Itineraries</button>
                    <button onClick={() => handleSortItineraries('price')} className="bg-green-500 text-white px-3 py-1 rounded ml-2">Sort by Price</button>
                </form>
                <div className="flex overflow-x-auto gap-6 px-6 py-4">
                    {itinerariesToDisplay.map((itinerary) => (
                        <div
                            key={itinerary._id}
                            className="gallery-item flex flex-col items-center bg-gray-100 p-4 rounded shadow w-80"
                        >
                            <div className="text-md font-medium text-center">{itinerary.Itinerary_Name}</div>
                            <div className="text-sm text-gray-700 mt-2">
                                <span className="font-semibold">${itinerary.Tour_Price}</span> - Rating: {itinerary.Rating}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
