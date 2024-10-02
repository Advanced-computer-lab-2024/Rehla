// src/components/CreateUser.js
import React, { useState } from 'react';
import { registerTourist } from '../services/api'; // Import the API call function
import { Link } from 'react-router-dom';
import '../css/signup.css';

const GetTourist = () => {
    const [formin, setFormin] = useState({
        Username: '',
        Email: '',
        Password: '',
        Mobile_Number :'',
        Nationality :'',
        DOB:'',
        Job_Student:''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormin({ ...formin, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerTourist(formin);
            setMessage('Tourist created successfully!');
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
                            value={formin.Username}
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
                            value={formin.Email}
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
                            value={formin.Password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Mobile Number:
                        <input
                            type="string"
                            id="Mobilenum"
                            name="Mobile_Number"
                            value={formin.Mobile_Number}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>


                <div>
                    <label>
                        Nationality:
                        <input
                            type="string"
                            name="Nationality"
                            value={formin.Nationality}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="DOB"
                            value={formin.DOB}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Job_Student:
                        <select name="Job_Student" value={formin.Job_Student} onChange={handleChange} required>
                            <option value="">Select Job</option>
                            <option value="Job">Job</option>
                            <option value="Student">Student</option>
                        </select>
                    </label>
                </div>
                <Link to="/signup2" id="Linkt">Not a Tourist?</Link>
                <br></br>
                <button type="submit">Sign up</button>
            </form>
            {message && <p>{message}</p>} {/* Show success/error message */}
        </div>
    );
};

export default GetTourist;
