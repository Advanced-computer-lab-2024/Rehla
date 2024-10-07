import React, { useEffect, useState } from 'react';
//import { Link } from 'react-router-dom';
import { getProducts, getProductsSortedByRating, addProduct  } from '../services/api';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilters, setPriceFilters] = useState({ minPrice: '', maxPrice: '' });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // New success message state
    const [isFiltered, setIsFiltered] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [newProduct, setNewProduct] = useState({
        Product_Name: '', Picture: '', Price: '', Quantity: '',
        Seller_Name: '', Description: '', Rating: '', Reviews: ''
    });
   


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

    const handleSearchProducts = (e) => {
        e.preventDefault();
        const results = products.filter(product =>
            product.Product_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setIsSearched(true);
    };

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
        setIsFiltered(true);
    };

    const handleSortProductsByRating = async () => {
        try {
            const sorted = await getProductsSortedByRating();
            setSortedProducts(sorted.products);
            setIsSorted(true);
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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const addedProduct = await addProduct(newProduct);
            setProducts([...products, addedProduct]);
            setSuccessMessage('Product added successfully!'); // Set success message
            setNewProduct({
                Product_Name: '', Picture: '', Price: '', Quantity: '',
                Seller_Name: '', Description: '', Rating: '', Reviews: ''
            });
        } catch (err) {
            setError('Failed to add product');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
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
                                <p>Price: ${product.Price}</p>
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

                {/* Filtered Products Output */}
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

                {/* Sorted Products Output */}
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

            {/* Add Product Section */}
            <div style={{ marginTop: '40px' }}>
                <h2>Add a New Product</h2>
                <form onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        name="Product_Name"
                        placeholder="Product Name"
                        value={newProduct.Product_Name}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                    <input
                        type="text"
                        name="Picture"
                        placeholder="Product Image URL"
                        value={newProduct.Picture}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                    <input
                        type="number"
                        name="Price"
                        placeholder="Price"
                        value={newProduct.Price}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                    <input
                        type="number"
                        name="Quantity"
                        placeholder="Quantity"
                        value={newProduct.Quantity}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                    <input
                        type="text"
                        name="Seller_Name"
                        placeholder="Seller Name"
                        value={newProduct.Seller_Name}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                     <input
                        type="text"
                        name="Description"
                        placeholder="Description"
                        value={newProduct.Description}
                        onChange={handleInputChange}
                        style={{ padding: '8px', width: '200px' }}
                    />
                    <input
                        type="number"
                        name="Rating"
                        placeholder="Rating"
                        value={newProduct.Rating}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                    <input
                        type="number"
                        name="Reviews"
                        placeholder="Reviews"
                        value={newProduct.Reviews}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', margin: '10px 0', width: '200px' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px' }}>Add Product</button>
                </form>

                {/* Success Message Display */}
                {successMessage && <div style={{ marginTop: '10px', color: 'green' }}>{successMessage}</div>}
            </div>


               

        </div>
    );
};

const productCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    width: '200px',
    textAlign: 'center'
};

export default AdminProductList;
