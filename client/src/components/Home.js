// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Rehla</h1>
            <Link to="/products">
                <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
                    Product List
                </button>
            </Link>
            <Link to="/create-user">
                <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
                    Create User
                </button>
            </Link>
        </div>
    );
};

export default Home;
