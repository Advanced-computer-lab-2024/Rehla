import React, { useState, useEffect } from 'react';
import { getAdvertiserProfile, updateAdvertiserProfile,requestDeleteProfile ,uploadadvertiserLogo} from '../services/api'; // Import the API functions
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const AdvertiserProfile = () => {
    const [advertiser, setAdvertiser] = useState(null); // State to store advertiser profile
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Type: '',
        Link_to_website: '',
        Hotline: '',
        Company_Profile: '',
        Company_Name: ''
    });


    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
     
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

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

    // Fetch the advertiser profile on component load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored after login
                const profileData = await getAdvertiserProfile(email); // Fetch profile by email
                setAdvertiser(profileData.data); // Set fetched profile in state
                setFormData(profileData.data); // Pre-fill form with fetched data
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    // Function to handle when "Edit" button is clicked
    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update form data as the user types
    };

    // Function to save the updated profile
    const handleSave = async () => {
        try {
            await updateAdvertiserProfile(formData); // Send the updated form data to the API
            setIsEditing(false); // Exit edit mode after saving
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
          setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
        }
      };
    
      const handleUploadLogo = async () => {
        if (!file) {
          alert('Please select a file to upload.');
          return;
        }
        const email = formData.Email; // Get the email from formData
        try {
          await uploadadvertiserLogo(email, file); // Call your upload function
          alert('Profile picture uploaded successfully!');
          //window.location.reload(); // Reload to fetch the new  picture
        } catch (error) {
          console.error('Error uploading  picture:', error);
          alert('Failed to upload  picture.');
        }
      };

    // Render loading state if profile is not yet loaded
    if (!advertiser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100">
            {/* Navigation bar */}
            <div className="w-full bg-brandBlue shadow-md p-4 flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-16" />
                <Link to="/AdvertiserHome" className="text-lg font-medium text-white hover:text-blue-500">
                    Home
                </Link>
            </div>

                        {/* Main profile section */}
                        <div className="flex items-center justify-center flex-grow pt-6">
                            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
                                {/* Profile Section */}
                                <div className="flex flex-col items-center mb-8">
                                    
                                {formData.Logo ? (
                            

                            <img src={formData.Logo} alt={`${formData.Company_Name}'s profile`} className="mt-2 w-32 h-32 rounded-full object-cover" />
                            
                        ) :
                        (<div className="w-32 h-32 rounded-full bg-brandBlue text-white text-center flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold">{formData.Company_Name.charAt(0)}</span>
                        </div>
                    )}
                        <h2 className="text-3xl font-bold text-brandBlue mb-2">{advertiser.Company_Name}</h2>
                        <p className="text-gray-600 mb-4">{advertiser.Link_to_website}</p>
                        <button
                            className="bg-brandBlue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile Content */}
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
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue bg-gray-100"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Link to Website:</label>
                                        <input
                                            type="text"
                                            name="Link_to_website"
                                            value={formData.Link_to_website}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Hotline:</label>
                                        <input
                                            type="text"
                                            name="Hotline"
                                            value={formData.Hotline}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Company Profile:</label>
                                        <input
                                            type="text"
                                            name="Company_Profile"
                                            value={formData.Company_Profile}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                        />
                                    </div>
                                </div>
                                  {/* New File Input for Profile Picture */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Company Logo:</label>
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
                                onClick={handleUploadLogo}
                                className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
                                >
                                Upload Company LOGO 
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
                                    className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                                >
                                    Save Profile
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4 text-gray-700">
                            <p><strong>Username:</strong> {advertiser.Username}</p>
                            <p><strong>Email:</strong> {advertiser.Email}</p>
                            <p><strong>Link to Website:</strong> {advertiser.Link_to_website}</p>
                            <p><strong>Hotline:</strong> {advertiser.Hotline}</p>
                            <p><strong>Company Profile:</strong> {advertiser.Company_Profile}</p>
                            <p><strong>Company Name:</strong> {advertiser.Company_Name}</p>
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

            {/* Footer */}
            <footer className="w-full bg-brandBlue py-4 text-center text-white mt-6">
                <p>&copy; 2024 Advertiser Profile. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdvertiserProfile;
