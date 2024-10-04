// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts  , getProductsSortedByRating} from '../services/api'; // Import the API call function

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // States for filters
    const [priceFilters, setPriceFilters] = useState({
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setFilteredProducts(data); // Initially, display all products
            } catch (error) {
                setError('Failed to load products');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products by price
    const handleFilterProducts = (e) => {
        e.preventDefault();
        const { minPrice, maxPrice } = priceFilters;

        const filtered = products.filter(product => {
            const price = product.Price;
            const min = minPrice ? parseFloat(minPrice) : 0; // Default to 0 if not specified
            const max = maxPrice ? parseFloat(maxPrice) : Infinity; // Default to Infinity if not specified
            return price >= min && price <= max;
        });

        setFilteredProducts(filtered);
    };
    const handleSortProductsByRating = async () => {
        try {
            const sorted = await getProductsSortedByRating();
            setSortedProducts(sorted.products);
            setError(null);
        } catch (error) {
            setError(error.message);
            console.error('Failed to fetch sorted products:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setPriceFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Product List</h1>

            {/* Filter Form for Products */}
            <h2>Filter Products by Price</h2>
            <form onSubmit={handleFilterProducts}>
                <label>
                    Min Price:
                    <input
                        type="number"
                        name="minPrice"
                        value={priceFilters.minPrice}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Max Price:
                    <input
                        type="number"
                        name="maxPrice"
                        value={priceFilters.maxPrice}
                        onChange={handleFilterChange}
                    />
                </label>
                <button type="submit">Apply Price Filter</button>
            </form>

            <button onClick={handleSortProductsByRating}>Sort Products by Rating</button>

{/* Display Sorted Products */}
<h2>Sorted Products by Rating</h2>
<ul>
    {sortedProducts.length > 0 ? (
        sortedProducts.map((product) => (
            <li key={product.id}>
                <h3>{product.Product_Name}</h3>
                <p>Rating: {product.Rating}</p> {/* Assuming product has a 'rating' property */}
                <p>Price: ${product.Price}</p> {/* Adjust according to your product structure */}
                <p>Description: {product.Description}</p> {/* Assuming product has a 'description' property */}
                {/* Add any other product attributes you want to display */}
            </li>
        ))
    ) : (
        <p>No products sorted by rating found.</p>
    )}
</ul>


            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '300px' }}>
                            <h2>{product.Product_Name}</h2>
                            <p>Price: ${product.Price.toFixed(2)}</p>
                            <p>{product.Description}</p>
                        </div>
                    ))
                ) : (
                    <p>No products found within the specified price range.</p>
                )}
            </div>

            {/* Navigation button to go back to the home page */}
            <Link to="/">
                <button style={{ marginTop: '20px' }}>Back to Home</button>
            </Link>
        </div>
    );
};

export default ProductList;
