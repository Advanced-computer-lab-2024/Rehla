import React, { useState, useEffect } from 'react';
import { getTouristProfile, updateTouristProfile } from '../services/api'; // Import API functions

const TouristProfile = () => {
  const [profile, setProfile] = useState(null);  // Store the profile data
  const [error, setError] = useState('');  // Store error messages
  const [success, setSuccess] = useState('');  // Store success messages
  const [isEditMode, setIsEditMode] = useState(false);  // Toggle for edit mode

  const email = localStorage.getItem('email'); // Get email from localStorage

  // Fetch the tourist profile when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTouristProfile({ Email: email });
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile. Please try again later.');
      }
    };
    fetchProfile();
  }, [email]);

  // Handle profile update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await updateTouristProfile(profile);
      setSuccess('Profile updated successfully.');
      setProfile(updatedProfile.tourist);
      setIsEditMode(false);  // Exit edit mode after a successful update
    } catch (err) {
      setError('Error updating profile. Please try again.');
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return profile ? (
    <div>
      <h2>Tourist Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <div>
        <label>Email:</label>
        <p>{profile.Email}</p> {/* Email should not be editable */}
      </div>

      {/* Conditionally render input fields based on isEditMode */}
      <div>
        <label>Password:</label>
        {isEditMode ? (
          <input
            type="password"
            value={profile.Password || ''}
            onChange={(e) => setProfile({ ...profile, Password: e.target.value })}
          />
        ) : (
          <p>{profile.Password ? '********' : 'No password set'}</p>
        )}
      </div>

      <div>
        <label>Mobile Number:</label>
        {isEditMode ? (
          <input
            type="text"
            value={profile.Mobile_Number || ''}
            onChange={(e) => setProfile({ ...profile, Mobile_Number: e.target.value })}
          />
        ) : (
          <p>{profile.Mobile_Number || 'Not set'}</p>
        )}
      </div>

      <div>
        <label>Nationality:</label>
        {isEditMode ? (
          <input
            type="text"
            value={profile.Nationality || ''}
            onChange={(e) => setProfile({ ...profile, Nationality: e.target.value })}
          />
        ) : (
          <p>{profile.Nationality || 'Not set'}</p>
        )}
      </div>

      <div>
        <label>Job/Student:</label>
        {isEditMode ? (
          <input
            type="text"
            value={profile.Job_Student || ''}
            onChange={(e) => setProfile({ ...profile, Job_Student: e.target.value })}
          />
        ) : (
          <p>{profile.Job_Student || 'Not set'}</p>
        )}
      </div>

      {/* Toggle button to switch between Edit and Save modes */}
      {isEditMode ? (
        <button onClick={handleUpdate}>Save Profile</button>
      ) : (
        <button onClick={toggleEditMode}>Edit Profile</button>
      )}
    </div>
  ) : (
    <p>Loading profile...</p>
  );
};

export default TouristProfile;
