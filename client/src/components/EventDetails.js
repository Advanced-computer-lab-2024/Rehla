import React, { useEffect, useState } from "react";
import {
  readActivity,
  getItineraryByName,
  rateActivity,
  rateItinerary,
  commentOnEvent,
  commentOnItinerary,
} from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

const EventDetails = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    const fetchDetails = async () => {
      try {
        const selectedName = localStorage.getItem("selectedName");
        const selectedType = localStorage.getItem("selectedType");
        setName(selectedName);
        setType(selectedType);

        if (selectedType === "activity") {
          const response = await readActivity(selectedName);
          setDetails(response?.data || {});
        } else if (selectedType === "itinerary") {
          const response = await getItineraryByName(selectedName);
          setDetails(response?.data || response?.itinerary || response || {});
        } else {
          throw new Error("Invalid type provided");
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    fetchDetails();
  }, []);

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
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
        //alert("Failed to submit rating. Please try again.");
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
      alert("Failed to submit comment. Please try again.");
    }
  };

  const renderStars = () => {
    const maxRating = 5;

    return (
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => (
          <span
            key={index}
            className={`text-3xl cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => handleRatingChange(index + 1)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!details) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header Section */}
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
          <Link to="/TourGuideHome/TourGuideProfile" className="text-white font-medium hover:underline">
            My Profile
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center mt-32 w-3/4">
        <div className="p-6 bg-white shadow-lg rounded-lg w-3/4 flex flex-col lg:flex-row">
          <div className="lg:w-1/3 flex-shrink-0">
            <img
              src={details.Picture}
              alt={details.Name || "Image"}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="lg:w-2/3 lg:pl-6">
            <h1 className="text-4xl font-bold mb-6 text-left text-gray-800">
              {type === "activity" ? details.Name : details.Itinerary_Name}
            </h1>
            <p className="text-gray-700 mb-4 text-lg">
              <span className="font-semibold">Duration:</span> {details.Duration || "N/A"}
            </p>
            <p className="text-gray-700 mb-4 text-lg">
              <span className="font-semibold">Created By:</span> {details.Created_By || "N/A"}
            </p>
            <div className="mt-6">
              <p className="text-xl font-bold text-gray-800">
                Price: {details.Price || details.Tour_Price || "N/A"} {details.Currency || "USD"}
              </p>
              <div className="mt-6">
                <p className="text-xl font-bold text-gray-800">Rate this Event:</p>
                {renderStars()}
                <button
                  onClick={handleSubmitRating}
                  className="mt-4 bg-brandBlue text-white py-2 px-4 rounded hover:bg-logoOrange"
                >
                  Submit Rating
                </button>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800">Leave a Comment:</h2>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                  placeholder="Write your comment here..."
                />
                <button
                  onClick={handleSubmitComment}
                  className="mt-4 bg-logoOrange text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-brandBlue shadow py-6 w-full">
        <div className="w-full mx-auto flex flex-col items-center space-y-6">
          <a href="/" className="flex items-center space-x-3">
            <img src={logo} className="w-12" alt="Logo" />
          </a>
          <ul className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Licensing
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
          <p className="text-sm text-gray-500">© 2023 Rehla™. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventDetails;
