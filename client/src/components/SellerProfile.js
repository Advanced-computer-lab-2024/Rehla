import React, { useEffect, useState } from 'react';
import { getSellerProfile, updateSellerProfile } from '../services/api'; // Import your API functions
import { useNavigate } from 'react-router-dom';

const SellerProfile = () => {
    const [seller, setSeller] = useState({});
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Shop_Name: '',
        Description: '',
        Shop_Location: '',
        Type: ''
    });
    const navigate = useNavigate();

    // Fetch seller profile data when component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('email'); // Get email from local storage

            if (!email) {
                navigate('/login'); // Redirect to login if no email found
                return;
            }

            try {
                const response = await getSellerProfile({ Email: email });
                setSeller(response);
                setFormData(response); // Set form data for editing
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
            const response = await updateSellerProfile(formData);
            setSeller(response.seller); // Update the seller state with the new data
            setIsEditing(false); // Stop editing mode
            setError(''); // Clear any previous errors
        } catch (error) {
            setError('Failed to update profile. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Seller Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isEditing ? (
                <div>
                    <h3>Profile Information</h3>
                    <p>Username: {seller.Username}</p>
                    <p>Email: {seller.Email}</p>
                    <p>Shop Name: {seller.Shop_Name}</p>
                    <p>Description: {seller.Description}</p>
                    <p>Shop Location: {seller.Shop_Location}</p>
                    <p>Type: {seller.Type}</p>
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
                        <label>Shop Name:</label>
                        <input type="text" name="Shop_Name" value={formData.Shop_Name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea name="Description" value={formData.Description} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Shop Location:</label>
                        <input type="text" name="Shop_Location" value={formData.Shop_Location} onChange={handleChange} required />
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

export default SellerProfile;
