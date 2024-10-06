import React, { useState, useEffect } from 'react';
import { getAdvertiserProfile, updateAdvertiserProfile } from '../services/api'; // Import the API functions

const AdvertiserProfile = () => {
    const [advertiser, setAdvertiser] = useState(null);  // State to store advertiser profile
    const [isEditing, setIsEditing] = useState(false);  // State to toggle edit mode
    const [formData, setFormData] = useState({          // State to store form data
        Username: '',
        Email: '',
        Password: '',
        Type: '',
        Link_to_website: '',
        Hotline: '',
        Company_Profile: '',
        Company_Name: ''
    });

    // Fetch the advertiser profile on component load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = localStorage.getItem('email');  // Assuming email is stored after login
                const profileData = await getAdvertiserProfile(email); // Fetch profile by email
                setAdvertiser(profileData.data);              // Set fetched profile in state
                setFormData(profileData.data);                // Pre-fill form with fetched data
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    // Function to handle when "Edit" button is clicked
    const handleEdit = () => {
        setIsEditing(true);  // Enable edit mode
    };

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });  // Update form data as the user types
    };

    // Function to save the updated profile
    const handleSave = async () => {
        try {
            await updateAdvertiserProfile(formData);  // Send the updated form data to the API
            setIsEditing(false);                      // Exit edit mode after saving
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // Render loading state if profile is not yet loaded
    if (!advertiser) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isEditing ? (
                <div>
                    <h2>Edit Advertiser Profile</h2>
                    <form>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="Username"
                            value={formData.Username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                        <br />

                        <label>Email:</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            placeholder="Email"
                            disabled  // Email shouldn't be editable
                        />
                        <br />

                        <label>Password:</label>
                        <input
                            type="password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        <br />

                        <label>Link to Website:</label>
                        <input
                            type="text"
                            name="Link_to_website"
                            value={formData.Link_to_website}
                            onChange={handleChange}
                            placeholder="Link to Website"
                        />
                        <br />

                        <label>Hotline:</label>
                        <input
                            type="text"
                            name="Hotline"
                            value={formData.Hotline}
                            onChange={handleChange}
                            placeholder="Hotline"
                        />
                        <br />

                        <label>Company Profile:</label>
                        <input
                            type="text"
                            name="Company_Profile"
                            value={formData.Company_Profile}
                            onChange={handleChange}
                            placeholder="Company Profile"
                        />
                        <br />

                        <label>Company Name:</label>
                        <input
                            type="text"
                            name="Company_Name"
                            value={formData.Company_Name}
                            onChange={handleChange}
                            placeholder="Company Name"
                        />
                        <br />

                        <button type="button" onClick={handleSave}>Save Profile</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Advertiser Profile</h2>
                    <p><strong>Username:</strong> {advertiser.Username}</p>
                    <p><strong>Email:</strong> {advertiser.Email}</p>
                    <p><strong>Link to Website:</strong> {advertiser.Link_to_website}</p>
                    <p><strong>Hotline:</strong> {advertiser.Hotline}</p>
                    <p><strong>Company Profile:</strong> {advertiser.Company_Profile}</p>
                    <p><strong>Company Name:</strong> {advertiser.Company_Name}</p>

                    <button onClick={handleEdit}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default AdvertiserProfile;
