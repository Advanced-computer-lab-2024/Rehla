
import React, { useEffect, useState } from "react";
import {
  readActivity,
  getItineraryByName,
  rateActivity,
  rateItinerary,
  commentOnEvent,
  commentOnItinerary,
  rateTourGuide,
  commentTourGuide,
  deleteTouristItenrary,
  deleteTouristActivity,getAllNotifications ,markAsSeen,getTouristProfile
} from "../services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from '../images/logoWhite.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';

const EventDetails = () => {
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
  const [notifications, setNotifications] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [attendedStatus, setAttendedStatus] = useState(null);

  const [tourGuideEmail, setTourGuideEmail] = useState("");
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState("");
  const [errorTourGuide, setErrorTourGuide] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
    const params = new URLSearchParams(location.search);
    const attended = params.get("attendedStatus");
    setAttendedStatus(attended === "true");
  }, [location]);

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

  const fetchDetails = async () => {
    try {
      const selectedName = localStorage.getItem("selectedName");
      const selectedType = localStorage.getItem("selectedType");
      const selectedStatus = localStorage.getItem("attendedStatus");
      setName(selectedName);
      setType(selectedType);
      setAttendedStatus(selectedStatus === "true");
     

      if (selectedType === "activity") {
        const response = await readActivity(selectedName);
        setDetails(response?.data || {});
      } else if (selectedType === "itinerary") {
        const response = await getItineraryByName(selectedName);
        setDetails(response?.data || response?.itinerary || response || {});
        setTourGuideEmail(details.Created_By ) ;
      } else {
        throw new Error("Invalid type provided");
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  useEffect(() => {
    fetchDetails();
    
  }, []);

  const handleCancelBooking = async (e, isItinerary) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("No email found. Please log in again.");
        return;
      }

      if (isItinerary) {
        await deleteTouristItenrary(email, name);
        alert("Itinerary booking canceled successfully!");
      } else {
        await deleteTouristActivity(email, name);
        alert("Activity booking canceled successfully!");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error.message);
    }
  };

  const handleSubmitRating = async () => {
    if (rating > 0) {
      try {
        if (type === "activity") {
          await rateActivity(email, name, rating);
        } else if (type === "itinerary") {
          await rateItinerary(email, name, rating);
        }
        alert("Rating submitted successfully!");
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    } else {
      alert("Please select a rating before submitting.");
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      if (type === "activity") {
        await commentOnEvent(email, name, comment);
      } else if (type === "itinerary") {
        await commentOnItinerary(email, name, comment);
      }
      alert("Comment submitted successfully!");
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleTourGuideRatingSubmit = async () => {

    if (tourGuideRating <= 0) {
      alert("Please select a rating for the tour guide.");
      return;
    }
  
    try {
      await rateTourGuide(email, details.Created_By, tourGuideRating);
      alert("Tour guide rating submitted successfully!");
      setTourGuideRating(0); // Reset the rating
      setErrorTourGuide(""); // Clear any previous error message
    } catch (error) {
      console.error("Error submitting tour guide rating:", error);
      setErrorTourGuide("Failed to submit tour guide rating. Please try again.");
      alert("Failed to submit tour guide rating. Please try again.");
    }
  };
  
  const handleTourGuideCommentSubmit = async () => {
  
  
    if (!tourGuideComment.trim()) {
      alert("Please enter a comment for the tour guide.");
      return;
    }
  
    try {
      await commentTourGuide(email, details.Created_By, tourGuideComment);
      alert("Tour guide comment submitted successfully!");
      setTourGuideComment(""); // Clear the comment input
      setErrorTourGuide(""); // Clear any previous error message
    } catch (error) {
      console.error("Error submitting tour guide comment:", error);
      setErrorTourGuide("Failed to submit tour guide comment. Please try again.");
      alert("Failed to submit tour guide comment. Please try again.");
    }
  };
  const renderStars = (currentRating, onClickHandler) => {
    const maxRating = 5;

    return (
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => (
          <span
            key={index}
            className={`text-3xl cursor-pointer ${
              index < currentRating ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => onClickHandler(index + 1)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!details) return <div>Loading...</div>;

  return (
    <div>
    <div className="min-h-screen flex flex-col items-center">
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

      <main className="flex-grow flex items-center justify-center mt-32 w-full">
        <div className="p-6 bg-white shadow-lg rounded-lg w-3/4 flex flex-col lg:flex-row">
          <div className="lg:w-1/3 flex-shrink-0 flex flex-col items-center">
            <img
              src={details.Picture}
              alt={details.Name || "Image"}
              className="w-72 h-72 object-cover rounded"
            />
            {attendedStatus !== null && (
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Status: {attendedStatus ? "Attended" : "Not Attended"}
                </h2>
              </div>
            )}
          </div>
          <div className="lg:w-2/3 lg:pl-6">
            <h1 className="text-4xl font-bold mb-6 text-left text-gray-800">
              {type === "activity" ? details.Name : details.Itinerary_Name}
            </h1>
            <p className="text-gray-700 mb-4 text-lg">
              <span className="font-semibold">Duration:</span>{" "}
              {details.Duration || "N/A"}
            </p>
            <p className="text-gray-700 mb-4 text-lg">
              <span className="font-semibold">Created By:</span>{" "}
              {details.Created_By || "N/A"}
            </p>
            <div className="mt-6">
              <p className="text-xl font-bold text-gray-800">
                Price: {details.Price || details.Tour_Price || "N/A"}{" "}
                {details.Currency || "USD"}
              </p>

              {!attendedStatus && (
                <div className="mt-6">
                  {type === "activity" && (
                    <button
                      onClick={(e) => handleCancelBooking(e, false)}
                      className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {type === "itinerary" && (
                    <button
                      onClick={(e) => handleCancelBooking(e, true)}
                      className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Cancel Itinerary Booking
                    </button>
                  )}
                </div>
              )}

              {attendedStatus && (
                <>
                  <div className="mt-6">
                    <p className="text-xl font-bold text-gray-800">
                      Rate this Event:
                    </p>
                    {renderStars(rating, setRating)}
                    <button
                      onClick={handleSubmitRating}
                      className="mt-4 bg-black text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
                    >
                      Submit Rating
                    </button>
                  </div>
                  <div className="mt-6">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-lg"
                      placeholder="Leave a comment..."
                    />
                    <button
                      onClick={handleSubmitComment}
                      className="mt-4 bg-black text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
                    >
                      Submit Comment
                    </button>
                  </div>

                  <div className="mt-6">
                    <p className="text-xl font-bold text-gray-800">
                      Rate Tour Guide:
                    </p>
                    {renderStars(tourGuideRating, setTourGuideRating)}
                    <button
                      onClick={handleTourGuideRatingSubmit}
                      className="mt-4 bg-black text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
                    >
                      Submit Tour Guide Rating
                    </button>
                  </div>
                  <div className="mt-6">
                    <textarea
                      value={tourGuideComment}
                      onChange={(e) =>
                        setTourGuideComment(e.target.value)
                      }
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-lg"
                      placeholder="Leave a comment for the tour guide..."
                    />
                    <button
                      onClick={handleTourGuideCommentSubmit}
                      className="mt-4 bg-black text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
                    >
                      Submit Tour Guide Comment
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    <footer className="bg-black shadow dark:bg-black m-0 mt-10">
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

export default EventDetails;
