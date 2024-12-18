// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

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
import CreateTag from './components/CreateTag.js';
import TourGuideItineraries from './components/TourGuideItineraries.js'
import MyEvents from './components/MyEvents.js';
import Flights from './components/Flights.js';
import Hotels from './components/Hotels.js';
import EventDetails from './components/EventDetails';
import ActivityDetails from './components/ActivityDetails.js';
import ItineraryDetails from './components/ItineraryDetails.js';
import Wishlist from './components/Wishlist'; // Import the Wishlist component
import Cart from './components/Cart.js'; 
import ProductInfo from './components/ProductInfo.js'; 
import UpcomingActivities from './components/UpcomingActivities.js'; 
import UpcomingItineraries from './components/UpcomingItineraries.js';
import HistoricalPlaces from './components/HistoricalPlaces.js';
import Museums from './components/Museums.js';
import TReport from './components/TourGuideReport.js'
import Transportation from './components/Transportation.js'
import AReport from './components/AdvertiserReport.js'






//import ProductList from './components/Seller.js'


function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Flights" element={<Flights />} />
                <Route path="/Hotels" element={<Hotels/>} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/signup" element={<GetTourist/>} />
                <Route path="/signup2" element={<RegisterRequest/>} />
                <Route path="/signin" element={<SignIn/>} />
                <Route path="/eventsplaces" element={<EventsPlaces />} />
                <Route path="/seller" element={<Seller />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/TouristHome" element={<TouristHome />} />
                <Route path="/Wishlist" element={<Wishlist />} /> {/* Add the route for Wishlist */}
                <Route path="/TouristHome/TouristProfile" element={<TouristProfile />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/SellerHome" element={<SellerHome />} />
                <Route path="/SellerHome/SellerProfile" element={<SellerProfile />} />
                <Route path="/AdvertiserHome" element={<AdvertiserHome />} />
                <Route path="/AdvertiserHome/AdvertiserProfile" element={<AdvertiserProfile />} />
                <Route path="/AdvertiserHome/AdvertiserGuideReport" element={<AReport />} />
                <Route path="/TourGuideHome" element={<TourGuideHome />} />
                <Route path="/TourGuideHome/TourGuideProfile" element={<TourGuideProfile />} />
                <Route path="/TourGuideHome/TourGuideReport" element={<TReport />} />
                <Route path="/TourisimGovernerHome" element={<TourisimGovernerHome />} />
                <Route path="/activity-details/:activityName" element={<ActivityDetails />} />
                <Route path="/TouristHome/activity-details/:activityName" element={<ActivityDetails />} />
                <Route path="/itinerary-details/:itineraryName" element={<ItineraryDetails />} />
                <Route path="/TouristHome/itinerary-details/:itineraryName" element={<ItineraryDetails />} />

                <Route path="/MyEvents" element={<MyEvents />} />

                <Route path="/Adminproducts" element={<AdminProductList />} />
                <Route path="/Sellerproducts" element={<SellerProductList />} />
                <Route path="/MyPlaces" element={<TourisimGovernerPlaces />} />
                <Route path="/CreateTag" element={<CreateTag />} />
                <Route path="/TourGuideItineraries" element={<TourGuideItineraries />} />
                <Route path="/event-details/:type/:name" element={<EventDetails />} />
                <Route path="/" component={Home} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/ProductInfo" element={<ProductInfo />} />
                <Route path="/UpcomingActivities" element={<UpcomingActivities/>} />
                <Route path="/UpcomingItineraries" element={<UpcomingItineraries/>} />
                <Route path="/HistoricalPlaces" element={<HistoricalPlaces/>} />
                <Route path="/Museums" element={<Museums/>} />
                <Route path="/Transportation" element={<Transportation/>} />


 



            </Routes>
        </div>
    );
}

export default App;
