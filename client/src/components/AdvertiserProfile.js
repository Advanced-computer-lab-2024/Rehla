import React, { useState, useEffect } from 'react';
import { getAdvertiserProfile, updateAdvertiserProfile,requestDeleteProfile ,
        uploadadvertiserLogo, getNotificationsForTourGuide, markAsSeenn} from '../services/api'; // Import the API functions
import { Link } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Notification icon


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

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteRequest = async () => {
        try {
            // Call the requestDeleteProfile function from api.js
            const email = localStorage.getItem('email');
            const profileData = await getAdvertiserProfile({ Email: email });
            const result = await requestDeleteProfile(profileData.Username, profileData.Email, profileData.Password, profileData.Type);
            setMessage(result.message); // Set the success message
        } catch (error) {
            // Handle errors (e.g., validation errors or server errors)
            console.error('Delete request error:', error); // Log the error to the console for debugging
            setMessage(error.error || error.details || 'Failed to submit delete request.');
        }
    };

    const handleNotificationClick = async () => {
        setShowModal(true); // Show the modal when the notification icon is clicked
        
        // Mark all notifications as seen when the icon is clicked
        try {
            for (const notification of notifications) {
                if (!notification.seen) {
                    await markAsSeenn(notification._id); // Mark as seen
                }
            }
            // Refresh the notifications to show the updated status
            const updatedNotifications = await getNotificationsForTourGuide();
            setNotifications(updatedNotifications); // Set updated notifications
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };
    // Fetch the advertiser profile on component load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored after login
                const profileData = await getAdvertiserProfile({Email :email}); // Fetch profile by email
                setAdvertiser(profileData); // Set fetched profile in state
                setFormData(profileData); // Pre-fill form with fetched data
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
            <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Main Navigation */}
                    <nav className="flex space-x-6">
                        <Link to="/AdvertiserHome" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                            My Activities
                        </Link>
                        <Link to="/AdvertiserHome/AdvertiserGuideReport" className="text-lg font-medium text-white hover:text-blue-500">
                            Reports
                        </Link>
                    </nav>

                    <div className="flex items-center ml-auto">
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
                            <Link to="/AdvertiserHome/AdvertiserProfile">
                                {/* Profile Picture */}
                                <div className="">
                                    {formData.Profile_Pic ? (
                                        <img
                                            src={formData.Profile_Pic}
                                            alt={`${formData.Name}'s profile`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-black text-white text-center flex items-center justify-center border-2 border-white">
                                            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </nav>
                    </div>


                </div>            
            </div>

                        {/* Main profile section */}
                        <div className="flex items-center justify-center flex-grow pt-6">
                            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
                                {/* Profile Section */}
                                <div className="flex flex-col items-center mb-8">
                                    
                                {formData.Logo ? (
                            

                            <img src={formData.Logo} alt={`${formData.Company_Name}'s profile`} className="mt-2 w-32 h-32 rounded-full object-cover" />
                            
                        ) :
                        (<div className="w-32 h-32 rounded-full bg-black text-white text-center flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold">{formData.Company_Name.charAt(0)}</span>
                        </div>
                    )}
                        <h2 className="text-3xl font-bold text-black mb-2">{advertiser.Company_Name}</h2>
                        <p className="text-gray-600 mb-4">{advertiser.Link_to_website}</p>
                        <button
                            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
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
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-100"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Link to Website:</label>
                                        <input
                                            type="text"
                                            name="Link_to_website"
                                            value={formData.Link_to_website}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Company Profile:</label>
                                        <input
                                            type="text"
                                            name="Company_Profile"
                                            value={formData.Company_Profile}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    {preview && (
                                    <img src={preview} alt="Preview" className="mt-2 w-32 h-32 rounded-full object-cover" />
                                    )}
                                </div>
                                </div>

                                <button
                                type="button"
                                onClick={handleUploadLogo}
                                className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
                                >
                                Upload Company LOGO 
                                </button>

                                <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 mt-2"
                                >
                                Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                                >
                                    Save Profile
                                </button>

                                <button 
                                    onClick={handleDeleteRequest}
                                    type="button"
                                    class="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    Delete Profile
                                </button>

                            {message && <p class="mt-4 text-center text-red-600">{message}</p>} {/* Show success or error message */}
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


 

            {/* Footer */}
            <footer className="w-full bg-black py-4 text-center text-white mt-6">
                <p>&copy; 2024 Advertiser Profile. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdvertiserProfile;
