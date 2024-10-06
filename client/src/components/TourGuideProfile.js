import React, { useEffect, useState } from 'react';
import { getTourGuideProfile, updateTourGuideProfile } from '../services/api'; // Import your API functions
import { useNavigate } from 'react-router-dom';

const TourGuideProfile = () => {
    const [tourGuide, setTourGuide] = useState({});
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Mobile_Number: '',
        Experience: '',
        Previous_work: '',
        Type: ''
    });
    const navigate = useNavigate();

    // Fetch tour guide profile data when component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('email'); // Get email from local storage

            if (!email) {
                navigate('/login'); // Redirect to login if no email found
                return;
            }

            try {
                const response = await getTourGuideProfile({ Email: email });
                setTourGuide(response.tour_guide);
                setFormData(response.tour_guide); // Set form data for editing
            } catch (error) {
                setError('Failed to fetch profile. Please try again later.');
            }
        };

        fetchProfile();
    }, [navigate]);

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission for updating profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateTourGuideProfile(formData);
            setTourGuide(response.tour_guide); // Update the tour guide state with the new data
            setIsEditing(false); // Stop editing mode
            setError(''); // Clear any previous errors
        } catch (error) {
            setError('Failed to update profile. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Tour Guide Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isEditing ? (
                <div>
                    <h3>Profile Information</h3>
                    <p>Username: {tourGuide.Username}</p>
                    <p>Email: {tourGuide.Email}</p>
                    <p>Mobile Number: {tourGuide.Mobile_Number}</p>
                    <p>Experience: {tourGuide.Experience}</p>
                    <p>Previous Work: {tourGuide.Previous_work}</p>
                    <p>Type: {tourGuide.Type}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h3>Edit Profile</h3>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="Username" value={formData.Username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="Email" value={formData.Email} readOnly />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="Password" value={formData.Password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Mobile Number:</label>
                        <input type="text" name="Mobile_Number" value={formData.Mobile_Number} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Experience:</label>
                        <input type="text" name="Experience" value={formData.Experience} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Previous Work:</label>
                        <textarea name="Previous_work" value={formData.Previous_work} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Type:</label>
                        <input type="text" name="Type" value={formData.Type} onChange={handleChange} required />
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default TourGuideProfile;
