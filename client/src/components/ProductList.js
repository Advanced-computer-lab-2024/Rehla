import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getProductsSortedByRating, searchProductByName } from '../services/api'; // Import the search API call
import logo from '../images/mini pyramid.jpeg';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilters, setPriceFilters] = useState({ minPrice: '', maxPrice: '' });
    const [error, setError] = useState(null);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

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

    // Search products by name
    const handleSearchProducts = (e) => {
        e.preventDefault();
        const results = products.filter(product => 
            product.Product_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setIsSearched(true); // Show search results after button press
    };

    // Filter products by price
    const handleFilterProducts = (e) => {
        e.preventDefault();
        const { minPrice, maxPrice } = priceFilters;
        const filtered = products.filter(product => {
            const price = product.Price;
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
            return price >= min && price <= max;
        });
        setFilteredProducts(filtered);
        setIsFiltered(true); // Show filtered products after button press
    };

    // Sort products by rating
    const handleSortProductsByRating = async () => {
        try {
            const sorted = await getProductsSortedByRating();
            setSortedProducts(sorted.products);
            setIsSorted(true); // Show sorted products after button press
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
        <div style={{ padding: '20px' }}>
            <h1>Product List</h1>

            {/* Search Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2>Search Product by Name</h2>
                <form onSubmit={handleSearchProducts} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search by product name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', width: '200px' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px' }}>Search</button>
                </form>
            </div>

            {/* All Products (Only shown when no search is active) */}
            {!isSearched && (
                <div>
                    <h2>All Products</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        {products.map(product => (
                            <div key={product._id} style={productCardStyle}>
                                <h3>{product.Product_Name}</h3>
                                <img src={logo} style={{ width: '100px', height: '100px', objectFit: 'cover' }} alt="" />
                                <p>Price: ${product.Price.toFixed(2)}</p>
                                <p>{product.Description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Results Output (Only shown when a search is active) */}
            {isSearched && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Search Results:</h3>
                    {searchResults.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            {searchResults.map(product => (
                                <div key={product._id} style={productCardStyle}>
                                    <h3>{product.Product_Name}</h3>
                                    <img src={logo} style={{ width: '100px', height: '100px', objectFit: 'cover' }} alt="" />
                                    <p>Price: ${product.Price.toFixed(2)}</p>
                                    <p>{product.Description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found with the name "{searchTerm}".</p>
                    )}
                </div>
            )}

            {/* Filter Section */}
            <div style={{ marginTop: '40px' }}>
                <h2>Filter Products by Price</h2>
                <form onSubmit={handleFilterProducts} style={{ display: 'flex', gap: '10px' }}>
                    <label>
                        Min Price:
                        <input
                            type="number"
                            name="minPrice"
                            value={priceFilters.minPrice}
                            onChange={handleFilterChange}
                            style={{ padding: '8px', marginLeft: '10px' }}
                        />
                    </label>
                    <label>
                        Max Price:
                        <input
                            type="number"
                            name="maxPrice"
                            value={priceFilters.maxPrice}
                            onChange={handleFilterChange}
                            style={{ padding: '8px', marginLeft: '10px' }}
                        />
                    </label>
                    <button type="submit" style={{ padding: '8px 16px' }}>Apply Price Filter</button>
                </form>

                {/* Filtered Products Output (shown only after filter button is pressed) */}
                {isFiltered && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>Filtered Products:</h3>
                        {filteredProducts.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                                {filteredProducts.map(product => (
                                    <div key={product._id} style={productCardStyle}>
                                        <h3>{product.Product_Name}</h3>
                                        <p>Price: ${product.Price.toFixed(2)}</p>
                                        <p>{product.Description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No products found within the specified price range.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Sorting Section */}
            <div style={{ marginTop: '40px' }}>
                <h2>Sort Products by Rating</h2>
                <button onClick={handleSortProductsByRating} style={{ padding: '8px 16px', marginBottom: '20px' }}>
                    Sort Products
                </button>

                {/* Sorted Products Output (shown only after sort button is pressed) */}
                {isSorted && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map(product => (
                                <div key={product._id} style={productCardStyle}>
                                    <h3>{product.Product_Name}</h3>
                                    <p>Rating: {product.Rating}</p>
                                    <p>Price: ${product.Price.toFixed(2)}</p>
                                    <p>{product.Description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No products sorted by rating found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation button */}
            <Link to="/" style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}>
                <button style={{ padding: '8px 16px' }}>Back to Home</button>
            </Link>
        </div>
    );
};

// Define a common style for product cards
const productCardStyle = {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '10px',
    width: '250px',
    textAlign: 'center'
};

export default ProductList;
