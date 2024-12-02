
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTouristProfile, updateTouristProfile, uploadProfilePicture , requestDeleteProfile
  ,addDeliveryAddress,viewComplaintByEmail,createComplaint,viewSavedActivities,viewSavedItineraries
} from '../services/api'; // Import your new upload function
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
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

    const [succesViewEvent,setSuccessViewEvent]=useState('');
    const [errorViewEvent,setErrorViewEvent]=useState('');
    const [events, setEvents] = useState([]);

    const [address,setAddress]=useState('');
    const [succes,setSuccess]=useState('');
    const [errornew,setErrornew]=useState('');
    const [email, setEmail] = useState('');

    const[addresssection , setaddresssection] = useState('');
    const[complaintsection , setcomplaintsection] = useState('');

    const [complaintsList, setComplaintsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showComplaints, setShowComplaints] = useState(false); 
    const [complaintTitle, setComplaintTitle] = useState('');
    const [complaintBody, setComplaintBody] = useState('');
    const [error, setError] = useState(null);

     // bto3 el view activity
     const [succesViewActivity,setSuccessViewActivity]=useState('');
     const [errorViewActivity,setErrorViewActivity]=useState('');
     const [activity, setActivity] = useState([]);
        // bto3 el view itinerary
     const [succesViewItinerary,setSuccessViewItinerary]=useState('');
     const [errorViewItinerary,setErrorViewItinerary]=useState('');
     const [itinerary, setItinerary] = useState([]);


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
    }

    const handlecomplaints = async ()=>{
      setaddresssection(false);
      setcomplaintsection(true);
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

  // useEffect(() => {
  //   const handleViewSavedEvents = async () => {
  //     // Clear previous messages and data
  //     setSuccessViewEvent('');
  //     setErrorViewEvent('');
  //     setEvents([]);
  
  //     try {
  //         const response = await viewSavedEvents(localStorage.getItem('email'));
  
  //         // On success, set success message and update the events list
  //         setSuccessViewEvent(`Successfully retrieved ${response.savedEvents.length} event(s).`);
  //         setEvents(response.savedEvents); // Ensure `savedEvents` contains the Picture field
  //     } catch (error) {
  //         // Handle error: use server message if available, otherwise fallback to generic message
  //         if (error.response && error.response.data && error.response.data.message) {
  //             setErrorViewEvent(error.response.data.message);
  //         } else {
  //             setErrorViewEvent('An error occurred while retrieving saved events.');
  //         }
  //     }
  // }; handleViewSavedEvents();
  // },[]);
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

  if (!tourist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-16" />
        <ul className="nav-links flex-grow flex justify-center space-x-8">
          <Link to="/TouristHome" className="text-white">Home</Link>
          <Link to="/products" className="text-white">Products</Link>
          <Link to="/MyEvents" className="text-white">Events/Places</Link>
          <Link to="/Flights" className="text-white">Flights</Link>
          <Link to="/Hotels" className="text-white">Hotels</Link>
        </ul>
        <Link to="/" className="text-white">signout</Link>
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
          <div className="w-40 h-40 rounded-full bg-brandBlue text-white text-center flex items-center justify-center border-4 border-white">
            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
          </div>
        )}
      </div>
    </div>
    <div className="mt-16 ml-14 flex items-center space-x-4">
      <h2 className="text-4xl font-bold text-brandBlue">{tourist.Username}</h2>
      <img
        src={badgeImage}
        alt={`${tourist.Username}'s badge`}
        className="w-12 h-12 rounded-full object-cover"
      />
    </div>
    <div className="flex justify-end mb-4 mr-6">
      <button
        className="bg-logoOrange text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 w-32 h-10 -mt-16"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number:</label>
                <input
                  type="text"
                  name="Mobile_Number"
                  value={formData.Mobile_Number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Job/Student:</label>
                <input
                  type="text"
                  name="Job_Student"
                  value={formData.Job_Student}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
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
                  className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 mt-6"
                >
                  Upload Profile Picture
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
            >
              Save Profile
            </button>
            <button
              type="button"
              class="w-full py-2 px-4 bg-logoOrange text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
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
    <div className="border-t border-brandBlue w-full mx-auto rounded-lg items-center mt-4"></div>
    {/* Navbar */}
    <nav className="bg-gray-100 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex space-x-4">
        <a
          href="#addresss"
          className=" text-brandBlue hover:text-logoOrange transition duration-300"
          onClick={handleaddress}
        >
          Address
        </a>
        <a
          href="#complaints"
          className=" text-brandBlue hover:text-logoOrange transition duration-300"
          onClick={handlecomplaints}
        >
          Complaints
        </a>
      </div>
    </nav>
    {addresssection && (
      <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white w-3/4 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-brandBlue mb-4">Add a New Address</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter a new address"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleNewAddress}
              className="bg-logoOrange text-white font-medium py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
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
  <div className="flex items-center justify-center bg-gray-100">
    <div className="bg-white w-3/4 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-brandBlue mb-4">Submit a Complaint</h2>
      <form onSubmit={handleComplaintSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="complaint-title"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Title:
          </label>
          <input
            id="complaint-title"
            type="text"
            value={complaintTitle}
            onChange={(e) => setComplaintTitle(e.target.value)}
            required
            placeholder="Enter complaint title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
          />
        </div>
        <div>
          <label
            htmlFor="complaint-body"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Body:
          </label>
          <textarea
            id="complaint-body"
            value={complaintBody}
            onChange={(e) => setComplaintBody(e.target.value)}
            required
            placeholder="Enter complaint details"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-logoOrange text-white font-medium py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
        >
          Submit Complaint
        </button>
      </form>
      <button
        type="button"
        className="w-full mt-4 bg-brandBlue text-white font-medium py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
        onClick={handleFetchComplaintByEmail}
      >
        My Complaint
      </button>

      {/* Loading indicator */}
      {isLoading && <p className="mt-4 text-gray-500">Loading complaints...</p>}

      {/* Error handling */}
      {errorMessage && (
        <p className="mt-4 text-red-600 font-medium">Error: {errorMessage}</p>
      )}

      {/* No complaints found message */}
      {showComplaints && complaintsList.length === 0 && !isLoading && (
        <p className="mt-4 text-gray-700 font-medium">No complaints found.</p>
      )}

      {/* Display complaints in a table */}
      {showComplaints && complaintsList.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">
                  Title
                </th>
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">
                  Body
                </th>
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">
                  Status
                </th>
                <th className="border px-4 py-2 text-left text-gray-700 font-medium">
                  Reply
                </th>
              </tr>
            </thead>
            <tbody>
              {complaintsList.map((complaint) => (
                <tr key={complaint._id}>
                  <td className="border px-4 py-2">{complaint.Title}</td>
                  <td className="border px-4 py-2">{complaint.Body}</td>
                  <td
                    className={`border px-4 py-2 ${
                      complaint.Status === "resolved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {complaint.Status}
                  </td>
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

    
  </div>
)}

          
          </div>
          <div className="border-l border-brandBlue "></div>

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
                                className="w-full h-full object-cover duration-300 ease-in-out hover:scale-105"
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
                                className="w-full h-full object-cover duration-300 ease-in-out hover:scale-105"
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

export default TouristProfile; 