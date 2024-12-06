import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUpcomingEventsAndPlaces,sortActivities,filterActivities} from '../services/api';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import img1 from '../images/img10.jpg';
import img3 from '../images/img3.jpg';



const UpcomingActivities = () => {
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
    const [activityFilters, setActivityFilters] = useState({
        minPrice: '',
        maxPrice: '',
        rating: '',
        category: '',
        startDate: '',
        endDate: ''
    });
    const [activityFilterType, setActivityFilterType] = useState(''); // For activities
    const [activityfilterOptions] = useState(['price', 'rating', 'category', 'date']); // Filter options
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

    const handleActivityClick = (activity) => {
        navigate(`/activity-details/${encodeURIComponent(activity.Name)}`); // Encode to make the URL safe
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

    const handleActivityFilterChange = (e) => {
        setActivityFilterType(e.target.value);
    };
    

    const activitiesToDisplay = sortedActivities || (data && data.upcomingActivities) || [];


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
                    <Link to="/" className="text-lg font-medium text-white hover:text-blue-500">
                        Home
                    </Link>
                    <Link to="/UpcomingActivities" className="text-lg font-medium text-white hover:text-blue-500">
                        Activities
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Itineraries
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Historical Places
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Museums
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Gift Shop
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Transportation
                    </Link>
                </nav>            
            </div>

            {/* Activity Filters and Sort */}
            <section className="mb-10 mt-20">
            <form onSubmit={handleFilterActivities} className="mb-4 mr-10 ml-auto">
    <div className="flex items-center justify-end space-x-4">
        <select
            value={activityFilterType}
            onChange={handleActivityFilterChange}
            className="border rounded-full p-2"
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
                    className="border rounded-full p-2"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={activityFilters.maxPrice}
                    onChange={(e) => setActivityFilters({ ...activityFilters, maxPrice: e.target.value })}
                    className="border rounded-full p-2"
                />
            </>
        )}

        {activityFilterType === 'rating' && (
            <input
                type="number"
                placeholder="Rating"
                value={activityFilters.rating}
                onChange={(e) => setActivityFilters({ ...activityFilters, rating: e.target.value })}
                className="border rounded-full p-2"
            />
        )}

        {activityFilterType === 'category' && (
            <select
                value={activityFilters.category}
                onChange={(e) => setActivityFilters({ ...activityFilters, category: e.target.value })}
                className="border rounded-full p-2"
            >
                <option value="">Select Category</option>
                <option value="exhibitions">Exhibitions</option>
                <option value="museums">Museums</option>
                <option value="sports matches">Sports Matches</option>
                <option value="food">Food</option>
                <option value="concert">Concert</option>
                <option value="party">Party</option>
                <option value="Adventure">Adventure</option>
            </select>
        )}

        {activityFilterType === 'date' && (
            <>
                <input
                    type="date"
                    value={activityFilters.startDate}
                    onChange={(e) => setActivityFilters({ ...activityFilters, startDate: e.target.value })}
                    className="border rounded-full p-2"
                />
                <input
                    type="date"
                    value={activityFilters.endDate}
                    onChange={(e) => setActivityFilters({ ...activityFilters, endDate: e.target.value })}
                    className="border rounded-full p-2"
                />
            </>
        )}

        <div className="flex justify-end space-x-2">
            <button 
                type="submit" 
                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700"
            >
                Filter Activities
            </button>
            <button 
                onClick={() => handleSortActivities('price')} 
                className="bg-logoOrange text-white px-4 py-2 rounded-full hover:bg-orange-600"
            >
                Sort by Price
            </button>
        </div>
    </div>
</form>


        <div className="flex overflow-x-auto scrollbar-hide px-6 py-4 gap-6">
                {activitiesToDisplay.map((activity) => (
                    <div
                        key={activity._id}
                        className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                        onClick={() => handleActivityClick(activity)}
                    >
                        <img
                            src={activity.Picture}
                            alt={activity.Name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                            <div className="text-lg font-semibold text-gray-800">{activity.Name}</div>
                            <div className="text-sm text-gray-600 mt-2">
                                <span className="font-semibold">{convertPrice(activity.Price)} {currency}</span>
                                <div className="mt-1">Rating: {activity.Rating}</div>
                                <div className="mt-1">Location: {activity.Location}</div>
                            </div>
                            <button 
                                onClick={() => handleActivityClick(activity)} 
                                className="mt-4 bg-black text-white rounded-full py-2 px-4 w-full hover:bg-gray-700"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            </section>

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
export default UpcomingActivities;