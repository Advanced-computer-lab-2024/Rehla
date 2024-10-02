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
                <Link to="/eventsplaces">Events/Places</Link>
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

export default Home;
