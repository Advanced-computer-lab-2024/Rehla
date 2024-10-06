import React, { useEffect, useState } from 'react';
import { getTouristProfile } from '../services/api'; // API function to get tourist profile

const TouristProfile = () => {
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Retrieve email from localStorage
    const email = localStorage.getItem('email');
    console.log('Retrieved email from localStorage:', email); // Log email
    
    if (email) {
      // Call the API to get the tourist profile using the email
      const fetchProfile = async () => {
        try {
          const profile = await getTouristProfile({ Email: email }); // Call the API with email
          setProfileData(profile); // Set the profile data
          setLoading(false); // Set loading to false after fetching data
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to fetch profile. Please try again later.');
          setLoading(false); // Stop loading
        }
      };

      fetchProfile();
    } else {
      setError('Email not found. Please log in again.');
      setLoading(false); // Stop loading
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      {profileData ? (
        <div>
          <p><strong>Name:</strong> {profileData.Username}</p>
          <p><strong>Email:</strong> {profileData.Email}</p>
          <p><strong>Mobile Number:</strong> {profileData.MobileNumber}</p>
          <p><strong>Nationality:</strong> {profileData.Nationality}</p>
          <p><strong>Date of Birth:</strong> {profileData.DOB}</p>
          <p><strong>Occupation:</strong> {profileData.JobOrStudent}</p>
          <p><strong>Wallet Balance:</strong> ${profileData.WalletBalance}</p>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default TouristProfile;
