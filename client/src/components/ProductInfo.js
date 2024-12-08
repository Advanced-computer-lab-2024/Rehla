import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons';
import { getProducts, getProductsSortedByRating, productRateReview, createwishlistItem, checkoutOrder, getTouristProfile, viewOrderDetails ,addToCart} from '../services/api';

const ProductInfo = () => {    
  const location = useLocation(); // Ensure this is called at the top level
  const navigate = useNavigate();
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

  if (!location.state || !location.state.product) {
    return <div>Product not found</div>;
  }

  const { product } = location.state;

  return (
    <div>
      <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
        <div className="flex items-center">                
          {/* Logo */}
          <img src={logo} alt="Logo" className="w-44" />

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
            <nav className="flex space-x-4 ml-2">
              <Link to="/Cart">
                <FontAwesomeIcon icon={faShoppingCart} />
              </Link>
            </nav>
            <nav className="flex space-x-4 ml-2">
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

      {/* Main Content */}
      <div className="flex-grow max-w-full mx-auto p-24">
        {product ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.Product_Name}</h1>
            <img src={product.Picture} alt={product.Product_Name} className="w-full max-w-md mx-auto mb-8" />
            <p className="text-gray-600 mb-4">{product.Description}</p>
            <p className="text-2xl font-bold text-gray-800 mb-4">Price: ${product.Price}</p>
            <p className="text-gray-600 mb-4">Quantity: {product.Quantity}</p>
            <p className="text-gray-600 mb-4">Seller Name: {product.Seller_Name}</p>
            <p className="text-gray-600 mb-4">Rating: {product.Rating}</p>
            <p className="text-gray-600 mb-4">Reviews: {product.Reviews}</p>
            <p className="text-gray-600 mb-4">Archived: {product.Archived ? 'Yes' : 'No'}</p>
            <p className="text-gray-600 mb-4">Sold: {product.Saled}</p>
            
          </div>

          

        ) : (
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">No product details</h1>
        )}
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
      <div className="mt-6">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
      </div>
    </div>
  </footer>
);

export default ProductInfo;
