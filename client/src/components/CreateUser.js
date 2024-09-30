// src/components/CreateUser.js
import React, { useState } from 'react';
import { addUser } from '../services/api'; // Import the API call function

const CreateUser = () => {
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Type: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addUser(formData);
            setMessage('User created successfully!');
            console.log(response); // Log the response for debugging
        } catch (error) {
            setMessage('Error creating user: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="Username"
                            value={formData.Username}
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
                            value={formData.Email}
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
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Type:
                        <select name="Type" value={formData.Type} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Admin">Admin</option>
                            <option value="Tourism Governor">Tourism Governor</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Create User</button>
            </form>
            {message && <p>{message}</p>} {/* Show success/error message */}
        </div>
    );
};

export default CreateUser;
