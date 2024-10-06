import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { searchEventsPlaces } from '../services/api';

const TouristHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [error, setError] = useState(null); // State for holding error messages
    const [email, setEmail] = useState(''); // Store email from localStorage

    // Fetch email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email'); // Retrieve the stored email
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before each search

        try {
            const results = await searchEventsPlaces(searchTerm); // Call the API function
            console.log("API Response:", results); // Log the API response

            if (results) {
                setSearchResults(results); // Set the state with the results
                setIsSearched(true); // Indicate that a search has been performed
            } else {
                console.log("No results found");
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError('Error fetching search results. Please try again later.'); // Set error message
        }
    };

    return (
        <div>
            <div className="NavBar">
                <img src={logo} alt="Logo" />
                <nav className="main-nav">
                    <ul className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/eventsplaces">Events/Places</Link>
                    </ul>
                </nav>

                <nav className="signing">
                    <Link to="/TouristHome/TouristProfile">My Profile</Link>
                </nav>
            </div>

            <div className="search">
                <label htmlFor="search-bar" style={{ marginRight: '10px' }}>Search Events/Places:</label>
                <form onSubmit={handleSearch} className="search-bar">
                    <input 
                        id="search-bar"
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        required 
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>} {/* Display error message */}

            {isSearched && searchResults && (
                <div className="search-results">
                    <h2>Search Results:</h2>

                    {searchResults.museums && searchResults.museums.length > 0 && (
                        <div>
                            <h3>Museums:</h3>
                            {searchResults.museums.map(museum => (
                                <div key={museum._id}>
                                    <h4>{museum.Name}</h4>
                                    <p>{museum.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.historicalPlaces && searchResults.historicalPlaces.name.length > 0 && (
                        <div>
                            <h3>Historical Places:</h3>
                            {searchResults.historicalPlaces.name.map(place => (
                                <div key={place._id}>
                                    <h4>{place.Name}</h4>
                                    <p>{place.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.activities && searchResults.activities.name.length > 0 && (
                        <div>
                            <h3>Activities:</h3>
                            {searchResults.activities.name.map(activity => (
                                <div key={activity._id}>
                                    <h4>{activity.Name}</h4>
                                    <p>{activity.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.itineraries && searchResults.itineraries.length > 0 && (
                        <div>
                            <h3>Itineraries:</h3>
                            {searchResults.itineraries.map(itinerary => (
                                <div key={itinerary._id}>
                                    <h4>{itinerary.Itinerary_Name}</h4>
                                    <p>{itinerary.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TouristHome;
