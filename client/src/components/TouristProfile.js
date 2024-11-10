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
    Points: 0, 
    Badge: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const badgeImage = getBadgeImage(formData.Badge);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const handleDeleteRequest = async () => {
    try {
        // Call the requestDeleteProfile function from api.js
        const result = await requestDeleteProfile(username, email, password, type);
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
        <Link to="/TouristHome" className="text-lg font-medium text-white hover:text-blue-500">
          Home
        </Link>
      </div>

      <div className="flex items-center justify-center flex-grow pt-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
          <div className="flex flex-col items-center mb-8">
            
                {formData.Profile_Pic ? (
                   

                    <img src={formData.Profile_Pic} alt={`${formData.Name}'s profile`} className="mt-2 w-32 h-32 rounded-full object-cover" />
                   
                ) :
              (<div className="w-32 h-32 rounded-full bg-brandBlue text-white text-center flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">{formData.Username.charAt(0)}</span>
              </div>
            )}
            <h2 className="text-3xl font-bold text-brandBlue mb-2">{formData.Username}</h2>
            <button
              className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration- 300"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          </div>

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
              </form>
            </div>
          ) : (
            <div className="space-y-4 text-gray-700">
              <p><strong>Username:</strong> {tourist.Username}</p>
              <p><strong>Email:</strong> {tourist.Email}</p>
              <p><strong>Mobile Number:</strong> {tourist.Mobile_Number}</p>
              <p><strong>Nationality:</strong> {tourist.Nationality}</p>
              <p><strong>Job/Student:</strong> {tourist.Job_Student}</p>
              <p><strong>Points:</strong> {tourist.Points}</p>
              <p><strong>Badge:</strong> {tourist.Badge}</p>
              <img src={badgeImage}
                alt={`${tourist.Username}'s badge`}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Delete Profile</h1>
    <form onSubmit={(e) => { e.preventDefault(); handleDeleteRequest(); }} class="space-y-4">
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username:</label>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
            <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
            >
                <option value="">Select Type</option>
                <option value="TOURIST">Tourist</option>
                <option value="Tour Guide">Tour Guide</option>
                <option value="Advertiser">Advertiser</option>
                <option value="Seller">Seller</option>
            </select>
        </div>
        
        <button 
            type="submit"
            class="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
        >
            Submit Request
        </button>
    </form>

    {message && <p class="mt-4 text-center text-red-600">{message}</p>} {/* Show success or error message */}
</div>


      <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
        <p>&copy; 2024 Tourist Profile. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TouristProfile; 