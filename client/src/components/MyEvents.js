import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAttendedItineraries, getAttendedActivities } from '../services/api'; // Adjust the import based on your file structure
import logo from '../images/logo.png';

const MyEvents = () => {
    const [attendedItineraries, setAttendedItineraries] = useState([]);
    const [attendedActivities, setAttendedActivities] = useState([]);
    const [email, setEmail] = useState(''); 
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

    const handleEventClick = (name, type, attendedStatus) => {
        // Save the name, type, and attended status in local storage
        localStorage.setItem('selectedName', name); 
        localStorage.setItem('selectedType', type); 
        localStorage.setItem('attendedStatus', attendedStatus); // Save attended status
        navigate(`/event-details/${type}/${name}`); // Redirect to the event details page
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
                            onClick={() => handleEventClick(itinerary.Itinerary_Name, 'itinerary', itinerary.Attended)}
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
                            onClick={() => handleEventClick(activity.Activity_Name, 'activity', activity.Attended)}
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
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyEvents;
