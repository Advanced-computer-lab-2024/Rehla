import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { getProducts, getProductsSortedByRating } from '../services/api'; // Import the search API call
const Header = () => (
    <div className="NavBar">
    <img src={logo} alt="Logo" />
    <nav className="main-nav">
        <ul className="nav-links">
            <Link to="/TouristHome">Home</Link>
            <Link to="/MyEvents">Events/Places</Link>
        </ul>
    </nav>

    <nav className="signing">
        <Link to="/TouristHome/TouristProfile">My Profile</Link>
    </nav>
</div>
);


const Footer = () => (
    <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
    <div className="w-full mx-auto md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src={logo} className="w-12" alt="Flowbite Logo" />
            </a>
            <div className="flex justify-center w-full">
                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 -ml-14">
                    <li>
                        <a href="/" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                    <li>
                        <a href="/" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/" className="hover:underline me-4 md:me-6">Licensing</a>
                    </li>
                    <li>
                        <a href="/" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
    </div>
</footer>
);
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
        <div>
        <div className="container mx-auto px-4 py-10">
            <Header/>
            <h1 className="text-4xl font-bold text-center mb-8">Products List</h1>

            {/* Search, Filter, and Sort Section */}
            <div className="mb-8">
                <form onSubmit={handleSearchProducts} className="flex flex-col items-center">
                    {/* Search */}
                    <div className="flex justify-center mb-4 w-full">
                        <input
                            type="text"
                            placeholder="Search by product name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-full px-6 py-3 w-full max-w-3xl" // Increased max-width
                        />
                        <button type="submit" className="bg-brandBlue text-white px-6 py-3 rounded-full ml-2">Search</button>
                    </div>
                </form>

                {/* Filter and Sort Section */}
                <div className="flex space-x-4 items-center justify-center">
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
                        className="bg-brandBlue w-36 text-white px-6 py-2 rounded-lg"
                     >
                        Apply Filter
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleSortProductsByRating} 
                        className="bg-logoOrange w-52 text-white px-6 py-2 rounded-lg"
                    >
                        Sort by Rating
                    </button>
                </div>
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
                                    <p className="mt-2 text-lg font-semibold">${product.Price}</p>
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
                                    <p className="mt-2 text-lg font-semibold">${product.Price}</p>
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
                                    <p className="mt-2 text-lg font-semibold">${product.Price}</p>
                                    <p className="text-gray-600 mt-2">{product.Description}</p>
                                    <p className="text-yellow-500 font-bold mt-2">Rating: {product.Rating}</p>
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
                            <p className="mt-2 text-lg font-semibold">${product.Price}</p>
                            <p className="text-gray-600 mt-2">{product.Description}</p>
                            <p className="text-yellow-500 font-bold mt-2">Rating: {product.Rating}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
        <Footer />
        </div>
    );
};

export default ProductList;
