import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { getProducts, getProductsSortedByRating, productRateReview, createwishlistItem } from '../services/api'; // Import the search API call
const Header = () => (
    <div className="NavBar">
    <img src={logo} alt="Logo" />
    <nav className="main-nav">
        <ul className="nav-links">
            <Link to="/TouristHome">Home</Link>
            <Link to="/MyEvents">Events/Places</Link>
            <Link to="/Wishlist">Wishlist</Link> {/* New Wishlist link */}
        </ul>
    </nav>

    <nav className="signing">
        <Link to="/TouristHome/TouristProfile">My Profile</Link>
    </nav>
</div>
);

const Footer = () => (
    <footer className="bg-black shadow dark:bg-black m-0">
      <div className="w-full mx-auto md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
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
        <div className="mt-6"> {/* Added a new div to increase the spacing */}
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
        </div>
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

    const [currency, setCurrency] = useState('USD');
    const [conversionRates] = useState({
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35
    });

    const [reviewData, setReviewData] = useState({ productName: '', review: '', rating: '' });

    const convertPrice = (price) => {
        return (price * conversionRates[currency]).toFixed(2);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };
    
      const handleSubmitReview = async (e) => {
        e.preventDefault();
        const Tourist_Email = localStorage.getItem('email');
        if (!Tourist_Email) {
          setError('You must be logged in to leave a review.');
          return;
        }
    
        // Check if the product name exists in the products list
        const product = products.find(p => p.Product_Name === reviewData.productName);
        if (!product) {
          setError('Product not found. Please check the product name.');
          return;
        }
    
        try {
          await productRateReview({
            Tourist_Email,
            Product_Name: reviewData.productName,
            Review: reviewData.review,
            Rating: reviewData.rating
          });
          setReviewData({ productName: '', review: '', rating: '' }); // Reset form
          alert('Review submitted successfully!');
        } catch (error) {
          setError('Failed to submit the review. Please try again.');
          console.error(error);
        }
    };

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

    // Handle adding a product to the wishlist
    const handleAddToWishlist = async (productName) => {
        const email = localStorage.getItem('email'); // Get email from local storage
        if (!email) {
        alert('You must be logged in to add to the wishlist.');
        return;
        }

        try {
        // Call the createWishlistItem function
        await createwishlistItem({ Email: email, Productname: productName });
        alert('Product added to wishlist!');
        } catch (error) {
        console.error('Error adding product to wishlist:', error);
        alert('There was an issue adding the product to your wishlist.');
        }
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
            {/*<h1 className="text-4xl font-bold text-center mb-8">Products List</h1>*/}
         
            <div className="mb-8 mt-8">

            <div className="mt-4">
            <img
                src="https://mrbrainwashartmuseum.com/wp-content/uploads/2022/06/GIFT_SHOP_4.gif"
                alt="Product Image"
                className="w-full h-auto max-h-[500px] object-cover"
            />
            </div>

                    {/* Search and Currency Section */}
                    <div className="mt-10 mb-8 flex justify-end items-center">
                        <form onSubmit={handleSearchProducts} className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by product name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-full px-4 py-2 w-full max-w-2xl text-sm"
                            />
                            <button type="submit" className="bg-black text-white rounded-full ml-2 p-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </form>

                        <div className="flex items-center ml-4">
                            <label htmlFor="currency" className="mb-0 font-medium mr-2">Change currency</label>
                            <select value={currency} onChange={handleCurrencyChange} className="border rounded p-1 bg-white">
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                            </select>
                        </div>
                    </div>


                {/* Filter and Sort Section 
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
                 <label htmlFor="currency" className="mb-1 font-medium">Change currency</label>
                <select value={currency} onChange={handleCurrencyChange} className="border rounded p-1 mx-2 bg-white">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                </select>*/}
               
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
                                    <p className="mt-2 text-lg font-semibold">{convertPrice(product.Price)} {currency}</p>
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
                                    <p className="mt-2 text-lg font-semibold">{convertPrice(product.Price)} {currency}</p>
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
                                    <p className="mt-2 text-lg font-semibold">{convertPrice(product.Price)} {currency}</p>
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
                            <p className="mt-2 text-lg font-semibold">{convertPrice(product.Price)} {currency}</p>
                            <p className="text-gray-600 mt-2">{product.Description}</p>
                            <p className="text-yellow-500 font-bold mt-2">Rating: {product.Rating}</p>
                            <button
                            onClick={() => handleAddToWishlist(product.Product_Name)}
                            className="mt-4 w-full py-2 px-4 bg-logoOrange text-white rounded-lg"
                            >
                            Add to Wishlist
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
        {/* Review Form */}
        <div className="mt-10 max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Submit a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label htmlFor="productName" className="block text-lg">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={reviewData.productName}
                onChange={handleReviewChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-lg">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={reviewData.rating}
                onChange={handleReviewChange}
                min="1"
                max="5"
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="review" className="block text-lg">Review</label>
              <textarea
                id="review"
                name="review"
                value={reviewData.review}
                onChange={handleReviewChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-brandBlue text-white px-6 py-3 rounded">Submit Review</button>
          </form>
        </div>
        <Footer />
        </div>
    );
};

export default ProductList;
