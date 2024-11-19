import React, { useEffect, useState } from 'react';
import { readActivity, getItineraryByName } from '../services/api'; // Adjust the import path as needed

const EventDetails = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const selectedName = localStorage.getItem('selectedName');
                const selectedType = localStorage.getItem('selectedType');
                setName(selectedName);
                setType(selectedType);
        
                if (selectedType === 'activity') {
                    const response = await readActivity(selectedName);
                    setDetails(response.data); // Assuming API returns { message, data }
                } else if (selectedType === 'itinerary') {
                    const response = await getItineraryByName(selectedName);
                    if (response) {
                        setDetails(response); // Assuming API returns { message, data }
                    }
                }
            } catch (err) {
                console.error('Error fetching details:', err);
                setError(err.message || 'Failed to fetch details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Event Details</h1>
            <p className="text-lg">
                <strong>Name:</strong> {name}
            </p>
            <p className="text-lg">
                <strong>Type:</strong> {type}
            </p>
            {details && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-4">
                        {type === 'activity' ? 'Activity Details:' : 'Itinerary Details:'}
                    </h2>
                    {type === 'activity' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <img src={details.Picture} alt={details.Name} className="col-span-2 w-full rounded shadow-md" />
                            <p><strong>Name:</strong> {details.Name}</p>
                            <p><strong>Location:</strong> {details.Location}</p>
                            <p><strong>Time:</strong> {details.Time}</p>
                            <p><strong>Duration:</strong> {details.Duration}</p>
                            <p><strong>Price:</strong> ${details.Price}</p>
                            <p><strong>Date:</strong> {new Date(details.Date).toLocaleDateString()}</p>
                            <p><strong>Rating:</strong> {details.Rating}</p>
                            <p><strong>Created By:</strong> {details.Created_By}</p>
                            <p><strong>Available Spots:</strong> {details.Available_Spots}</p>
                            <p><strong>Booked Spots:</strong> {details.Booked_Spots}</p>
                            <p><strong>Flagged:</strong> {details.Flagged ? 'Yes' : 'No'}</p>
                            
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                        <img src={details.Picture} alt={details.Picture} className="col-span-2 w-full rounded shadow-md" />
                        <p><strong>Itinerary Name:</strong> {details.Itinerary_Name}</p>
                        <p><strong>Timeline:</strong> {details.Timeline}</p>
                        <p><strong>Duration:</strong> {details.Duration}</p>
                        <p><strong>Language:</strong> {details.Language}</p>
                        <p><strong>Tour Price:</strong> ${details.Tour_Price}</p>
                        <p><strong>Available Date & Time:</strong> {new Date(details.Available_Date_Time).toLocaleString()}</p>
                        <p><strong>Accessibility:</strong> {details.Accessibility ? 'Yes' : 'No'}</p>
                        <p><strong>Pick-Up Point:</strong> {details.Pick_Up_Point}</p>
                        <p><strong>Drop-Off Point:</strong> {details.Drop_Of_Point}</p>
                        <p><strong>Booked:</strong> {details.Booked}</p>
                        <p><strong>Country:</strong> {details.Country}</p>
                        <p><strong>Rating:</strong> {details.Rating}</p>
                        <p><strong>P_Tag:</strong> {details.P_Tag}</p>
                        <p><strong>Created By:</strong> {details.Created_By}</p>
                        <p><strong>Flagged:</strong> {details.Flagged ? 'Yes' : 'No'}</p>
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventDetails;
