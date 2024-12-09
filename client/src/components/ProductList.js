import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons';
import { getProducts, getProductsSortedByRating, productRateReview, createwishlistItem, checkoutOrder, getTouristProfile, viewOrderDetails ,addToCart} from '../services/api';

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
    const [formData, setFormData] = useState({
        Email: '',
        Username: '',
        Password: '',
        Mobile_Number: '',
        Nationality: '',
        Job_Student: '',
        Type: '',
        Points: 0, 
        Badge: '',
      });

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
    const [isInWishlist, setIsInWishlist] = useState(false);

    const [orderData, setOrderData] = useState({
        Email: '', // Initialize email
        Address: '', // Initialize address
        Payment_Method: '', // Initialize payment method
    });
    const [message, setMessage] = useState(''); // State to hold success or error messages

    const [cartDetails, setCartDetails] = useState([]); // State for cart details
    const [errorr, setErrorr] = useState(null); // State for errors
    const [loadingg, setLoadingg] = useState(false); // State for loading status

    const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage

    const navigate = useNavigate();

    const handleViewOrderDetails = async () => {
        if (!email) {
            setError('No email found');
            return;
        }

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const response = await viewOrderDetails(email);
            setCartDetails(response.cartDetails); // Store cart details in state
        } catch (err) {
            setError('Failed to fetch cart details.');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product) => {
        navigate('/productinfo', { state: { product } });
    };
    

    
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const email = localStorage.getItem('email');
            const profileData = await getTouristProfile({ Email: email });
            //setTourist(profileData);
            setFormData(profileData);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        };
        fetchProfile();
    }, []);


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
        setIsInWishlist(!isInWishlist); // Toggle wishlist state
        const email = localStorage.getItem('email'); // Get email from local storage
        if (!email) {
        alert('You must be logged in to add to the wishlist.');
        return;
        }

        try {
        // Call the createWishlistItem function
        await createwishlistItem( email,productName );
        alert('Product added to wishlist!');
        } catch (error) {
        console.error('Error adding product to wishlist:', error);
        alert('There was an issue adding the product to your wishlist.');
        }
    };

 // Handle input changes
 const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prevData => ({
        ...prevData,
        [name]: value
    }));
};

// Function to handle order checkout
const handleCheckout = async () => {
    try {
        const response = await checkoutOrder(orderData); // Call the API function
        setMessage(response.message); // Display success message
        setError(''); // Clear any existing errors
    } catch (err) {
        setError(err.message); // Display error message
        setMessage(''); // Clear success message
    }
};


