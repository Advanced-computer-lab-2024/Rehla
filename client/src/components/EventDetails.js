
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
  deleteTouristActivity
} from "../services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";

const EventDetails = () => {
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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
    const params = new URLSearchParams(location.search);
    const attended = params.get("attendedStatus");
    setAttendedStatus(attended === "true");
  }, [location]);

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
      <header className="NavBar flex items-center justify-between p-4 bg-brandBlue shadow-md w-full">
        <img src={logo} alt="Logo" className="h-12" />
        <nav className="main-nav">
          <ul className="nav-links flex space-x-6">
            <Link to="/TouristHome" className="text-white font-medium hover:underline">
              Home
            </Link>
          </ul>
        </nav>
        <nav className="signing">
          <Link
            to="/TourGuideHome/TourGuideProfile"
            className="text-white font-medium hover:underline"
          >
            My Profile
          </Link>
        </nav>
      </header>

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
                      className="mt-4 bg-brandBlue text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
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
                      className="mt-4 bg-brandBlue text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
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
                      className="mt-4 bg-brandBlue text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
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
                      className="mt-4 bg-brandBlue text-white py-2 px-6 rounded-lg hover:bg-logoOrange transition duration-200"
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
    <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0 mt-10">
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
