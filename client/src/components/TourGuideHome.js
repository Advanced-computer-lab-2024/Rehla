import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logo from '../images/logo.png';

const TourGuideHome = () => {
    return (
        <div>
           <div class="NavBar">
           <img src={logo} alt="" />
            <nav class="main-nav">
                <ul class="nav-links">
                <Link to="/">Home</Link>
                <Link to="/TourGuideItineraries">My Created Itineraries</Link>
                </ul>
            </nav>

            <nav class="signing">
            <Link to="/">MyProfile</Link>
            </nav >
            </div>
        </div>
    );
};

export default TourGuideHome;