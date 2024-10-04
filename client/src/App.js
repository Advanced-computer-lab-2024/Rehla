// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProductList from './components/ProductList';
import CreateUser from './components/CreateUser';
import GetTourist from '../src/components/signup';
import RegisterRequest from './components/signup2';
import SignIn from './components/signin';
import EventsPlaces from './components/UpcomingEvents.js'
import Seller from './components/Seller.js'

import Admin from './components/Admin.js'
import TouristHome from'./components/TouristHome.js'

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
                <Route path="/" component={Home} />



            </Routes>
        </div>
    );
}

export default App;