const handleAddToCart = async (productName) => {
    const email  = localStorage.getItem('email');
    // Get email from local storage
    if (!email) {
        alert('You must be logged in to add to the cart.');
        return;
    }

    try {
        // Call the addToCart function
        const response = await addToCart( email, productName );
        if (response.error) {
            throw new Error(response.error);
        }
        alert(response.message);
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        alert('There was an issue adding the product to your cart.');
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
            <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Search Form */}
                    <form onSubmit={handleSearchProducts} className="flex items-center ml-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-full px-72 py-2 w-full max-w-2xl text-sm pl-2"
                    />

                        <button type="submit" className="bg-white text-black rounded-full ml-2 p-2">
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
                    <div className="flex items-center ml-auto">
                        <select 
                            value={currency} 
                            onChange={handleCurrencyChange} 
                            className="rounded p-1 mx-2 bg-transparent text-white"
                        >
                            <option value="USD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">USD</option>
                            <option value="EUR" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">EUR</option>
                            <option value="GBP" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">GBP</option>
                            <option value="JPY" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">JPY</option>
                            <option value="CAD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">CAD</option>
                            <option value="AUD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">AUD</option>
                        </select>
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/Cart">
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </Link>
                        </nav>
                        
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/TouristHome/TouristProfile">
                                {/* Profile Picture */}
                                <div className="">
                                    {formData.Profile_Pic ? (
                                        <img
                                            src={formData.Profile_Pic}
                                            alt={`${formData.Name}'s profile`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-black text-white text-center flex items-center justify-center border-4 border-white">
                                            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </nav>
                    </div>


                </div>

                {/* Main Navigation */}
                <nav className="flex space-x-6">
                    <Link to="/" className="text-lg font-medium text-white hover:text-logoOrange">
                        Home
                    </Link>
                    <Link to="/UpcomingActivities" className="text-lg font-medium text-white hover:text-logoOrange">
                        Activities
                    </Link>
                    <Link to="/UpcomingItineraries" className="text-lg font-medium text-white hover:text-LogoOrange">
                        Itineraries
                    </Link>
                    <Link to="/HistoricalPlaces" className="text-lg font-medium text-white hover:text-logoOrange">
                        Historical Places
                    </Link>
                    <Link to="/Museums" className="text-lg font-medium text-white hover:text-logoOrange">
                        Museums
                    </Link>
                    <Link to="/Wishlist" className="text-lg font-medium text-white hover:text-logoOrange">
                        Wishlist
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-logoOrange">
                        Gift Shop
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-logoOrange">
                        Transportation
                    </Link>
                </nav>            
            </div>
        <div className="container mx-auto px-4 py-10">

        

          
            {/*<h1 className="text-4xl font-bold text-center mb-8">Products List</h1>*/}
         
            <div className="mb-8 mt-8">

            <div className="mt-4">
            <img
                src="https://mrbrainwashartmuseum.com/wp-content/uploads/2022/06/GIFT_SHOP_4.gif"
                alt="Product Image"
                className="w-full h-auto max-h-[500px] object-cover"
            />
            </div>


                {/* Filter and Sort Section */}
                <div className="flex space-x-4 items-end justify-end mt-6">
                    <div className="flex space-x-2 items-center">
                        <label className="font-medium">Min Price:</label>
                        <input
                            type="number"
                            name="minPrice"
                            value={priceFilters.minPrice}
                            onChange={handleFilterChange}
                            className="border border-gray-300 rounded-full px-4 py-2 w-24"
                        />
                    </div>
                    <div className="flex space-x-2 items-center">
                        <label className="font-medium">Max Price:</label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={priceFilters.maxPrice}
                            onChange={handleFilterChange}
                            className="border border-gray-300 rounded-full px-4 py-2 w-24"
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={handleFilterProducts} 
                        className="bg-black w-36 text-white px-6 py-2 rounded-full"
                     >
                        Apply Filter
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleSortProductsByRating} 
                        className="bg-logoOrange w-52 text-white px-6 py-2 rounded-full"
                    >
                        Sort by Rating
                    </button>
                </div>
               
            </div>

            {/* Conditionally Render Products */}
            {isSearched ? (
                <div className="mt-8">
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
                        <div
                            key={product._id}
                            className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => handleProductClick(product)}
                        >
                            <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                            <img
                                src={product.Picture}
                                alt={product.Product_Name}
                                className="w-full h-48 object-cover rounded-lg mt-4"
                            />
                            <p className="mt-2 text-lg font-semibold">{convertPrice(product.Price)} {currency}</p>
                            <p className="text-gray-600 mt-2">{product.Description}</p>
                            {/* Heart Button */}
   
                <button
                    onClick={() => handleAddToWishlist(product.Product_Name)}
                    className="mt-4 w-full py-2 px-4 flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                        <button
                            onClick={() => handleAddToWishlist(product.Product_Name)}
                            className="mt-4 w-full py-2 px-4 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleAddToCart(product.Product_Name)}
                            className="mt-4 w-full py-2 px-4 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </button>
                    </svg>
                </button>
                <button
                    onClick={() => handleAddToCart(product.Product_Name)}
                    className="mt-4 w-full py-2 px-4 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>

        
                        </div>
                    ))}
                </div>
            )}
        {/*
            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Search Results:</h3>
                {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map(product => (
                            <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
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
                 : isFiltered ? (
                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold mb-4">Filtered Products:</h3>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {sortedProducts.map(product => (
                                    <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleProductClick(product)}>
                                <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                                <img src={product.Picture} alt={product.Product_Name} className="w-full h-48 object-cover rounded-lg mt-4" />
                                <p className="mt-2 text-lg font-semibold">{convertPrice(product.Price)} {currency}</p>
                                <p className="text-gray-600 mt-2">{product.Description}</p>

                            </div>
                        ))}
                    </div>
                );*/}


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
            <button type="submit" className="bg-black text-white px-6 py-3 rounded">Submit Review</button>
          </form>
        </div>

        
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>checkout</h1>
            
            {/* Checkout Section */}
            <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
                <h3 style={{ textAlign: 'center', color: '#555' }}>Checkout Your Order</h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="email" style={{ marginBottom: '5px', color: '#333' }}>Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="Email"
                            value={orderData.Email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                outline: 'none',
                                fontSize: '14px',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="address" style={{ marginBottom: '5px', color: '#333' }}>Address:</label>
                        <input
                            id="address"
                            type="text"
                            name="Address"
                            value={orderData.Address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                outline: 'none',
                                fontSize: '14px',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="payment-method" style={{ marginBottom: '5px', color: '#333' }}>Payment Method:</label>
                        <select
                            id="payment-method"
                            name="Payment_Method"
                            value={orderData.Payment_Method}
                            onChange={handleChange}
                            style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                outline: 'none',
                                fontSize: '14px',
                                backgroundColor: '#fff',
                            }}
                        >
                            <option value="">Select Payment Method</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleCheckout}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        Checkout
                    </button>
                </form>

                {/* Success or Error Messages */}
                {message && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: '#D4EDDA',
                            color: '#155724',
                            border: '1px solid #C3E6CB',
                            borderRadius: '5px',
                        }}
                    >
                        {message}
                    </div>
                )}
                {error && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: '#F8D7DA',
                            color: '#721C24',
                            border: '1px solid #F5C6CB',
                            borderRadius: '5px',
                        }}
                    >
                        {error}
                    </div>
                )}
            </div>
            <div>
            <button
                onClick={handleViewOrderDetails}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                View Order Details
            </button>

            {loading && <p>Loading...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {cartDetails.length > 0 && (
                <div>
                    <h3>Your Cart Details:</h3>
                    <ul>
                        {cartDetails.map((item, index) => (
                            <li key={index}>
                                Product: {item.Productname} | Quantity: {item.Quantity} | Cart Number: {item.Cart_Num}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        </div>
        <Footer />
        </div>
    );

    
};

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

export default ProductList;
