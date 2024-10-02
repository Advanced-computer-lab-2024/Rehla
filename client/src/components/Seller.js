// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api'; 
import { updateProduct } from '../services/api'; 

// Import the API call function

const selleraccess = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                setError('Failed to load products');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Product List</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '300px' }}>
                        <h2>{product.Product_Name}</h2>
                        <p>Price: ${product.Price.toFixed(2)}</p>
                        <p>{product.Description}</p>
                    </div>
                ))}
            </div>
            {/* Navigation button to go back to the home page */}
            <Link to="/">
                <button style={{ marginTop: '20px' }}>Back to Home</button>
            </Link>
        </div>
    );
};

export default selleraccess;
