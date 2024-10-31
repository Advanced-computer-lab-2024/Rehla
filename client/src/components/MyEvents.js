import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAttendedItineraries, getAttendedActivities, rateActivity, commentOnEvent } from '../services/api'; // Adjust the import based on your file structure
import logo from '../images/logo.png';

const MyEvents = () => {
    const [attendedItineraries, setAttendedItineraries] = useState([]);
    const [attendedActivities, setAttendedActivities] = useState([]);
    const [email, setEmail] = useState(''); 
    const [ratings, setRatings] = useState({}); // Store ratings for each activity
    const [comments, setComments] = useState({}); // Store comments for each activity

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

    const handleRatingChange = (activityName, rating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [activityName]: rating
        }));
    };

    const handleCommentChange = (activityName, comment) => {
        setComments((prevComments) => ({
            ...prevComments,
            [activityName]: comment
        }));
    };

    const handleRateActivity = async (activityName) => {
        const rating = ratings[activityName];
        if (rating) {
            try {
                await rateActivity(email, activityName, rating);
                alert('Rating submitted successfully!');
            } catch (error) {
                console.error('Error rating activity:', error);
            }
        } else {
            alert('Please enter a rating.');
        }
    };

    const handleCommentOnActivity = async (activityName) => {
        const comment = comments[activityName];
        if (comment) {
            try {
                await commentOnEvent(email, activityName, comment);
                alert('Comment submitted successfully!');
            } catch (error) {
                console.error('Error commenting on event:', error);
            }
        } else {
            alert('Please enter a comment.');
        }
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
                <ul className="list-disc ml-5">
                    {attendedItineraries.map(itinerary => (
                        <li key={itinerary.Itinerary_Name}>
                            {itinerary.Itinerary_Name} - Attended: {itinerary.Attended ? 'Yes' : 'No'}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Display Attended Activities */}
            <div className="px-6 py-4">
    <h2 className="text-xl font-semibold mb-4">Activities</h2>
    <ul className="flex flex-wrap list-none">
        {attendedActivities.map(activity => (
            <li key={activity.Activity_Name} className="flex items-start mb-4 w-1/2 p-2"> {/* Each item takes half the width */}
                <div className="flex items-start bg-gray-100 p-4 rounded-lg shadow-md w-full"> {/* Full width for inner container */}
                    <img
                        src={activity.Picture}
                        alt={activity.Activity_Name}
                        className="w-32 h-32 object-cover mr-4 rounded" // Adjust size as needed
                    />
                    <div className="flex-1">
                        <span className="font-medium text-lg">{activity.Activity_Name}</span> - 
                        <span className={`font-medium ${activity.Attended ? 'text-green-500' : 'text-red-500'}`}>
                            {activity.Attended ? ' Attended' : ' Not Attended'}
                        </span>
                    </div>
                    {activity.Attended && ( // Only show inputs if attended
                        <div className="flex flex-col ml-4">
                            <input
                                type="number"
                                min="1"
                                max="5"
                                placeholder="Rate (1-5)"
                                className="border border-gray-300 rounded-md p-2 mb-2"
                                onChange={(e) => handleRatingChange(activity.Activity_Name, e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Comment"
                                className="border border-gray-300 rounded-md p-2 mb-2"
                                onChange={(e) => handleCommentChange(activity.Activity_Name, e.target.value)}
                            />
                            <button
                                onClick={() => handleRateActivity(activity.Activity_Name)}
                                className="bg-brandBlue text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition"
                            >
                                Submit Rating
                            </button>
                            <button
                                onClick={() => handleCommentOnActivity(activity.Activity_Name)}
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
