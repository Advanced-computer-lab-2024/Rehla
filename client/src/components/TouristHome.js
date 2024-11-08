import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { searchEventsPlaces, commentOnItinerary, rateItinerary, rateActivity, commentOnEvent , rateTourGuide,commentTourGuide,viewComplaintByEmail,processComplaintByEmail,createTouristItinerary,createTouristActivity,deleteTouristItenrary,deleteTouristActivity, createComplaint,redeemPoints,createPreference } from '../services/api'; // Import the commentOnEvent function
import Homet2 from '../components/Homet2.js';
import Home from '../components/Home.js';

const TouristHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isSearched, setIsSearched] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [itineraryName, setItineraryName] = useState('');
    const [comment, setComment] = useState('');
    const [activityName, setActivityName] = useState('');
    const [message, setMessage] = useState(''); // Use

    // Separate rating states for itinerary and activity
    const [itineraryRating, setItineraryRating] = useState(''); // State for itinerary rating
    const [activityRating, setActivityRating] = useState(''); // State for activity rating

    // New state variables for event comments
    const [eventName, setEventName] = useState(''); // State for the event name
    const [eventComment, setEventComment] = useState(''); // State for the event comment

    // State variables for rating a tour guide
    const [tourGuideEmail, setTourGuideEmail] = useState(''); // State for the tour guide email
    const [tourGuideRating, setTourGuideRating] = useState(''); // State for the tour guide rating

    const [tourGuideEmaill, setTourGuideEmaill] = useState('');
    const [commentt, setCommentt] = useState('');
    const [errort, setErrort] = useState('');
    
    const [complaintsList, setComplaintsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showComplaints, setShowComplaints] = useState(false); // State to control showing complaints
    const [bookingItineraryName, setBookingItineraryName] = useState(''); // State for itinerary name to book
    const [bookingActivityName, setBookingActivityName] = useState(''); // State for activity name to book
    const [cancelbookingItineraryName, setcancelBookingItineraryName] = useState(''); // State for itinerary name  
    const [cancelbookingActivityName, setcancelBookingActivityName] = useState(''); // State for activity name  

    const [complaintTitle, setComplaintTitle] = useState('');
    const [complaintBody, setComplaintBody] = useState('');

    const [preferenceData, setPreferenceData] = useState({
        email: '',
        historicAreas: false,
        beaches: false,
        familyFriendly: false,
        shopping: false,
        budgetFriendly: false
    });
    const [messagee, setMessagee] = useState('');
    
    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createComplaint(email, complaintTitle, complaintBody);
            console.log('Complaint submitted:', result);
            setComplaintTitle('');
            setComplaintBody('');
            alert('Complaint submitted successfully!');
        } catch (error) {
            console.error('Error submitting complaint:', error);
            setError('Failed to submit the complaint. Please try again later.');
        }
    };
    



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

     // Function to process a complaint by email
     const handleProcessComplaint = async (email) => {
        try {
            const processedComplaint = await processComplaintByEmail(email);
            alert('Complaint processed successfully: ' + processedComplaint.Title);
            // Optionally, refresh the list of complaints after processing
            setComplaintsList(complaintsList.filter((complaint) => complaint.Tourist_Email !== email));
        } catch (error) {
            console.error('Error processing complaint:', error);
            alert('Failed to process the complaint.');
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

    // Handle rating submission for tour guides
    const handleTourGuideRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await rateTourGuide(email, tourGuideEmail, tourGuideRating);
            console.log('Tour guide rating submitted:', result);
            setTourGuideEmail('');
            setTourGuideRating(''); // Reset the tour guide rating input
            alert('Tour guide rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting tour guide rating:', error);
            setError('Failed to submit the tour guide rating. Please try again later.');
        }
    };
    
    const handleCommentSubmitt = async (e) => {
        e.preventDefault();
        setErrort('');

        try {
            const result = await commentTourGuide('tourist@example.com', tourGuideEmaill, commentt); // Replace with actual tourist email
            console.log('Comment submitted:', result);
            setTourGuideEmaill('');
            alert('Comment submitted successfully!');
            setCommentt(''); // Clear comment input after submission
        } catch (error) {
            console.errort('Error submitting comment:', errort);
            setErrort('Failed to submit the comment. Please try again later.');
        }
    };

    const handleFetchComplaintByEmail = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        setShowComplaints(false); // Hide previous complaints list before fetching new data

        try {
            const storedEmail = localStorage.getItem('email');
            const complaintData = await viewComplaintByEmail(storedEmail);

            if (complaintData.length === 0) {
                alert('No complaints found for this email.');
            } else {
                setComplaintsList(complaintData); // Set complaints list state
                setShowComplaints(true); // Show complaints table
            }
        } catch (err) {
            setErrorMessage('Error fetching complaint by email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleItineraryBooking = async (e) => {
        e.preventDefault();
        try {
            const result = await createTouristItinerary(email, bookingItineraryName);
            console.log('Itinerary booked:', result);
            alert('Itinerary booked successfully!');
            setBookingItineraryName(''); // Reset input
        } catch (error) {
            console.error('Error booking itinerary:', error);
            alert(error.message);
        }
    };

    const handleActivityBooking = async (e) => {
        e.preventDefault();
        try {
            const result = await createTouristActivity(email, bookingActivityName);
            console.log('Activity booked:', result);
            alert('Activity booked successfully!');
            setBookingActivityName(''); // Reset input
        } catch (error) {
            console.error('Error booking Activity:', error);
            alert(error.message);
        }
    };

    const handleItineraryCancelBooking = async (e) => {
        e.preventDefault();
        try {
            const result = await deleteTouristItenrary(email, cancelbookingItineraryName);
            console.log('Itinerary booking is canceled :', result);
            alert('Itinerary booking is canceled successfully!');
            setcancelBookingItineraryName(''); // Reset input
        } catch (error) {
            console.error('Error canceling booking itinerary:', error);
            alert(error.message);
        }
    };
    
    const handleActivityCancelBooking = async (e) => {
        e.preventDefault();
        try {
            const result = await deleteTouristActivity(email, cancelbookingActivityName);
            console.log('Activity booking is canceled :', result);
            alert('Activity booking is canceled successfully!');
            setcancelBookingActivityName(''); // Reset input
        } catch (error) {
            console.error('Error canceling booking Activity:', error);
            alert(error.message);
        }
    };

    const handleRedeemPoints = async () => {
        try {
            if (!email) {
                setMessage('Please enter a valid email.');
                return;
            }

            const data = await redeemPoints(email);
            setMessage(data.message || 'Points redeemed successfully!');
        } catch (error) {
            console.error('Error redeeming points:', error);
            setMessage(error.message || 'Failed to redeem points.');
        }
    };

    // Handle input changes for the form
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreferenceData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission to create preference
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createPreference(
                preferenceData.email,
                preferenceData.historicAreas,
                preferenceData.beaches,
                preferenceData.familyFriendly,
                preferenceData.shopping,
                preferenceData.budgetFriendly
            );
            setMessagee('Preference created successfully');
            console.log('Created preference:', response);
        } catch (error) {
            console.error('Error creating preference:', error);
            setMessagee('Error creating preference');
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
                        <Link to="/MyEvents">Events/Places</Link>
                        <Link to="/">Sign out</Link>

                    </ul>
                </nav>

                <nav className="signing">
                    <Link to="/TouristHome/TouristProfile">My Profile</Link>
                </nav>
            </div>

            {/* Search Section */}
            <div className="search flex items-center mb-4">
                <label 
                    htmlFor="search-bar" 
                    className="text-lg font-medium text-gray-700 mr-4"
                >
                    Search Events/Places:
                </label>
                <form 
                    onSubmit={handleSearch} 
                    className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                >
                    <input
                        id="search-bar"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                        className="p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="bg-brandBlue text-white py-2 px-4 hover:bg-blue-600 transition duration-300"
                    >
                        Search
                    </button>
                </form>
            </div>

            <Homet2 />


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
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
    <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6">
        
        {/* Submit a Comment on an Itinerary */}
        <div className="comment-form w-full md:w-1/2 bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit a Comment on an Itinerary</h2>
            <form onSubmit={handleCommentSubmit}>
                <div className="mb-4">
                    <label htmlFor="itinerary-name" className="block text-gray-700 font-medium mb-2">Itinerary Name:</label>
                    <input 
                        id="itinerary-name"
                        type="text"
                        value={itineraryName}
                        onChange={(e) => setItineraryName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">Comment:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment here..."
                        rows="4"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>

                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                    Submit Comment
                </button>
            </form>
        </div>

        {/* Rate an Itinerary */}
        <div className="rating-form w-full md:w-1/2 bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Rate an Itinerary</h2>
            <form onSubmit={handleItineraryRatingSubmit}>
                <div className="mb-4">
                    <label htmlFor="itinerary-name" className="block text-gray-700 font-medium mb-2">Itinerary Name:</label>
                    <input 
                        id="itinerary-name"
                        type="text"
                        value={itineraryName}
                        onChange={(e) => setItineraryName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="itinerary-rating" className="block text-gray-700 font-medium mb-2">Rating (1-5):</label>
                    <input 
                        id="itinerary-rating"
                        type="number"
                        value={itineraryRating}
                        onChange={(e) => setItineraryRating(e.target.value)}
                        min="1"
                        max="5"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                    Submit Rating
                </button>
            </form>
        </div>
    </div>
</div>



          
        {/* Rate a Tour Guide */}
<div className="tour-guide-rating-form w-full md:w-1/2 bg-gray-50 p-4 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Rate a Tour Guide</h2>
    <form onSubmit={handleTourGuideRatingSubmit}>
        <div className="mb-4">
            <label htmlFor="tour-guide-email" className="block text-gray-700 font-medium mb-2">Tour Guide Email:</label>
            <input 
                id="tour-guide-email"
                type="email"
                value={tourGuideEmail}
                onChange={(e) => setTourGuideEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="tour-guide-rating" className="block text-gray-700 font-medium mb-2">Rating:</label>
            <input 
                id="tour-guide-rating"
                type="number"
                value={tourGuideRating}
                onChange={(e) => setTourGuideRating(e.target.value)}
                placeholder="Rate from 1 to 5"
                required
                min="1"
                max="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-all duration-300"
        >
            Submit Rating
        </button>
    </form>
</div>
{/* Comment on a Tour Guide */}
<div className="tour-guide-comment-form w-full md:w-1/2 bg-gray-50 p-4 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Comment on a Tour Guide</h2>
    <form onSubmit={handleCommentSubmitt}>
        <div className="mb-4">
            <label htmlFor="tour-guide-email" className="block text-gray-700 font-medium mb-2">Tour Guide Email:</label>
            <input 
                id="tour-guide-email"
                type="email"
                value={tourGuideEmaill}
                onChange={(e) => setTourGuideEmaill(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="tour-guide-comment" className="block text-gray-700 font-medium mb-2">Comment:</label>
            <textarea 
                id="tour-guide-comment"
                value={commentt}
                onChange={(e) => setCommentt(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Write your comment here..."
            />
        </div>

        <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-all duration-300"
        >
            Submit Comment
        </button>
    </form>
    </div>

    <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit a Complaint</h2>
            <form onSubmit={handleComplaintSubmit}>
                <div className="mb-4">
                    <label htmlFor="complaint-title" className="block text-gray-700 font-medium mb-2">Title:</label>
                    <input
                        id="complaint-title"
                        type="text"
                        value={complaintTitle}
                        onChange={(e) => setComplaintTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="complaint-body" className="block text-gray-700 font-medium mb-2">Body:</label>
                    <textarea
                        id="complaint-body"
                        value={complaintBody}
                        onChange={(e) => setComplaintBody(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="4"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-all duration-300"
                >
                    Submit Complaint
                </button>
            </form>
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-all duration-300"
                onClick={handleFetchComplaintByEmail}
            >
                My Complaint
            </button>

            {/* Loading indicator */}
            {isLoading && <p>Loading complaints...</p>}

            {/* Error handling */}
            {errorMessage && <p>Error: {errorMessage}</p>}

            {/* No complaints found message */}
            {showComplaints && complaintsList.length === 0 && !isLoading && <p>No complaints found.</p>}

            {/* Display complaints in a table */}
            {showComplaints && complaintsList.length > 0 && (
                <table className="min-w-full border border-gray-200 mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Title</th>
                            <th className="border px-4 py-2">Body</th>
                            <th className="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaintsList.map((complaint) => (
                            <tr key={complaint._id}>
                                <td className="border px-4 py-2">{complaint.Title}</td>
                                <td className="border px-4 py-2">{complaint.Body}</td>
                                <td className="border px-4 py-2">{complaint.Status}</td>
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
         {/* Booking Section for Itineraries */}
         <div className="booking-form max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Book an Itinerary</h2>
            <form onSubmit={handleItineraryBooking}>
                
                <div className="mb-4">
                    <label htmlFor="booking-itinerary-name" className="block text-gray-700 font-medium mb-2">Itinerary Name:</label>
                    <input
                        id="booking-itinerary-name"
                        type="text"
                        value={bookingItineraryName}
                        onChange={(e) => setBookingItineraryName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                    Book Itinerary
                </button>
            </form>
        </div>
           {/* Booking Section for Activities */}
           <div className="booking-form max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Book an Activity</h2>
            <form onSubmit={handleActivityBooking}>
                
                <div className="mb-4">
                    <label htmlFor="booking-Activity-name" className="block text-gray-700 font-medium mb-2">Activity Name:</label>
                    <input
                        id="booking-Activity-name"
                        type="text"
                        value={bookingActivityName}
                        onChange={(e) => setBookingActivityName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                    Book Activity
                </button>
            </form>
        </div>
          {/* canceling Booking Section for Itineraries */}
          <div className="booking-form max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Cancel Booking Itinerary</h2>
            <form onSubmit={handleItineraryCancelBooking}>
                
                <div className="mb-4">
                    <label htmlFor="Cancelbooking-itinerary-name" className="block text-gray-700 font-medium mb-2">Itinerary Name:</label>
                    <input
                        id="Cancelbooking-itinerary-name"
                        type="text"
                        value={cancelbookingItineraryName}
                        onChange={(e) => setcancelBookingItineraryName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                   Cancel Booking Itinerary
                </button>
            </form>
        </div>

          {/* canceling Booking Section for Activities */}
          <div className="booking-form max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Cancel Booking Activity</h2>
            <form onSubmit={handleActivityCancelBooking}>
                
                <div className="mb-4">
                    <label htmlFor="Cancelbooking-Activity-name" className="block text-gray-700 font-medium mb-2">Activity Name:</label>
                    <input
                        id="Cancelbooking-Activity-name"
                        type="text"
                        value={cancelbookingActivityName}
                        onChange={(e) => setcancelBookingActivityName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                   Cancel Booking Activity
                </button>
            </form>
        </div>

        <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Redeem Points</h2>
            
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <button
                onClick={handleRedeemPoints}
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
            >
                Redeem Points
            </button>

            {/* Message Display */}
            {message && <p className="text-center mt-4 text-sm text-gray-700">{message}</p>}
        </div>

        <div>
            <h2>Create User Preference</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={preferenceData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Historic Areas:
                    <input
                        type="checkbox"
                        name="historicAreas"
                        checked={preferenceData.historicAreas}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Beaches:
                    <input
                        type="checkbox"
                        name="beaches"
                        checked={preferenceData.beaches}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Family Friendly:
                    <input
                        type="checkbox"
                        name="familyFriendly"
                        checked={preferenceData.familyFriendly}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Shopping:
                    <input
                        type="checkbox"
                        name="shopping"
                        checked={preferenceData.shopping}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Budget Friendly:
                    <input
                        type="checkbox"
                        name="budgetFriendly"
                        checked={preferenceData.budgetFriendly}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Create Preference</button>
            </form>
            {messagee && <p>{messagee}</p>}
        </div>


        
<footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="w-12" alt="Flowbite Logo" />
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

export default TouristHome;
