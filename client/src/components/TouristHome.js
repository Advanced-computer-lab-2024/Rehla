import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { searchEventsPlaces, commentOnItinerary, rateItinerary } from '../services/api'; // Import the rateItinerary function

const TouristHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [error, setError] = useState(null); // State for holding error messages
    const [email, setEmail] = useState(''); // Store email from localStorage
    const [itineraryName, setItineraryName] = useState(''); // Separate itinerary name for comment form
    const [comment, setComment] = useState(''); // Separate comment for comment form
    const [rating, setRating] = useState(''); // State for rating input

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
        console.log(email);
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

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing
        setError(null); // Reset the error message

        try {
            const result = await commentOnItinerary(email, itineraryName, comment); // Submit the comment
            console.log('Comment submitted:', result);

            setItineraryName(''); // Reset the itinerary input
            setComment(''); // Reset the comment input
            alert('Comment added successfully!'); // Display a success message
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to submit the comment. Please try again later.');
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing
        setError(null); // Reset error state

        try {
            const result = await rateItinerary(email, itineraryName, rating); // Submit the rating
            console.log('Rating submitted:', result);

            setItineraryName(''); // Reset the itinerary input
            setRating(''); // Reset the rating input
            alert('Rating added successfully!'); // Display a success message
        } catch (error) {
            console.error('Error adding rating:', error);
            setError('Failed to submit the rating. Please try again later.');
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

            {/* Search Section */}
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

            {/* Separate Comment Submission Form */}
            <div className="comment-form">
                <h2>Submit a Comment on an Itinerary</h2>
                <form onSubmit={handleCommentSubmit}>
                    <div>
                        <label htmlFor="itinerary-name">Itinerary Name:</label>
                        <input 
                            id="itinerary-name"
                            type="text"
                            value={itineraryName}
                            onChange={(e) => setItineraryName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="comment">Comment:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your comment here..."
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <button type="submit">Submit Comment</button>
                </form>
            </div>

            {/* Separate Rating Submission Form */}
            <div className="rating-form">
                <h2>Rate an Itinerary</h2>
                <form onSubmit={handleRatingSubmit}>
                    <div>
                        <label htmlFor="itinerary-name">Itinerary Name:</label>
                        <input 
                            id="itinerary-name"
                            type="text"
                            value={itineraryName}
                            onChange={(e) => setItineraryName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="rating">Rating (1-5):</label>
                        <input 
                            id="rating"
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            min="1"
                            max="5"
                            required
                        />
                    </div>

                    <button type="submit">Submit Rating</button>
                </form>
            </div>
        </div>
    );
};

export default TouristHome;
