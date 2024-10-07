// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import GetTourist from '../src/components/signup';
import RegisterRequest from './components/signup2';
import SignIn from './components/signin';
import EventsPlaces from './components/UpcomingEvents.js'
import Seller from './components/Seller.js'

import Admin from './components/Admin.js'
import TouristHome from'./components/TouristHome.js'
import TouristProfile from'./components/TouristProfile.js'
import AdminHome from'./components/AdminHome.js'
import SellerHome from'./components/SellerHome.js'
import SellerProfile from'./components/SellerProfile.js'
import AdvertiserHome from'./components/AdvertiserHome.js'
import AdvertiserProfile from'./components/AdvertiserProfile.js'
import TourGuideHome from'./components/TourGuideHome.js'
import TourGuideProfile from'./components/TourGuideProfile.js'
import TourisimGovernerHome from'./components/TourisimGovernerHome.js'
import TourisimGovernerPlaces from'./components/TourisimGovernerPlaces.js'
import ProductList from './components/ProductList';
import AdminProductList from './components/AdminProductList';
import SellerProductList from './components/SellerProductList';

import AdvertiserActivities from './components/AdvertiserActivities.js';
import CreateTag from './components/CreateTag.js';
import TourGuideItineraries from './components/TourGuideItineraries.js'


//import ProductList from './components/Seller.js'


function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/signup" element={<GetTourist/>} />
                <Route path="/signup2" element={<RegisterRequest/>} />
                <Route path="/signin" element={<SignIn/>} />
                <Route path="/eventsplaces" element={<EventsPlaces />} />
                <Route path="/seller" element={<Seller />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/TouristHome" element={<TouristHome />} />
                <Route path="/TouristHome/TouristProfile" element={<TouristProfile />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/SellerHome" element={<SellerHome />} />
                <Route path="/SellerHome/SellerProfile" element={<SellerProfile />} />
                <Route path="/AdvertiserHome" element={<AdvertiserHome />} />
                <Route path="/AdvertiserHome/AdvertiserProfile" element={<AdvertiserProfile />} />
                <Route path="/TourGuideHome" element={<TourGuideHome />} />
                <Route path="/TourGuideHome/TourGuideProfile" element={<TourGuideProfile />} />
                <Route path="/TourisimGovernerHome" element={<TourisimGovernerHome />} />

                <Route path="/Adminproducts" element={<AdminProductList />} />
                <Route path="/Sellerproducts" element={<SellerProductList />} />
                <Route path="/AdvertiserActivities" element={<AdvertiserActivities />} />
                <Route path="/MyPlaces" element={<TourisimGovernerPlaces />} />
                <Route path="/CreateTag" element={<CreateTag />} />
                <Route path="/TourGuideItineraries" element={<TourGuideItineraries />} />
                <Route path="/" component={Home} />



            </Routes>
        </div>
    );
}

export default App;
