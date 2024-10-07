import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logo.png';
import { createActivityByAdvertiser } from '../services/api';

const AdvertiserHome = () => {
    const [activityData, setActivityData] = useState({
        Name: '',
        Location: '',
        Time: '',
        Duration: '',
        Price: '',
        Date: '',
        Discount_Percent: '',
        Booking_Available: true,
        Available_Spots: '',
        Booked_Spots: '',
        Rating: '',
        Created_By: '', // You may want to set this based on the logged-in user
        Category: '',
        Tag: ''
    });

    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setActivityData({ 
            ...activityData, 
            [name]: type === 'checkbox' ? checked : value // Handle checkbox input
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error message
        setSuccessMessage(''); // Clear any previous success message

        try {
            const response = await createActivityByAdvertiser(activityData);
            console.log('Activity created successfully:', response);
            setSuccessMessage('Activity created successfully!'); // Set success message
        } catch (error) {
            console.error('Error creating activity:', error);
            setErrorMessage('Error creating activity. Please try again.'); // Set error message
        }
    };

    return (
        <div>
            <div className="NavBar">
                <img src={logo} alt="Logo" />
                <nav className="main-nav">
                    <ul className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/AdvertiserActivities">My Created Activities</Link>
                    </ul>
                </nav>

                <nav className="signing">
                    <Link to="/AdvertiserHome/AdvertiserProfile">MyProfile</Link>
                </nav>
            </div>

            <div className="create-activity-form" style={{ marginTop: '150px' }}>
                <h2>Create a New Activity</h2>

                {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}

                <form onSubmit={handleSubmit}>
                    <label>
                        Activity Name:
                        <input
                            type="text"
                            name="Name"
                            placeholder="Activity Name"
                            value={activityData.Name}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Location:
                        <input
                            type="text"
                            name="Location"
                            placeholder="Location"
                            value={activityData.Location}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Time:
                        <input
                            type="text"
                            name="Time"
                            placeholder="Time"
                            value={activityData.Time}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Duration:
                        <input
                            type="text"
                            name="Duration"
                            placeholder="Duration"
                            value={activityData.Duration}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Date:
                        <input
                            type="date"
                            name="Date"
                            value={activityData.Date}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Price:
                        <input
                            type="number"
                            name="Price"
                            placeholder="Price"
                            value={activityData.Price}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Discount Percent:
                        <input
                            type="number"
                            name="Discount_Percent"
                            placeholder="Discount Percent"
                            value={activityData.Discount_Percent}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Available Spots:
                        <input
                            type="number"
                            name="Available_Spots"
                            placeholder="Available Spots"
                            value={activityData.Available_Spots}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Booked Spots:
                        <input
                            type="number"
                            name="Booked_Spots"
                            placeholder="Booked Spots"
                            value={activityData.Booked_Spots}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Rating:
                        <input
                            type="number"
                            name="Rating"
                            placeholder="Rating"
                            value={activityData.Rating}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Booking Available:
                        <input
                            type="checkbox"
                            name="Booking_Available"
                            checked={activityData.Booking_Available}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Category:
                        <input
                            type="text"
                            name="Category"
                            placeholder="Category"
                            value={activityData.Category}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Tag:
                        <input
                            type="text"
                            name="Tag"
                            placeholder="Tag"
                            value={activityData.Tag}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Created By:
                        <input
                            type="text"
                            name="Created_By"
                            placeholder="Created By"
                            value={activityData.Created_By}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit">Create Activity</button>
                </form>
            </div>
        </div>
    );
};

export default AdvertiserHome;
