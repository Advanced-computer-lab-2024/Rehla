// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProductList from './components/ProductList';
import CreateUser from './components/CreateUser';
import GetTourist from '../src/components/signup';
import RegisterRequest from './components/signup2';
import SignIn from './components/signin';
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

            </Routes>
        </div>
    );
}

export default App;
