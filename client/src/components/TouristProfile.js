import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTouristProfile, updateTouristProfile, uploadProfilePicture , requestDeleteProfile
  ,addDeliveryAddress,viewComplaintByEmail,createComplaint,viewSavedActivities,viewSavedItineraries,createPreference,
  redeemPoints, getAllNotifications, markAsSeen, searchEventsPlaces
} from '../services/api'; // Import your new upload function
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faBell  } from '@fortawesome/free-solid-svg-icons';

import Level1 from '../images/Level1.jpg';
import Level2 from '../images/Level2.jpg';
import Level3 from '../images/Level3.jpg';
import { Point } from 'leaflet';

const getBadgeImage = (Badge) => {
  if (Badge === "Level 1") {
    return Level1;
  } else if (Badge === "Level 2") {
    return Level2;
  } else {
    return Level3;
  }
};


const TouristProfile = () => {
  const navigate = useNavigate();
  const [tourist, setTourist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const badgeImage = getBadgeImage(formData.Badge);
  const [message, setMessage] = useState('');

  const [address,setAddress]=useState('');
  const [succes,setSuccess]=useState('');
  const [errornew,setErrornew]=useState('');
  const [email, setEmail] = useState('');

  const[addresssection , setaddresssection] = useState('');
  const[complaintsection , setcomplaintsection] = useState('');
  const[prefsection , setprefsection] = useState('');
  const[pointssection , setpointssection] = useState('');

  const [complaintsList, setComplaintsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showComplaints, setShowComplaints] = useState(false); 
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintBody, setComplaintBody] = useState('');
  const [error, setError] = useState(null);

  const [notifications, setNotifications] = useState([]); // State for notifications
  const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [isSearched, setIsSearched] = useState(false);

     // bto3 el view activity
 const [succesViewActivity,setSuccessViewActivity]=useState('');
 const [errorViewActivity,setErrorViewActivity]=useState('');
 const [activity, setActivity] = useState([]);
        // bto3 el view itinerary
 const [succesViewItinerary,setSuccessViewItinerary]=useState('');
 const [errorViewItinerary,setErrorViewItinerary]=useState('');
 const [itinerary, setItinerary] = useState([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isaddressModalOpen, setIsaddressModalOpen] = useState(false);

 const [preferenceData, setPreferenceData] = useState({
  email: '',
  historicAreas: false,
  beaches: false,
  familyFriendly: false,
  shopping: false,
  budgetFriendly: false
});
const [messagee, setMessagee] = useState('');
const [pointsToRedeem, setPointsToRedeem] = useState('');

   // Handle form submission to create preference
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const email = localStorage.getItem('email');
        const response = await createPreference(
            email,
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


useEffect(()=>{
     const handleViewSavedActivities = async (e) => {
     // e.preventDefault(); // Prevent default form submission
  
      try {
          // Call the viewSavedActivities API function with the necessary email
          const email = localStorage.getItem('email');
          const response = await viewSavedActivities(email); 
          
          // On success, update the activity list and the success message
          setActivity(response.activities);
          setSuccessViewActivity(`Successfully fetched saved activities for ${email}`);
          setErrorViewActivity('');  // Clear any previous error message
      } catch (error) {
          // Handle errors, log them, and update the error message
          console.error('Failed to fetch saved activities:', error);
  
          if (error.response && error.response.data && error.response.data.message) {
              // Use the error message returned from the server, if available
              setErrorViewActivity(`Error: ${error.response.data.message}`);
          } else {
              // Fallback to a generic error message
              setErrorViewActivity('Failed to fetch saved activities. Please try again.');
          }
      }
  }; handleViewSavedActivities();
} ,[]);


useEffect(()=> {
  const handleViewSavedItineraries = async (e) => {
      //e.preventDefault(); // Prevent default form submission
  
      try {
          // Call the viewSavedItineraries API function with the necessary email
          const email = localStorage.getItem('email');
          const response = await viewSavedItineraries(email); 
          
          // On success, update the itinerary list and the success message
          setItinerary(response.itineraries);
          setSuccessViewItinerary(`Successfully fetched saved itineraries for ${email}`);
          setErrorViewItinerary('');  // Clear any previous error message
      } catch (error) {
          // Handle errors, log them, and update the error message
          console.error('Failed to fetch saved itineraries:', error);
  
          if (error.response && error.response.data && error.response.data.message) {
              // Use the error message returned from the server, if available
              setErrorViewItinerary(`Error: ${error.response.data.message}`);
          } else {
              // Fallback to a generic error message
              setErrorViewItinerary('Failed to fetch saved itineraries. Please try again.');
          }
      }
  }; handleViewSavedItineraries();
},[]);

const handleaddress = async ()=>{
        setaddresssection(true);
        setcomplaintsection(false);
        setprefsection(false);
        setpointssection(false);
}

const handlecomplaints = async ()=>{
      setcomplaintsection(true);
      setaddresssection(false);
      setprefsection(false);
      setpointssection(false);
}

const handlepreference = async ()=>{
    setprefsection(true);
    setaddresssection(false);
    setcomplaintsection(false);
    setpointssection(false);
}

const handlepoints =async()=>{
  setprefsection(false);
  setaddresssection(false);
  setcomplaintsection(false);
  setpointssection(true);

}

const handleActivityClick = (activity) => {
    navigate(`/activity-details/${encodeURIComponent(activity.Name)}`); // Encode to make the URL safe
};

const handleItineraryClick = (itinerary) => {
    navigate(`/itinerary-details/${encodeURIComponent(itinerary.Itinerary_Name)}`); // Encode to make the URL safe
};

const handleDeleteRequest = async () => {
    try {
        // Call the requestDeleteProfile function from api.js
        const email = localStorage.getItem('email');
        const profileData = await getTouristProfile({ Email: email });
        const result = await requestDeleteProfile(profileData.Username, profileData.Email, profileData.Password, profileData.Type);
        setMessage(result.message); // Set the success message
    } catch (error) {
        // Handle errors (e.g., validation errors or server errors)
        console.error('Delete request error:', error); // Log the error to the console for debugging
        setMessage(error.error || error.details || 'Failed to submit delete request.');
    }
};


useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        const profileData = await getTouristProfile({ Email: email });
        setTourist(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
}, []);


const handleNewAddress=async(e)=>{
    e.preventDefault();
    try{
      const email = localStorage.getItem('email');
        const response = await addDeliveryAddress({email, address})
        setSuccess(`Addresses added successfully`);
        setEmail('');
        setAddress('');
    }
    catch(error){
        setErrornew(`Failed to add address`);
        console.error(error);
    }
}

const handleChangepref = (e) => {
  const { name, type, checked, value } = e.target;
  setPreferenceData((prevData) => ({
    ...prevData,
    [name]: type === "checkbox" ? checked : value, // Properly toggle checkbox values
  }));
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  

const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
        const email = localStorage.getItem('email');
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

const handleSave = async () => {
    try {
      await updateTouristProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    window.location.reload();
};

const handleEdit = () => {
    setIsEditing(true);
};

const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
    }
};

const handleUploadProfilePicture = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const email = formData.Email; // Get the email from formData
    try {
      await uploadProfilePicture(email, file); // Call your upload function
      alert('Profile picture uploaded successfully!');
      //window.location.reload(); // Reload to fetch the new profile picture
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture.');
    }
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

const handleRedeemPoints = async () => {
  try {
    const email = localStorage.getItem('email');
      if (!email || !pointsToRedeem) {
          setMessage('Please enter a valid email and points to redeem.');
          return;
      }

      // Ensure pointsToRedeem is a valid number and greater than 0
      if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
          setMessage('Please enter a valid amount of points to redeem.');
          return;
      }

      const data = await redeemPoints(email, pointsToRedeem);
      setMessage(data.message || 'Points redeemed successfully!');
  } catch (error) {
      console.error('Error redeeming points:', error);
      setMessage(error.message || 'Failed to redeem points.');
  }
};

if (!tourist) {
  return <div>Loading...</div>;
}

return (

  <div className="min-h-screen flex flex-col justify-between w-full">
     <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex items-center ml-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-full px-72 py-2 w-full max-w-2xl text-sm pl-2"
                    />

                        <button type="submit" className="bg-white text-black rounded-full ml-2 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
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
                    <Link to="/" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                        Home
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Activities
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Itineraries
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Historical Places
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-blue-500">
                        Museums
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-white hover:text-blue-500">
                        Gift Shop
                    </Link>
                    <Link to="/MyEvents" className="text-lg font-medium text-white hover:text-blue-500">
                        MyEvents
                    </Link>
                    <Link to="/Flights" className="text-lg font-medium text-white hover:text-blue-500">
                        Flights
                    </Link>
                    <Link to="/Hotels" className="text-lg font-medium text-white hover:text-blue-500">
                        Hotels
                    </Link>
                </nav>            
          </div>
          <div className="flex">
      {/* First Division (Profile Section) */}
      <div className="w-3/5 rounded-lg shadow-lg">
      {/* Profile Picture */}
      <div className="relative w-full flex items-center justify-center">
      {/* Cover Picture */}
      <div
        className="w-full h-48 bg-cover bg-center bg-gray-300"
        style={{ backgroundImage: `url(${formData.Cover_Pic || 'default-cover.jpg'})` }}
      ></div>

      {/* Profile Picture */}
      <div className="absolute top-24 left-6">
        {formData.Profile_Pic ? (
          <img
            src={formData.Profile_Pic}
            alt={`${formData.Name}'s profile`}
            className="w-40 h-40 rounded-full object-cover border-4 border-white"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-black text-white text-center flex items-center justify-center border-4 border-white">
            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
          </div>
        )}
      </div>
    </div>
    <div className="mt-16 ml-14 flex items-center space-x-4">
      <h2 className="text-4xl font-bold text-black">{tourist.Username}</h2>
      <img
        src={badgeImage}
        alt={`${tourist.Username}'s badge`}
        className="w-12 h-12 rounded-full object-cover"
      />
    </div>
    <div className="flex justify-end mb-4 mr-6">
      <button
         className="w-42 py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
        onClick={handleEdit}
      >
        Edit Profile
      </button>
    </div>

    {/* User Details */}
    <div className="flex flex-col items-center mt-16">
      {isEditing ? (
        <div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                <input
                  type="text"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number:</label>
                <input
                  type="text"
                  name="Mobile_Number"
                  value={formData.Mobile_Number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nationality:</label>
                <input
                  type="text"
                  name="Nationality"
                  value={formData.Nationality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Job/Student:</label>
                <input
                  type="text"
                  name="Job_Student"
                  value={formData.Job_Student}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* New File Input for Profile Picture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Profile Picture:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 rounded-full object-cover"
                  />
                )}
              </div>
              <div className="flex justify-start md:justify-center">
                <button
                  type="button"
                  onClick={handleUploadProfilePicture}
                  className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
                >
                  Upload Profile Picture
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
               className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
               className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
            >
              Save Profile
            </button>
            <button
              type="button"
               className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
              onClick={handleDeleteRequest}
            >
              Delete Profile
            </button>

            {message && <p class="mt-4 text-center text-red-600">{message}</p>}
          </form>
        </div>
      ) : (
        <div className="space-y-4 text-gray-700 -mt-12 ml-14">
          <p className="-mt-6"><strong>{tourist.Job_Student}</strong> </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p><strong>Nationality:</strong> {tourist.Nationality}</p>
              <p><strong>DOB: </strong>{new Date(tourist.DOB).toLocaleDateString()}</p>
              <p><strong>Wallet:</strong> {tourist.Wallet}</p>
            </div>
            <div>
              <p><strong>Points:</strong> {tourist.Points}</p>
            </div>
            <div>
              <p><strong>Contact Details:</strong></p>
              <p><strong>Email:</strong> {tourist.Email}</p>
              <p><strong>Mobile Number:</strong> {tourist.Mobile_Number}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    {!isEditing && (
   <div>
    

    {/* Divider */}
    <div className="border-t border-black w-full mx-auto rounded-lg items-center mt-4"></div>
    {/* Navbar */}
    <nav className="bg-gray-100 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex space-x-4">
        <a
          href="#addresss"
          className=" text-black hover:text-logoOrange transition duration-300"
          onClick={handleaddress}
        >
          Address
        </a>
        <a
          href="#complaints"
          className=" text-black hover:text-logoOrange transition duration-300"
          onClick={handlecomplaints}
        >
          Complaints
        </a>

        <a
          href="#Preferences"
          className=" text-black hover:text-logoOrange transition duration-300"
          onClick={handlepreference}
        >
          Preference Tags
        </a>
        
        <a
          href="#points"
          className=" text-black hover:text-logoOrange transition duration-300"
          onClick={handlepoints}
        >
          My Points
        </a> 
      </div>
    </nav>
{addresssection && (
  <div className="flex items-center justify-center bg-gray-100 min-h-screen">
    <div className="bg-white w-3/4 shadow-md rounded-lg p-6 mt-0 -translate-y-52">
      <h2 className="text-2xl font-semibold text-black text-center mb-4">Add a New Address</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter a new address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleNewAddress}
             className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
          >
            Add New Address
          </button>
        </div>
      </form>
      {succes && <p className="mt-4 text-green-600 font-medium">{succes}</p>}
      {errornew && <p className="mt-4 text-red-600 font-medium">{errornew}</p>}
    </div>
  </div>
)}

{complaintsection && (
  <div className="flex items-center justify-center bg-gray-100 min-h-screen">
    <div className="bg-white w-3/4 shadow-md rounded-lg p-6 mt-0 -translate-y-24">
      <h2 className="text-2xl font-semibold text-black text-center mb-4">Submit a Complaint</h2>
      <form onSubmit={handleComplaintSubmit} className="space-y-4">
        <div>
          <label htmlFor="complaint-title" className="block text-gray-700 text-sm font-medium mb-1">Title:</label>
          <input
            id="complaint-title"
            type="text"
            value={complaintTitle}
            onChange={(e) => setComplaintTitle(e.target.value)}
            required
            placeholder="Enter complaint title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="complaint-body" className="block text-gray-700 text-sm font-medium mb-1">Body:</label>
          <textarea
            id="complaint-body"
            value={complaintBody}
            onChange={(e) => setComplaintBody(e.target.value)}
            required
            placeholder="Enter complaint details"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          ></textarea>
        </div>
        <button
          type="submit"
           className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90 mb-4"
        >
          Submit Complaint
        </button>
      </form>
      <button
        type="button"
         className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90 mt-4"
        onClick={handleFetchComplaintByEmail}
      >
        My Complaint
      </button>
      {isLoading && <p className="mt-4 text-gray-500">Loading complaints...</p>}
      {errorMessage && <p className="mt-4 text-red-600 font-medium">Error: {errorMessage}</p>}
      {showComplaints && complaintsList.length === 0 && !isLoading && <p className="mt-4 text-gray-700 font-medium">No complaints found.</p>}
      {showComplaints && complaintsList.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">Title</th>
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">Body</th>
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">Status</th>
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">Reply</th>
              </tr>
            </thead>
            <tbody>
              {complaintsList.map((complaint) => (
                <tr key={complaint._id}>
                  <td className="border px-4 py-2">{complaint.Title}</td>
                  <td className="border px-4 py-2">{complaint.Body}</td>
                  <td className={`border px-4 py-2 ${complaint.Status === "resolved" ? "text-green-600" : "text-red-600"}`}>{complaint.Status}</td>
                  <td className="border px-4 py-2">{complaint.Reply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}

{prefsection && (
  <div className="flex items-center justify-center bg-gray-100 min-h-screen">
    <div className="bg-white w-3/4 shadow-md rounded-lg p-6 mt-0 -translate-y-44">
      <h2 className="text-2xl font-semibold text-black text-center mb-6">Create User Preference</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {[{ name: "historicAreas", label: "Historic Areas" }, { name: "beaches", label: "Beaches" }, { name: "familyFriendly", label: "Family Friendly" }, { name: "shopping", label: "Shopping" }, { name: "budgetFriendly", label: "Budget Friendly" }].map((pref) => (
            <div key={pref.name} className="flex items-center">
              <input
                type="checkbox"
                name={pref.name}
                checked={preferenceData[pref.name]}
                onChange={handleChangepref}
                className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor={pref.name} className="ml-2 text-sm text-gray-700">{pref.label}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
             className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
          >
            Create Preference
          </button>
        </div>
      </form>
      {messagee && <p className="text-center text-sm text-green-500 mt-4">{messagee}</p>}
    </div>
  </div>
)}

{pointssection && (
  <div className="flex items-center justify-center bg-gray-100 min-h-screen">
    <div className="bg-white w-3/4 shadow-md rounded-lg p-6 mt-0 -translate-y-52">
      <h2 className="text-2xl font-semibold text-black text-center mb-4">Redeem Points</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="pointsToRedeem" className="block text-gray-700 text-sm font-medium mb-1">Points to Redeem:</label>
          <input
            type="number"
            id="pointsToRedeem"
            placeholder="Enter points to redeem"
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(e.target.value)}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRedeemPoints}
             className="w-full py-2 px-6 rounded-full text-white font-medium transition duration-300 bg-logoOrange hover:bg-opacity-90"
          >
            Redeem Points
          </button>
        </div>
      </div>
      {message && <p className={`text-center mt-4 text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
    </div>
  </div>
)}





   </div>
    )}
    </div>
          <div className="border-l border-black "></div>

            {/* Second Division (Saved Items Section) */}
                <div className="w-2/5 p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-center mb-4">Saved Items</h3>

                  {/* Activities Section */}
                  {activity.length > 0 && (
                    <div className="mt-8 w-full">
                      <h4 className="text-md font-semibold mb-2">Activities</h4>
                      <ul className="list-inside space-y-4 text-sm">
                        {activity.map((act, index) => (
                          <li key={index} className="text-center">
                            <div 
                              className="w-full h-40 mx-auto bg-gray-200 border border-gray-300 rounded-lg overflow-hidden duration-300 ease-in-out hover:scale-105"
                              onClick={() => handleActivityClick(act)}
                            >
                              <img
                                src={act.Picture || 'default-activity.jpg'}
                                alt={act.Name}
                                className="w-full h-full object-cover duration-300 ease-in-out"
                              />
                            </div>
                            <p className="mt-2 text-gray-700 font-semibold">{act.Name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Itineraries Section */}
                  {itinerary.length > 0 && (
                    <div className="mt-8 w-full">
                      <h4 className="text-md font-semibold mb-2">Itineraries</h4>
                      <ul className="list-inside space-y-4 text-sm">
                        {itinerary.map((itin, index) => (
                          <li key={index} className="text-center">
                            <div 
                              className="w-full h-40 mx-auto bg-gray-200 border border-gray-300 rounded-lg overflow-hidden duration-300 ease-in-out hover:scale-105"
                              onClick={() => handleItineraryClick(itin)}
                            >
                              <img
                                src={itin.Picture || 'default-itinerary.jpg'}
                                alt={itin.Itinerary_Name}
                                className="w-full h-full object-cover duration-300 ease-in-out"
                              />
                            </div>
                            <p className="mt-2 text-gray-700 font-semibold">{itin.Itinerary_Name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* No Saved Items Message */}
                  {activity.length === 0 && itinerary.length === 0 && (
                    <p className="text-center text-gray-600">No saved activities or itineraries.</p>
                  )}
                </div>

            </div>






            <footer className="bg-black shadow m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="w-44" alt="Flowbite Logo" />
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

export default TouristProfile; 