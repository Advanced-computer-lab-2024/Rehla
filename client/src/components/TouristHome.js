import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { searchEventsPlaces, commentOnItinerary, rateItinerary, rateActivity, commentOnEvent } from '../services/api'; // Import the commentOnEvent function

const TouristHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [itineraryName, setItineraryName] = useState('');
    const [comment, setComment] = useState('');
    const [activityName, setActivityName] = useState('');

    // Separate rating states for itinerary and activity
    const [itineraryRating, setItineraryRating] = useState(''); // State for itinerary rating
    const [activityRating, setActivityRating] = useState(''); // State for activity rating

    // New state variables for event comments
    const [eventName, setEventName] = useState(''); // State for the event name
    const [eventComment, setEventComment] = useState(''); // State for the event comment

    // Fetch email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    // Handle event comment submission
    const handleEventCommentSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing
        setError(null); // Reset the error message

        try {
            const result = await commentOnEvent(email, eventName, eventComment); // Submit the comment on the event
            console.log('Event comment submitted:', result);

            setEventName(''); // Reset the event name input
            setEventComment(''); // Reset the event comment input
            alert('Comment added successfully!'); // Display a success message
        } catch (error) {
            console.error('Error adding event comment:', error);
            setError('Failed to submit the comment. Please try again later.');
        }
    };

    // Handle search submission
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const result = await searchEventsPlaces(searchTerm);
            setSearchResults(result);
            setIsSearched(true);
        } catch (err) {
            setError('Search failed. Please try again later.');
        }
    };

    // Handle comment submission for itineraries
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await commentOnItinerary(email, itineraryName, comment);
            console.log('Comment submitted:', result);
            setItineraryName('');
            setComment('');
            alert('Comment submitted successfully!');
        } catch (error) {
            console.error('Error submitting comment:', error);
            setError('Failed to submit the comment. Please try again later.');
        }
    };

    // Handle rating submission for itineraries
    const handleItineraryRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await rateItinerary(email, itineraryName, itineraryRating);
            console.log('Itinerary rating submitted:', result);
            setItineraryName('');
            setItineraryRating(''); // Reset the itinerary rating input
            alert('Itinerary rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting itinerary rating:', error);
            setError('Failed to submit the itinerary rating. Please try again later.');
        }
    };

    // Handle rating submission for activities
    const handleActivityRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await rateActivity(email, activityName, activityRating);
            console.log('Activity rating submitted:', result);
            setActivityName('');
            setActivityRating(''); // Reset the activity rating input
            alert('Activity rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting activity rating:', error);
            setError('Failed to submit the activity rating. Please try again later.');
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

            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

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

                    {searchResults.historicalPlaces && searchResults.historicalPlaces.length > 0 && (
                        <div>
                            <h3>Historical Places:</h3>
                            {searchResults.historicalPlaces.map(place => (
                                <div key={place._id}>
                                    <h4>{place.Name}</h4>
                                    <p>{place.Description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.activities && searchResults.activities.length > 0 && (
                        <div>
                            <h3>Activities:</h3>
                            {searchResults.activities.map(activity => (
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

            {/* Separate Comment Submission Form for Itineraries */}
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

            {/* Separate Rating Submission Form for Itineraries */}
            <div className="rating-form">
                <h2>Rate an Itinerary</h2>
                <form onSubmit={handleItineraryRatingSubmit}>
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
                        <label htmlFor="itinerary-rating">Rating (1-5):</label>
                        <input 
                            id="itinerary-rating"
                            type="number"
                            value={itineraryRating}
                            onChange={(e) => setItineraryRating(e.target.value)}
                            min="1"
                            max="5"
                            required
                        />
                    </div>

                    <button type="submit">Submit Rating</button>
                </form>
            </div>

            {/* Separate Rating Submission Form for Activities */}
            <div className="rating-form">
                <h2>Rate an Activity</h2>
                <form onSubmit={handleActivityRatingSubmit}>
                    <div>
                        <label htmlFor="activity-name">Activity Name:</label>
                        <input 
                            id="activity-name"
                            type="text"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="activity-rating">Rating (1-5):</label>
                        <input 
                            id="activity-rating"
                            type="number"
                            value={activityRating}
                            onChange={(e) => setActivityRating(e.target.value)}
                            min="1"
                            max="5"
                            required
                        />
                    </div>

                    <button type="submit">Submit Activity Rating</button>
                </form>
            </div>

            {/* New Form for Event Comment Submission */}
            <div className="event-comment-form">
                <h2>Submit a Comment on an Event</h2>
                <form onSubmit={handleEventCommentSubmit}>
                    <div>
                        <label htmlFor="event-name">Event Name:</label>
                        <input 
                            id="event-name"
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="event-comment">Comment:</label>
                        <textarea
                            id="event-comment"
                            value={eventComment}
                            onChange={(e) => setEventComment(e.target.value)}
                            placeholder="Write your comment on the event here..."
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <button type="submit">Submit Comment</button>
                </form>
            </div>
        </div>
    );
};

export default TouristHome;
