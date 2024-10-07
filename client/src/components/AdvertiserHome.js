import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logo.png';
import { createActivityByAdvertiser  , readActivity , deleteActivityByAdvertiser , updateActivityByAdvertiser } from '../services/api';

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


    const [searchActivityName, setSearchActivityName] = useState('');
    const [retrievedActivity, setRetrievedActivity] = useState(null);
    const [errorsearch, setErrorsearch] = useState(null);
    const [successsearch, setSuccesssearch] = useState(null);


    const [activitydeleteName, setActivitydeleteName] = useState('');
    const [deletemessage, setdeleteMessage] = useState('');


    const [activityName, setActivityName] = useState(''); // To find the itinerary
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [date, setdate] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [bookingAvailable, setBookingAvailable] = useState(false);
    const [availableSpots, setAvailableSpots] = useState('');
    const [bookedSpots, setBookedSpots] = useState('');
    const [rating, setRating] = useState('');
    const [createdby, setCreatedBy] = useState('');
    const [tag, setTag] = useState('');
    const [category, setCategory] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');

    const handledeleteInputChange = (e) => {
        setActivitydeleteName(e.target.value); // Update state with input value
    };

    const handledeleteSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setdeleteMessage(''); // Reset message before deletion attempt

        try {
            const response = await deleteActivityByAdvertiser(activitydeleteName); // Call the delete function
            setdeleteMessage(`Success: ${response.message}`); // Display success message
            setActivitydeleteName(''); // Clear input field
        } catch (error) {
            setdeleteMessage(`Error: ${error.message || 'Failed to delete itinerary.'}`); // Display error message
        }
    };

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

    const handleRetrieveActivity = async () => {
        setErrorsearch(null);
        setRetrievedActivity(null);
        console.log(`Retrieving activity for: ${searchActivityName}`); // Log the search term
        try {
            const response = await readActivity(searchActivityName);
            console.log('Response:', response); // Log the response
    
            if (response.data) {
                setRetrievedActivity(response.data);
            } else {
                setErrorsearch('No activity found with that name.');
            }
        } catch (error) {
            console.error('Error fetching activity:', error);
            setErrorsearch(error.message || 'Error retrieving activity. Please try again.');
        }
    };

    const handleUpdateActivity = async (e) => {
        e.preventDefault();
        setUpdateMessage('');
    
        const activityData = {
            Name: activityName,
            Location: location,
            Time: time,
            Duration: duration,
            Price: price,
            Date: date,
            Discount_Percent: discountPercent,
            Booking_Available: bookingAvailable,
            Available_Spots: availableSpots,
            Booked_Spots: bookedSpots, 
            Rating: rating, // This should be a number too
            Tag: tag,
            Category : category,
            Created_By : createdby
        };
    
        console.log('Updating itinerary with data:', activityData); // Log the data
    
        try {
            const response = await updateActivityByAdvertiser (activityData);
            if (!response.success) {
                setUpdateMessage('Activity updated successfully!');
            } else {
                setUpdateMessage('Error updating activity: ' + response.message);
            }
        } catch (error) {
            console.error('Error updating activity:', error);
            setUpdateMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
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

            {/* Search Activity Form */}
            <div >
                    <h2 >Search Activity</h2>
                    <input
                        type="text"
                        value={searchActivityName}
                        onChange={(e) => setSearchActivityName(e.target.value)}
                        placeholder="Enter activity name"
                    />
                    <button onClick={handleRetrieveActivity} >Search</button>
                    {errorsearch && <p style={{ color: 'red' }}>{errorsearch}</p>}
                    {retrievedActivity && (
                        <div>
                            <h3>Retrieved Activity:</h3>
                            <p><strong>Activity Name:</strong> {retrievedActivity.Name}</p>
                            <p><strong>Location:</strong> {retrievedActivity.Location}</p>
                            <p><strong>Time:</strong> {retrievedActivity.Time}</p>
                            <p><strong>Duration:</strong> {retrievedActivity.Duration}</p>
                            <p><strong>Price:</strong> {retrievedActivity.Price}</p>
                            <p><strong>Date:</strong> {retrievedActivity.Date}</p>
                            <p><strong>Discount Percent:</strong> {retrievedActivity.Discount_Percent}</p>
                            <p><strong>Booking_Available:</strong> {retrievedActivity.Booking_Available}</p>
                            <p><strong>Available Spots:</strong> {retrievedActivity.Available_Spots}</p>
                            <p><strong>Booked Spots:</strong> {retrievedActivity.Booked_Spots}</p>
                            <p><strong>Rating:</strong> {retrievedActivity.Rating}</p>
                            <p><strong>Created BY:</strong> {retrievedActivity.Created_By}</p>
                            <p><strong>Tag:</strong> {retrievedActivity.Tag}</p>
                            <p><strong>Category:</strong> {retrievedActivity.Category}</p>
                        </div>
                    )}
            </div>
        <div>
            <h2>Delete Activity</h2>
            <form onSubmit={handledeleteSubmit}>
                <input 
                    type="text" 
                    value={activitydeleteName} 
                    onChange={handledeleteInputChange} 
                    placeholder="Enter Activity Name" 
                    required 
                />
                <button type="submit" >Delete Activity</button>
            </form>
            {deletemessage && <p>{deletemessage}</p>} {/* Display success/error message */}
        </div>


         {/* Update Activity Form */}
         <div >

                    <h2 style={{ textAlign: 'center' }}>Update Activity</h2>
                    <form onSubmit={handleUpdateActivity}>
                        <label>Activity Name (Required):</label>
                        <input
                            type="text"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            required
                        />
                        <label>Location:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <label>Time:</label>
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        <label>Duration:</label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <label>Date</label>
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setdate(e.target.value)}
                        />
                        <label>Discount Percent:</label>
                        <input
                            type="text"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(e.target.value)}
                        />
                        <label>Booking Available:</label>
                        <input
                             type="checkbox"
                            value={bookingAvailable}
                            onChange={(e) => setBookingAvailable(e.target.value)}
                          
                        />
                        <label>Available Spots:</label>
                        <input
                            type="number"
                            value={availableSpots}
                            onChange={(e) => setAvailableSpots(e.target.value)}
                            
                           
                        />
                        <label>Booked Spots:</label>
                        <input
                            type="number"
                            value={bookedSpots}
                            onChange={(e) => setBookedSpots(Number(e.target.value))} // Convert string to number
                        />
                        <label>Rating:</label>
                        <input
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <label>Category:</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <label>Tag:</label>
                        <input
                            type="number"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                      
                        <button type="submit" >Update Activity</button>
                    </form>
                    {updateMessage && <p style={{ color: 'green' }}>{updateMessage}</p>}
                </div>

        </div>
    );
};

export default AdvertiserHome;