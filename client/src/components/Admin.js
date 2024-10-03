// src/components/Admin.js
import React, { useEffect, useState } from 'react';
import { getProducts, searchProductByName } from '../services/api'; // Import the API call function

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProducts, setShowProducts] = useState(false); // State to control product list visibility
    const [searchInput, setSearchInput] = useState(''); // State for search input
    const [searchResult, setSearchResult] = useState(null); // State for search result

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
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

    const handleToggleProducts = () => {
        setShowProducts(!showProducts); // Toggle the visibility of the product list
    };

    const handleSearch = async () => {
        try {
            const result = await searchProductByName(searchInput); // Call search API
            setSearchResult(result);
        } catch (error) {
            setSearchResult(null);
            setError('Product not found');
        }
    };

    const handleInputChange = (e) => {
        setSearchInput(e.target.value); // Update search input state
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={handleToggleProducts}>
                {showProducts ? 'Hide Products' : 'View Products'}
            </button>

            {showProducts && (
                <div>
                    <h2>Product List</h2>
                    <input 
                        type="text" 
                        value={searchInput} 
                        onChange={handleInputChange} 
                        placeholder="Search products by name" 
                    />
                    <button onClick={handleSearch}>Search</button>

                    {searchResult ? (
                        <div style={{ marginTop: '20px' }}>
                            <h3>Search Result:</h3>
                            <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>
                                <h3>{searchResult.Product_Name}</h3>
                                <p>Price: ${searchResult.Price.toFixed(2)}</p>
                                <p>{searchResult.Description}</p>
                            </div>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '300px' }}>
                                <h3>{product.Product_Name}</h3>
                                <p>Price: ${product.Price.toFixed(2)}</p>
                                <p>{product.Description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
