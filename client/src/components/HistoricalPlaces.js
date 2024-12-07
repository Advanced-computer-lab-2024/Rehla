import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUpcomingEventsAndPlaces,filterPlacesAndMuseums} from '../services/api';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import img1 from '../images/img10.jpg';
import img2 from '../images/img4.jpg';
import img3 from '../images/img3.jpg';
import { set } from 'mongoose';
import Homet2 from '../components/Homet2.js';


const HistoricalPlaces = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        console.log("Updated filteredPlacesAndMuseums:", filteredPlacesAndMuseums);
    }, [filteredPlacesAndMuseums]);

    if (error) {
        return <div className="text-red-500 text-center">Error: {error.message}</div>;
    }

    if (!data) {
        return <div className="text-center py-10">Loading...</div>;
    }


    return (
        <div className="bg-white shadow-md">
            <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Search Form */}
                    <form className="flex items-center ml-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 rounded-full px-72 py-2 w-full max-w-2xl text-sm pl-2"
                    />

                        <button type="submit" className="bg-white text-black rounded-full ml-2 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
                    <div className="flex items-center ml-auto">
                        <select 
                            value={currency} 
                            onChange={handleCurrencyChange} 
                            className="rounded p-1 mx-2 bg-transparent text-white"
                        >
                            <option value="USD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">USD</option>
                            <option value="EUR" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">EUR</option>
                            <option value="GBP" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">GBP</option>
                            <option value="JPY" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">JPY</option>
                            <option value="CAD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">CAD</option>
                            <option value="AUD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">AUD</option>
                        </select>

                        {/* Sign In/Sign Up Navigation */}
                        <nav className="flex space-x-6 ml-4">
                            <Link to="/signin" className="text-lg font-medium text-white hover:text-blue-500">
                                Sign in
                            </Link>
                            <Link to="/signup" className="text-lg font-medium text-white hover:text-blue-500">
                                Sign up
                            </Link>
                        </nav>
                    </div>

                </div>

                {/* Main Navigation */}
                <nav className="flex space-x-6">
                    <Link to="/" className="text-lg font-medium text-white hover:text-logoOrange">
                        Home
                    </Link>
                    <Link to="/UpcomingActivities" className="text-lg font-medium text-white hover:text-logoOrange">
                        Activities
                    </Link>
                    <Link to="/UpcomingItineraries" className="text-lg font-medium text-white hover:text-logoOrange">
                        Itineraries
                    </Link>
                    <Link to="/HistoricalPlaces" className="text-lg font-medium text-logoOrange">
                        Historical Places
                    </Link>
                    <Link to="/Museums" className="text-lg font-medium test-white hover:text-logoOrange">
                        Museums
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-white hover:text-logoOrange">
                        Gift Shop
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-logoOrange">
                        Transportation
                    </Link>
                </nav>            
            </div>
            <div className="flex overflow-x-auto scrollbar-hide px-6 py-4">
        {filteredPlacesAndMuseums && (
            <section className="mb-10 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Museums and Historical Places
            </h2>

            {/* Museums and Historical Places Filter Form */}
            <form onSubmit={handleFilterPlacesAndMuseums} className="mb-4 flex justify-center gap-4">
                <select
                name="category"
                value={placesAndMuseumsFilters.category}
                onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                className="border rounded-full p-2"
                >
                <option value="">Select Category</option>
                <option value="museums">Museums</option>
                <option value="historical_places">Historical Places</option>
                </select>

                <select
                name="value"
                value={placesAndMuseumsFilters.value}
                onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                className="border rounded-full p-2"
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

                <button 
                type="submit" 
                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700"
                >
                Filter Places
                </button>
            </form>

            <div className="flex overflow-x-auto scrollbar-hide px-6 py-4 gap-6">
                {filteredPlacesAndMuseums.map((museum) => (
                <div
                    key={museum._id}
                    className="card w-96 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                >
                    <img
                    src={museum.pictures || museum.Pictures}
                    alt={museum.Name}
                    className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="text-lg font-semibold text-gray-800">
                        {museum.Name}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        <div>
                        <span className="font-semibold">Location: </span>
                        {museum.location}
                        </div>
                        <div className="mt-1">
                        <span className="font-semibold">Opening Hours: </span>
                        {museum.Opening_Hours}
                        </div>
                        <div className="mt-1">
                        <span className="font-semibold">Starting Prices: </span>
                        {convertPrice(museum.S_Tickets_Prices)} {currency}
                        </div>
                    </div>
                    <button 
                        className="mt-4 bg-black text-white rounded-full py-2 px-4 w-full hover:bg-gray-700"
                    >
                        View Details
                    </button>
                    </div>
                </div>
                ))}
            </div>
                </section>
            )}
            </div>
            {/* Museums and Historical Places Section */}
                {!filteredPlacesAndMuseums && (
                <section className="mb-10 mt-10">
                    {/* Museums and Historical Places Filter Form */}
                    <form 
                    onSubmit={handleFilterPlacesAndMuseums} 
                    className="mb-4 flex justify-end gap-4"
                    >
                    <select
                        name="category"
                        value={placesAndMuseumsFilters.category}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Category</option>
                        <option value="historical_places">Historical Places</option>
                    </select>

                    <select
                        name="value"
                        value={placesAndMuseumsFilters.value}
                        onChange={(e) => handleFilterChange(e, setPlacesAndMuseumsFilters)}
                        className="border rounded-full p-2"
                    >
                        <option value="">Select Value</option>
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

                    <button 
                        type="submit" 
                        className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700"
                    >
                        Filter Places
                    </button>
                    </form>

                    <div className="flex overflow-x-auto scrollbar-hide px-6 py-4 gap-6">
                    {/* Render Historical Places - Limited to 4 */}
                    {data.historicalPlaces.map((place) => (
                        <div
                        key={place._id}
                        className="card w-96 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                        /*onClick={() => handleActivityClick(place)}*/
                        >
                        <img
                            src={place.Pictures}
                            alt={place.Name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                            <div className="text-lg font-semibold text-gray-800">
                            {place.Name}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                            <div>
                                <span className="font-semibold">Location: </span>
                                {place.Location}
                            </div>
                            <div className="mt-1">
                                <span className="font-semibold">Opening Hours: </span>
                                {place.Opening_Time} - {place.Closing_Time}
                            </div>
                            <div className="mt-1">
                                <span className="font-semibold">Ticket Prices: </span>
                                {convertPrice(place.S_Tickets_Prices)} {currency}
                            </div>
                            </div>
                            <button 
                            className="mt-4 bg-black text-white rounded-full py-2 px-4 w-full hover:bg-gray-700"
                            >
                            View Details
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </section>
                )}



        

            <footer className="bg-black shadow m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="w-44" alt="Flowbite Logo" />
                        </a>
                        <div className="flex justify-center w-full">
                            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 -ml-14">
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">About</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">Licensing</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
                </div>
            </footer>

        </div>
    );
};

export default HistoricalPlaces;


