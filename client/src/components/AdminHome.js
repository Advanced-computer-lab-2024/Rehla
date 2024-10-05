import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteUserAdmin } from '../services/api'; // Import the deleteUserAdmin function
import '../css/Home.css';
import logo from '../images/logo.png';

const AdminHome = () => {
    const [email, setEmail] = useState(''); // State to store the input email
    const [message, setMessage] = useState(''); // State to store success/error messages

    // Handle delete user request
    const handleDeleteUser = async (e) => {
        e.preventDefault(); // Prevent page reload
        setMessage(''); // Clear any previous message
        
        try {
            const data = await deleteUserAdmin(email); // Call the API function from api.js
            setMessage(data.message); // Set success message
        } catch (error) {
            setMessage(error); // Set error message
        }
    };

    return (
        <div>
           <div className="NavBar">
               <img src={logo} alt="logo" />
               <nav className="main-nav">
                   <ul className="nav-links">
                       <Link to="/">Home</Link>
                       <Link to="/Adminproducts">Products</Link>
                   </ul>
               </nav>

               <nav className="signing">
                   <Link to="/">MyProfile</Link>
               </nav>
           </div>
           <br></br>

           {/* Add the form for deleting a user */}
           <div className="admin-actions">
               <h2>Delete User</h2>
               <form onSubmit={handleDeleteUser}>
                   <label htmlFor="email">Enter Email of User to Delete:</label>
                   <input
                       type="email"
                       id="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                   />
                   <button type="submit">Delete User</button>
               </form>
               {message && <p>{message}</p>} {/* Show success/error message */}
           </div>
        </div>
    );
};

export default AdminHome;
