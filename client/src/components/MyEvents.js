import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAttendedItineraries, getAttendedActivities, getPaidActivities, getPastPaidActivities,getPaidItineraries, getPastPaidItineraries,
    getAllNotifications ,markAsSeen,getTouristProfile
 } from '../services/api'; // Adjust the import based on your file structure
import logo from '../images/logoWhite.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';

const MyEvents = () => {
    const [attendedItineraries, setAttendedItineraries] = useState([]);
    const [attendedActivities, setAttendedActivities] = useState([]);
    const [paidActivities, setPaidActivities] = useState([]);
    const [pastPaidActivities, setPastPaidActivities] = useState([]);
    const [paidItineraries, setPaidItineraries] = useState([]);
    const [pastPaidItineraries, setPastPaidItineraries] = useState([]);
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [formData, setFormData] = useState({
        Email: '',
        Username: '',
        Password: '',
        Mobile_Number: '',
        Nationality: '',
        Job_Student: '',
        Type: '',
        Points: 0, 
        Badge: '',
      });

      const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const email = localStorage.getItem('email');
            const profileData = await getTouristProfile({ Email: email });
            //setTourist(profileData);
            setFormData(profileData);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        };
        fetchProfile();
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

        if (email) fetchData();
    }, [email]);

    const handlePaidActivitiesFetch = async () => {
        try {
            const response = await getPaidActivities(email);
            setPaidActivities(response.activities);
        } catch (error) {
            console.error('Error fetching paid activities:', error);
        }
    };

    const handlePastPaidActivitiesFetch = async () => {
        try {
            const response = await getPastPaidActivities(email);
            setPastPaidActivities(response.activities);
        } catch (error) {
            console.error('Error fetching past paid activities:', error);
        }
    };
    const handlePaidItinerariesFetch = async () => {
        try {
            const response = await getPaidItineraries(email);
            setPaidItineraries(response.itineraries);
        } catch (error) {
            console.error('Error fetching paid itineraries:', error);
        }
    };

    const handlePastPaidItinerariesFetch = async () => {
        try {
            const response = await getPastPaidItineraries(email);
            setPastPaidItineraries(response.itineraries);
        } catch (error) {
            console.error('Error fetching past paid itineraries:', error);
        }
    };

    const handleEventClick = (name, type, attendedStatus) => {
        localStorage.setItem('selectedName', name);
        localStorage.setItem('selectedType', type);
        localStorage.setItem('attendedStatus', attendedStatus);
        navigate(`/event-details/${type}/${name}?attendedStatus=${attendedStatus}`);
    };
    const handleNotificationClick = async () => {
        setShowModal(true); // Show the modal when the notification icon is clicked
    
        try {
            const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
            if (!storedEmail) {
                throw new Error("User email not found in local storage.");
            }
    
            // Mark all unseen notifications for the user as seen
            for (const notification of notifications) {
                if (!notification.seen) {
                    await markAsSeen(notification._id); // Mark as seen
                }
            }
    
            // Refresh the notifications for the signed-in user
            const updatedNotifications = await getAllNotifications(storedEmail);
            setNotifications(updatedNotifications); // Set updated notifications
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };

    return (
        <div className="bg-white shadow-md">
              <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Search Form */}
                    <div className="flex items-center ml-auto">
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/Cart">
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </Link>
                        </nav>
                        {/* Notification Icon */}
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <div className="relative ml-2"> {/* Reduced ml-4 to ml-2 */}
                                <FontAwesomeIcon
                                    icon={faBell}
                                    size="1x" // Increased the size to 2x
                                    onClick={handleNotificationClick}
                                    className="cursor-pointer text-white" // Added text-white to make the icon white
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </nav>
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/TouristHome/TouristProfile">
                                {/* Profile Picture */}
                                <div className="">
                                    {formData.Profile_Pic ? (
                                        <img
                                            src={formData.Profile_Pic}
                                            alt={`${formData.Name}'s profile`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-black text-white text-center flex items-center justify-center border-4 border-white">
                                            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </nav>
                    </div>


                </div>

                {/* Main Navigation */}
                <nav className="flex space-x-6">
                    <Link to="/" className="text-lg font-medium text-logoOrange ">
                        Home
                    </Link>
                    <Link to="/upcomingActivities" className="text-lg font-medium text-white hover:text-logoOrange">
                        Activities
                    </Link>
                    <Link to="/UpcomingItineraries" className="text-lg font-medium text-white hover:text-logoOrange">
                        Itineraries
                    </Link>
                    <Link to="/HistoricalPlaces" className="text-lg font-medium text-white hover:text-logoOrange">
                        Historical Places
                    </Link>
                    <Link to="/Museums" className="text-lg font-medium text-white hover:text-logoOrange">
                        Museums
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-white hover:text-logoOrange">
                        Gift Shop
                    </Link>
                    <Link to="/MyEvents" className="text-lg font-medium text-white hover:text-logoOrange">
                        MyEvents
                    </Link>
                    <Link to="/Flights" className="text-lg font-medium text-white hover:text-logoOrange">
                        Flights
                    </Link>
                    <Link to="/Hotels" className="text-lg font-medium text-white hover:text-logoOrange">
                        Hotels
                    </Link>
                </nav>            
            </div>

           {/* Display Itineraries as Cards */}
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">Itineraries</h2>
                <div className="flex overflow-x-auto scrollbar-hide gap-6">
                    {attendedItineraries.map((itinerary) => (
                        <div
                            key={itinerary.Itinerary_Name}
                            className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                            onClick={() => handleEventClick(itinerary.Itinerary_Name, 'itinerary', itinerary.Attended)}
                        >
                            <img
                                src={itinerary.Picture}
                                alt={itinerary.Itinerary_Name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <div className="text-lg font-semibold text-gray-800">{itinerary.Itinerary_Name}</div>
                                <div className="text-sm text-gray-600 mt-2">
                                    <span className={`font-medium ${itinerary.Attended ? 'text-green-500' : 'text-red-500'}`}>
                                        {itinerary.Attended ? 'Attended' : 'Not Attended'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Display Attended Activities as Cards */}
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">Activities</h2>
                <div className="flex overflow-x-auto scrollbar-hide gap-6">
                    {attendedActivities.map((activity) => (
                        <div
                            key={activity.Activity_Name}
                            className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                            onClick={() => handleEventClick(activity.Activity_Name, 'activity', activity.Attended)}
                        >
                            <img
                                src={activity.Picture}
                                alt={activity.Activity_Name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <div className="text-lg font-semibold text-gray-800">{activity.Activity_Name}</div>
                                <div className="text-sm text-gray-600 mt-2">
                                    <span className={`font-medium ${activity.Attended ? 'text-green-500' : 'text-red-500'}`}>
                                        {activity.Attended ? 'Attended' : 'Not Attended'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Buttons to Fetch Activities */}
            <div className="px-6 py-4">
                <button
                    onClick={handlePaidActivitiesFetch}
                    className="bg-brandBlue text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                    Show Paid Activities
                </button>
                <button
                    onClick={handlePastPaidActivitiesFetch}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    Show Past Paid Activities
                </button>
                <button
                    onClick={handlePaidItinerariesFetch}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 mr-2"
                >
                    Show Paid Itineraries
                </button>
                <button
                    onClick={handlePastPaidItinerariesFetch}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                    Show Past Paid Itineraries
                </button>
            </div>

           {/* Display Paid Activities as Cards */}
                {paidActivities.length > 0 && (
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold mb-4">Paid Activities</h2>
                        <div className="flex overflow-x-auto scrollbar-hide gap-6">
                            {paidActivities.map((activity) => (
                                <div
                                    key={activity.Activity_Name}
                                    className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                                    onClick={() => handleEventClick(activity.Activity_Name, 'activity')}
                                >
                                    {/* Image Section */}
                                    <img
                                        src={activity.Picture}
                                        alt={activity.Activity_Name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div className="text-lg font-semibold text-gray-800">{activity.Activity_Name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display Past Paid Activities as Cards */}
                {pastPaidActivities.length > 0 && (
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold mb-4">Past Paid Activities</h2>
                        <div className="flex overflow-x-auto scrollbar-hide gap-6">
                            {pastPaidActivities.map((activity) => (
                                <div
                                    key={activity.Activity_Name}
                                    className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                                    onClick={() => handleEventClick(activity.Activity_Name, 'activity')}
                                >
                                    {/* Image Section */}
                                    <img
                                        src={activity.Picture}
                                        alt={activity.Activity_Name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div className="text-lg font-semibold text-gray-800">{activity.Activity_Name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display Paid Itineraries as Cards */}
                {paidItineraries.length > 0 && (
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold mb-4">Paid Itineraries</h2>
                        <div className="flex overflow-x-auto scrollbar-hide gap-6">
                            {paidItineraries.map((itinerary) => (
                                <div
                                    key={itinerary.Itinerary_Name}
                                    className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                                    onClick={() => handleEventClick(itinerary.Itinerary_Name, 'itinerary')}
                                >
                                    {/* Image Section */}
                                    <img
                                        src={itinerary.Picture}
                                        alt={itinerary.Itinerary_Name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div className="text-lg font-semibold text-gray-800">{itinerary.Itinerary_Name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display Past Paid Itineraries as Cards */}
                {pastPaidItineraries.length > 0 && (
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold mb-4">Past Paid Itineraries</h2>
                        <div className="flex overflow-x-auto scrollbar-hide gap-6">
                            {pastPaidItineraries.map((itinerary) => (
                                <div
                                    key={itinerary.Itinerary_Name}
                                    className="card w-96 h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                                    onClick={() => handleEventClick(itinerary.Itinerary_Name, 'itinerary')}
                                >
                                    {/* Image Section */}
                                    <img
                                        src={itinerary.Picture}
                                        alt={itinerary.Itinerary_Name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div className="text-lg font-semibold text-gray-800">{itinerary.Itinerary_Name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


        </div>
    );
};

export default MyEvents;
