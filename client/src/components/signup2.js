// src/components/CreateUser.js
import React, { useState } from 'react';
import { registerRequest } from '../services/api'; // Import the API call function
import '../css/signup.css';

const RegisterRequest = () => {
    const [employee, setemployee] = useState({
        Username: '',
        Email: '',
        Password: '',
        Type:''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setemployee({ ...employee, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerRequest(employee);
            setMessage('Request sent successfully!');
            console.log(response); // Log the response for debugging
        } catch (error) {
            setMessage('Error creating user: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Tourist</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="Username"
                            value={employee.Username}
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
                            value={employee.Email}
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
                            value={employee.Password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

               
                <div>
                    <label>
                        Type:
                        <select name="Type" value={employee.Type} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Tour Guide">Tour Guide</option>
                            <option value="Seller">Seller</option>
                            <option value="Advertiser">Advertiser</option>
                        </select>
                    </label>
                </div>
                <br></br>
                <button type="submit">Sign up</button>
            </form>
            {message && <p>{message}</p>} {/* Show success/error message */}
        </div>
    );
};

export default RegisterRequest;
