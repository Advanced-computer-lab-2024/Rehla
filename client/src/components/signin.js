// src/components/CreateUser.js
import React, { useState } from 'react';
import { registerRequest } from '../services/api'; // HANEMSA7 DA
//W NEKTEB DA import { signin } from '../services/api'; // Import the API call function

import '../css/signin.css';

const SignIn = () => {
    const [profile, setprofile] = useState({
        Username: '',
        Email: '',
        Password: '',
       
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setprofile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerRequest(profile);
            setMessage('HELLO!'+ e.target.Username);
            console.log(response); // Log the response for debugging
        } catch (error) {
            setMessage('Error signing in: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="Username"
                            value={profile.Username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="Email"
                            value={profile.Email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="Password"
                            value={profile.Password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

               
              
                <br></br>
                <button type="submit">Sign In</button>
            </form>
            {message && <p>{message}</p>} {/* Show success/error message */}
        </div>
    );
};

export default SignIn;
