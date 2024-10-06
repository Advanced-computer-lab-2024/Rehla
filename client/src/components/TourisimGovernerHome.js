// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logo.png';

const TourisimGovernerHome = () => {
    return (
        <div>
           <div class="NavBar">
           <img src={logo} alt="" />
            <nav class="main-nav">
                <ul class="nav-links">
                <Link to="/">Home</Link>
                <Link to="/CreateTag">Create Tag</Link>

                </ul>
            </nav>

            <nav class="signing">
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
            </nav >
            </div>
        </div>
    );
};

export default TourisimGovernerHome;
