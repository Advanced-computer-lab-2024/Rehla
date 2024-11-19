import React, { useEffect, useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { getAttendedItineraries, getAttendedActivities, rateActivity, commentOnEvent, commentOnItinerary, rateItinerary } from '../services/api'; // Adjust the import based on your file structure
import logo from '../images/logo.png';

const MyEvents = () => {
    const [attendedItineraries, setAttendedItineraries] = useState([]);
    const [attendedActivities, setAttendedActivities] = useState([]);
    const [email, setEmail] = useState(''); 
    const [activityRatings, setActivityRatings] = useState({});
    const [activityComments, setActivityComments] = useState({});
    const [itineraryRatings, setItineraryRatings] = useState({});
    const [itineraryComments, setItineraryComments] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itinerariesResponse = await getAttendedItineraries(email);
                setAttendedItineraries(itinerariesResponse.attendedItineraries);

                const activitiesResponse = await getAttendedActivities(email);
                setAttendedActivities(activitiesResponse.attendedActivities);
            } catch (error) {
                console.error('Error fetching attended events:', error);
            }
        };

        fetchData();
    }, [email]);

    const handleRatingChange = (setRatingState, name, rating) => {
        setRatingState((prevRatings) => ({
            ...prevRatings,
            [name]: rating
        }));
    };

    const handleCommentChange = (setCommentState, name, comment) => {
        setCommentState((prevComments) => ({
            ...prevComments,
            [name]: comment
        }));
    };

    const handleRate = async (rateFunction, name, ratingState) => {
        const rating = ratingState[name];
        if (rating) {
            try {
                await rateFunction(email, name, rating);
                alert('Rating submitted successfully!');
            } catch (error) {
                console.error('Error rating:', error);
            }
        } else {
            alert('Please enter a rating.');
        }
    };

    const handleComment = async (commentFunction, name, commentState) => {
        const comment = commentState[name];
        if (comment) {
            try {
                await commentFunction(email, name, comment);
                alert('Comment submitted successfully!');
            } catch (error) {
                console.error('Error commenting:', error);
            }
        } else {
            alert('Please enter a comment.');
        }
    };

    const handleEventClick = (name, type) => {
        localStorage.setItem('selectedName', name); // Save the name in local storage
        localStorage.setItem('selectedType', type); // Save the type (e.g., "itinerary" or "activity") in local storage
        navigate(`/event-details/${type}/${name}`); // Redirect to the new component
    };

    return (
        <div className="bg-white shadow-md">
            <div className="w-full mx-auto px-6 py-4 h-20 bg-brandBlue shadow flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-20" />
                <nav className="flex space-x-6">
                    <Link to="/TouristHome" className="text-lg font-medium text-white-700 hover:text-blue-500">
                        Home
                    </Link>
                </nav>
                <nav className="signing">
                    <Link to="/TouristHome/TouristProfile">My Profile</Link>
                </nav>
            </div>

            {/* Display Attended Itineraries */}
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">Itineraries</h2>
                <ul className="flex flex-wrap list-none">
                    {attendedItineraries.map(itinerary => (
                            <li
                            key={itinerary.Itinerary_Name}
                            className="flex items-start mb-4 w-1/2 p-2 cursor-pointer"
                            onClick={() => handleEventClick(itinerary.Itinerary_Name, 'itinerary')}
                        >
                            <div className="flex items-start bg-gray-100 p-4 rounded-lg shadow-md w-full">
                                <img
                                    src={itinerary.Picture}
                                    alt={itinerary.Itinerary_Name}
                                    className="w-32 h-32 object-cover mr-4 rounded"
                                />
                                <div className="flex-1">
                                    <span className="font-medium text-lg">{itinerary.Itinerary_Name}</span> - 
                                    <span className={`font-medium ${itinerary.Attended ? 'text-green-500' : 'text-red-500'}`}>
                                        {itinerary.Attended ? ' Attended' : ' Not Attended'}
                                    </span>
                                </div>
                                {itinerary.Attended && (
                                    <div className="flex flex-col ml-4">
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            placeholder="Rate (1-5)"
                                            className="border border-gray-300 rounded-md p-2 mb-2"
                                            onChange={(e) => handleRatingChange(setItineraryRatings, itinerary.Itinerary_Name, e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Comment"
                                            className="border border-gray-300 rounded-md p-2 mb-2"
                                            onChange={(e) => handleCommentChange(setItineraryComments, itinerary.Itinerary_Name, e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleRate(rateItinerary, itinerary.Itinerary_Name, itineraryRatings)}
                                            className="bg-brandBlue text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition"
                                        >
                                            Submit Rating
                                        </button>
                                        <button
                                            onClick={() => handleComment(commentOnItinerary, itinerary.Itinerary_Name, itineraryComments)}
                                            className="bg-logoOrange text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition mt-2"
                                        >
                                            Submit Comment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Display Attended Activities */}
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">Activities</h2>
                <ul className="flex flex-wrap list-none">
                    {attendedActivities.map(activity => (
                            <li
                            key={activity.Activity_Name}
                            className="flex items-start mb-4 w-1/2 p-2 cursor-pointer"
                            onClick={() => handleEventClick(activity.Activity_Name, 'activity')}
                        >
                            <div className="flex items-start bg-gray-100 p-4 rounded-lg shadow-md w-full">
                                <img
                                    src={activity.Picture}
                                    alt={activity.Activity_Name}
                                    className="w-32 h-32 object-cover mr-4 rounded"
                                />
                                <div className="flex-1">
                                    <span className="font-medium text-lg">{activity.Activity_Name}</span> - 
                                    <span className={`font-medium ${activity.Attended ? 'text-green-500' : 'text-red-500'}`}>
                                        {activity.Attended ? ' Attended' : ' Not Attended'}
                                    </span>
                                </div>
                                {activity.Attended && (
                                    <div className="flex flex-col ml-4">
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            placeholder="Rate (1-5)"
                                            className="border border-gray-300 rounded-md p-2 mb-2"
                                            onChange={(e) => handleRatingChange(setActivityRatings, activity.Activity_Name, e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Comment"
                                            className="border border-gray-300 rounded-md p-2 mb-2"
                                            onChange={(e) => handleCommentChange(setActivityComments, activity.Activity_Name, e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleRate(rateActivity, activity.Activity_Name, activityRatings)}
                                            className="bg-brandBlue text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition"
                                        >
                                            Submit Rating
                                        </button>
                                        <button
                                            onClick={() => handleComment(commentOnEvent, activity.Activity_Name, activityComments)}
                                            className="bg-logoOrange text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition mt-2"
                                        >
                                            Submit Comment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyEvents;
