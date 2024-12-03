import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUpcomingEventsAndPlaces, sortActivities, sortItineraries, filterActivities, filterItineraries , filterPlacesAndMuseums} from '../services/api';
import img1 from '../images/img10.jpg';
import img2 from '../images/img4.jpg';
import img3 from '../images/img3.jpg';

const Home = () => {

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const [selectedActivity, setSelectedActivity] = useState(null); // New state for selected activity
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    const [currency, setCurrency] = useState('USD');
    const [conversionRates] = useState({
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35
    });

    const [sortedActivities, setSortedActivities] = useState(null);
    const [sortedItineraries, setSortedItineraries] = useState(null);
    const [filteredPlacesAndMuseums, setFilteredPlacesAndMuseums] = useState(null);
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
    const [placesAndMuseumsFilters, setPlacesAndMuseumsFilters] = useState({
        category: '',
        value: ''
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

    const convertPrice = (price) => {
        return (price * conversionRates[currency]).toFixed(2);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

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

    const handleFilterPlacesAndMuseums = async (e) => {
        e.preventDefault();
        try {
            console.log("Filters being used:", placesAndMuseumsFilters);
            const filtered = await filterPlacesAndMuseums(placesAndMuseumsFilters);

            if (filtered){
                            // Ensure that filtered data contains the expected structure
            console.log("Filtered Data:", filtered);
    
            // Setting the filtered results in state
            setFilteredPlacesAndMuseums(filtered);
    
            // Log the filtered state to confirm it's set
            console.log("State set for filtered places and museums:", filtered);
            }else{
                setFilteredPlacesAndMuseums(null);
                console.log("No data found for the selected filters");
                alert("No data found for the selected filters");
            }
    

            
        } catch (error) {
            console.error("Error fetching filtered data:", error);
           // setError(error);
        }
    };

    const handleFilterChange = (e, setFilters) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // // Open modal and set the selected activity
    // const handleActivityClick = (activity) => {
    //     setSelectedActivity(activity);
    //     setIsModalOpen(true);
    // };

    const handleActivityClick = (activity) => {
        navigate(`/activity-details/${encodeURIComponent(activity.Name)}`); // Encode to make the URL safe
    };

    const handleItineraryClick = (itinerary) => {
        navigate(`/itinerary-details/${encodeURIComponent(itinerary.Itinerary_Name)}`); // Encode to make the URL safe
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedActivity(null); // Reset selected activity when closing
    };

    // Generate shareable link
    const generateShareLink = () => {
        const activityLink = `${window.location.origin}/activity/${selectedActivity._id}`;
        return activityLink;
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
            {/* Currency Dropdown */}
            <select value={currency} onChange={handleCurrencyChange} className="border rounded p-1 mx-2 bg-white">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                </select>

            <div className="p-8 rounded"> {/* Add padding here */}
                <div
                    className="flex justify-center items-center rounded h-96 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img1})` }}
                >
                    <div className="bg-black bg-opacity-30 w-full h-full rounded flex items-center justify-center">
                        <h1 className="text-white text-2xl">See The World One REHLA At A Time!</h1>
                    </div>
                </div>
            </div>

            {/* Activity Filters and Sort */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">Upcoming Activities</h2>
                <form onSubmit={handleFilterActivities} className="mb-4 ml-10">
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
                <div className="flex overflow-x-auto scrollbar-hide px-6 py-4">
                    {activitiesToDisplay.map((activity) => (
                        <div
                        key={activity._id}
                        className="gallery-item flex-none flex flex-col items-center w-80"
                        onClick={() => handleActivityClick(activity)}
                        >
                        <img
                            src={activity.Picture}
                            alt={activity.Name}
                            className="w-72 h-72 object-cover rounded duration-300 ease-in-out hover:scale-105"
                        />
                        <div className="text-md font-medium text-center mt-2">{activity.Name}</div>
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold">{convertPrice(activity.Price)} {currency}</span> - Rating: {activity.Rating}
                        </div>
                        </div>
                    ))}
                </div>
            </section>
             {/* Modal for Activity Details */}
             {isModalOpen && selectedActivity && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-2xl font-semibold">{selectedActivity.Name}</h3>
                        <p className="text-lg">{selectedActivity.Description}</p>
                        <p className="text-lg">
                            Price: {convertPrice(selectedActivity.Price)} {currency}
                        </p>
                        <p className="text-lg">Rating: {selectedActivity.Rating}</p>
                        <div className="mt-4">
                            <button
                                className="bg-brandBlue text-white px-4 py-2 rounded"
                                onClick={() => {
                                    const link = generateShareLink();
                                    alert(`Share this link: ${link}`); // You can also copy it to the clipboard or handle sharing in other ways
                                }}
                            >
                                Share Activity
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                                onClick={handleCloseModal} // Close modal
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="flex justify-between items-center mb-10 p-8 ml-10">
                <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-semibold mb-2">Discover Amazing Experiences</h2>
                    <p className="text-gray-700">
                        Experience the best attractions and activities in your area. From exciting adventures to serene cultural experiences, we have something for everyone. Join us to explore, learn, and create unforgettable memories!
                    </p>
                </div>
                <div className="flex-none -mr-10"> {/* Added margin-left to the image container */}
                    <img src={img2} alt="Experience" className="w-4/5 h-auto rounded shadow-lg" />
                </div>
            </section>

            {/* Itinerary Filters and Sort */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">Upcoming Itineraries</h2>
                <form onSubmit={handleFilterItineraries} className="mb-4 ml-10">
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

                    {itineraryFilterType === 'preferences' && (
                        <input
                            type="text"
                            placeholder="Preferences"
                            value={itineraryFilters.preferences}
                            onChange={(e) => setItineraryFilters({ ...itineraryFilters, preferences: e.target.value })}
                            className="border rounded p-1 mx-1"
                        />
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
                <div className="flex overflow-x-auto scrollbar-hide px-6 py-4">
                    {itinerariesToDisplay.map((itinerary) => (
                        <div
                        key={itinerary._id}
                        className="gallery-item flex-none flex flex-col items-center w-80"
                        onClick={() => handleItineraryClick(itinerary)}
                        >
                        <img
                            src={itinerary.Picture}
                            alt={itinerary.Itinerary_Name}
                            className="w-72 h-72 object-cover rounded duration-300 ease-in-out hover:scale-105"
                        />
                        <div className="text-md font-medium text-center mt-2">{itinerary.Itinerary_Name}</div>
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold">{convertPrice(itinerary.Tour_Price)} {currency}</span> - Rating: {itinerary.Rating}
                        </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="flex justify-between items-center mb-10 p-8 ml-10">
                
                <div className="flex-none -mr-10"> {/* Added margin-left to the image container */}
                    <img src={img3} alt="Experience" className="w-4/5 h-auto rounded shadow-lg" />
                </div>
                <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-semibold mb-2">Explore Fascinating Museums and Historical Places</h2>
                    <p className="text-gray-700">
                    Discover the rich history and culture around you by visiting captivating museums and iconic historical landmarks. From ancient 
                    artifacts to timeless architecture, these destinations offer a journey through time, filled with stories of the past and heritage. 
                    Whether you're a history enthusiast or just curious, immerse yourself in unique experiences that will inspire, educate, and leave you with lasting memories!
                    </p>
                </div>
            </section>

           {/* Museums and Historical Places Filter Form */}
           <form onSubmit={handleFilterPlacesAndMuseums} className="mb-4">
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={placesAndMuseumsFilters.category}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    >
                        <option value="">Select Category</option>
                        <option value="museums">Museums</option>
                        <option value="historical_places">Historical Places</option>
                    </select>
                </div>
            <div>
                    <label className="block text-sm font-medium">Value</label>
                    <select
                        name="value"
                        value={placesAndMuseumsFilters.value}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                        >
                        <option value="">Select Value</option>
                        {placesAndMuseumsFilters.category === 'museums' && (
                            <>
                                <option value="Historical">Historical</option>
                                <option value="Art Museum">Art Museum</option>
                                <option value="Art">Art</option>
                                <option value="Mix">Mix</option>
                            </>
                        )}
                        {placesAndMuseumsFilters.category === 'historical_places' && (
                            <>
                                <option value="Monuments">Monuments</option>
                                <option value="Ancient Greece">Ancient Greece</option>
                                <option value="Religious">Religious</option>
                                <option value="Sites">Sites</option>
                                <option value="Castle">Castle</option>
                            </>
                        )}
                    </select>

        </div>
     </div>
            <button type="submit" className="mt-4 bg-brandBlue text-white px-3 py-1 rounded">Filter Museums & Historical Places</button>
        </form>
        <div className="flex overflow-x-auto scrollbar-hide gap-6 px-6 py-4">
    {filteredPlacesAndMuseums ? (
        filteredPlacesAndMuseums.map((museum) => (
            <div key={museum._id} className="gallery-item flex-none flex flex-col items-center w-80">
                <img
                    src={museum.pictures}
                    alt={museum.Name}
                    className="w-72 h-72 object-cover rounded duration-300 ease-in-out hover:scale-105"
                />
                <div className="text-md font-medium text-center">{museum.Name}</div>
                <div className="text-sm text-gray-700">
                    <span className="font-semibold">Location: {museum.location}</span>
                    <br />
                    <span>Opening Hours: {museum.Opening_Hours}</span>
                    <br />
                    <span>Starting Prices: {convertPrice(museum.S_Tickets_Prices)} {currency}</span>
                </div>
            </div>
        ))
    ) : (
        <div className="text-center w-full">No museums or historical places found for the selected filters.</div>
    )}
</div>

            {/* Museums and Historical Places Section */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">Museums and Historical Places</h2>
                <div className="flex overflow-x-auto scrollbar-hide gap-6 px-6 py-4">
                    {(filteredPlacesAndMuseums?.museums || data.museums).map((museum) => (
                        <div key={museum._id} className="gallery-item flex-none flex flex-col items-center w-80"
                        onClick={() => handleActivityClick(museum)}
>
                            <img
                                src={museum.pictures}
                                alt={museum.Name}
                                className="w-72 h-72 object-cover rounded duration-300 ease-in-out hover:scale-105"
                            />
                            <div className="text-md font-medium text-center">{museum.Name}</div>
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Location: {museum.location}</span>
                                <br />
                                <span>Opening Hours: {museum.Opening_Hours}</span>
                                <br />
                                <span>Starting Prices: {convertPrice(museum.S_Tickets_Prices)} {currency}</span>
                            </div>
                        </div>
                    ))}
                    {(filteredPlacesAndMuseums?.historicalPlaces || data.historicalPlaces).map((place) => (
                        <div key={place._id} className="gallery-item flex-none flex flex-col items-center w-80"
                        onClick={() => handleActivityClick(place)}
>
                            <img
                                src={place.Pictures}
                                alt={place.Name}
                                className="w-72 h-72 object-cover rounded duration-300 ease-in-out hover:scale-105"
                            />
                            <div className="text-md font-medium text-center">{place.Name}</div>
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Location: {place.Location}</span>
                                <br />
                                <span>Opening Hours: {place.Opening_Time} - {place.Closing_Time}</span>
                                <br />
                                <span>Ticket Prices: {convertPrice(place.S_Tickets_Prices)} {currency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            

        </div>
        
    );
};

export default Home;

                
