import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getProductsSortedByRating } from '../services/api'; // Import the search API call

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
        setIsFiltered(false); // Clear other views
        setIsSorted(false);
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
        setIsSearched(false); // Clear other views
        setIsSorted(false);
    };

    // Sort products by rating
    const handleSortProductsByRating = async () => {
        try {
            const sorted = await getProductsSortedByRating();
            setSortedProducts(sorted.products);
            setIsSorted(true); // Show sorted products after button press
            setIsSearched(false); // Clear other views
            setIsFiltered(false);
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
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-8">Product List</h1>

            {/* Search, Filter, and Sort Section */}
            <div className="mb-8">
                <form onSubmit={handleSearchProducts} className="flex items-center space-x-4">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by product name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-80"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">Search</button>

                    {/* Filter */}
                    <div className="flex space-x-4 items-center">
                        <div className="flex space-x-2 items-center">
                            <label className="font-medium">Min Price:</label>
                            <input
                                type="number"
                                name="minPrice"
                                value={priceFilters.minPrice}
                                onChange={handleFilterChange}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-24"
                            />
                        </div>
                        <div className="flex space-x-2 items-center">
                            <label className="font-medium">Max Price:</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={priceFilters.maxPrice}
                                onChange={handleFilterChange}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-24"
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleFilterProducts} 
                            className="bg-green-500 w-36 text-white px-6 py-2 rounded-lg"
                        >
                            Apply Filter
                        </button>
                    </div>

                    {/* Sort */}
                    <button 
                        type="button" 
                        onClick={handleSortProductsByRating} 
                        className="bg-indigo-500 w-52 text-white px-6 py-2 rounded-lg"
                    >
                        Sort by Rating
                    </button>
                </form>
            </div>

            {/* Conditionally Render Products */}
            {isSearched ? (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">Search Results:</h3>
                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.map(product => (
                                <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                                    <img 
                                        src={product.Picture} 
                                        alt={product.Product_Name} 
                                        className="w-full h-48 object-cover rounded-lg mt-4"
                                    />
                                    <p className="mt-2 text-lg font-semibold">${product.Price.toFixed(2)}</p>
                                    <p className="text-gray-600 mt-2">{product.Description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found with the name "{searchTerm}".</p>
                    )}
                </div>
            ) : isFiltered ? (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">Filtered Products:</h3>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                                    <img 
                                        src={product.Picture} 
                                        alt={product.Product_Name} 
                                        className="w-full h-48 object-cover rounded-lg mt-4"
                                    />
                                    <p className="mt-2 text-lg font-semibold">${product.Price.toFixed(2)}</p>
                                    <p className="text-gray-600 mt-2">{product.Description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found within the specified price range.</p>
                    )}
                </div>
            ) : isSorted ? (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">Sorted Products by Rating:</h3>
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedProducts.map(product => (
                                <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                                    <img 
                                        src={product.Picture} 
                                        alt={product.Product_Name} 
                                        className="w-full h-48 object-cover rounded-lg mt-4"
                                    />
                                    <p className="mt-2 text-lg font-semibold">${product.Price.toFixed(2)}</p>
                                    <p className="text-gray-600 mt-2">{product.Description}</p>
                                    <p className="text-yellow-500 font-bold mt-2">Rating: {product.Rating.toFixed(1)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products available for sorting by rating.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                            <img 
                                src={product.Picture} 
                                alt={product.Product_Name} 
                                className="w-full h-48 object-cover rounded-lg mt-4"
                            />
                            <p className="mt-2 text-lg font-semibold">${product.Price.toFixed(2)}</p>
                            <p className="text-gray-600 mt-2">{product.Description}</p>
                            <p className="text-yellow-500 font-bold mt-2">Rating: {product.Rating.toFixed(1)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
