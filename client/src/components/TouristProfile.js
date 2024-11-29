import React, { useState, useEffect } from 'react';
import { getTouristProfile, updateTouristProfile, uploadProfilePicture , requestDeleteProfile} from '../services/api'; // Import your new upload function
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-16" />
        <ul className="nav-links flex-grow flex justify-center space-x-8">
          <Link to="/TouristHome" className="text-white">Home</Link>
          <Link to="/products" className="text-white">Products</Link>
          <Link to="/MyEvents" className="text-white">Events/Places</Link>
          <Link to="/Flights" className="text-white">Flights</Link>
          <Link to="/Hotels" className="text-white">Hotels</Link>
        </ul>
      </div>

      
      <div className="w-3/5 ml-6 rounded-lg shadow-lg h-[1000px]">

  
          {/* Profile Picture */}
          <div className="relative w-full flex items-center justify-center">
              {/* Cover Picture */}
              <div className="w-full h-48 bg-cover bg-center bg-gray-300" style={{ backgroundImage: `url(${formData.Cover_Pic || 'default-cover.jpg'})` }}>
              </div>

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
            className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 w-32 h-10 -mt-16"
            onClick={handleEdit}
          >
            Edit Profile
          </button>

          </div>



    {/* User Details */}
    <div className="flex flex-col items-start mt-16">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Profile Picture:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    />
                    {preview && (
                      <img src={preview} alt="Preview" className="mt-2 w-32 h-32 rounded-full object-cover" />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUploadProfilePicture}
                  className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
                >
                  Upload Profile Picture
                </button>

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
                    class="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
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