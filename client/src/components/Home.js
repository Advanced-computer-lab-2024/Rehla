// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logo.png';

const Home = () => {
    return (
        <div>
           <div class="NavBar">
           <img src={logo} alt="" />
            <nav class="main-nav">
                <ul class="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/activities">Activities</Link>
                <Link to="/itineraries">Itineraries</Link>
                <Link to="/museums">Museums</Link>
                </ul>
            </nav>

            <nav class="signing">
            <Link to="/signup">Sign in</Link>
            <Link to="/signin">Sign up</Link>
            </nav>
            </div>
        </div>
    );
};

export default Home;
