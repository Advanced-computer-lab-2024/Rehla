import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faBell } from '@fortawesome/free-solid-svg-icons';
import { getProducts, getProductsSortedByRating, productRateReview, createwishlistItem, checkoutOrder, getTouristProfile, viewOrderDetails, addToCart } from '../services/api';

const ProductInfo = () => {    
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const email = localStorage.getItem('email');

  const handleViewOrderDetails = async () => {
    if (!email) {
      setError('No email found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await viewOrderDetails(email);
      // Handle cart details if needed
    } catch (err) {
      setError('Failed to fetch cart details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productName) => {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('You must be logged in to add to the wishlist.');
      return;
    }

    try {
      await createwishlistItem(email, productName);
      alert('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      alert('There was an issue adding the product to your wishlist.');
    }
  };

  const handleAddToCart = async (productName) => {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('You must be logged in to add to the cart.');
      return;
    }

    try {
      const response = await addToCart(email, productName);
      alert(response.message);
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      alert('There was an issue adding the product to your cart.');
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
          <img src={logo} alt="Logo" className="w-44" />
          <div className="flex items-center ml-auto">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)} 
              className="rounded p-1 mx-2 bg-transparent text-white"
            >
              <option value="USD" className="bg-black hover:bg-gray-700">USD</option>
              <option value="EUR" className="bg-black hover:bg-gray-700">EUR</option>
              <option value="GBP" className="bg-black hover:bg-gray-700">GBP</option>
              <option value="JPY" className="bg-black hover:bg-gray-700">JPY</option>
              <option value="CAD" className="bg-black hover:bg-gray-700">CAD</option>
              <option value="AUD" className="bg-black hover:bg-gray-700">AUD</option>
            </select>
            <nav className="flex space-x-4 ml-2">
              <Link to="/Cart">
                <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
              </Link>
              <Link to="/TouristHome/TouristProfile">
                <div>
                  {formData.Profile_Pic ? (
                    <img
                      src={formData.Profile_Pic}
                      alt={`${formData.Username}'s profile`}
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
          <Link to="/" className="text-lg font-medium text-white hover:text-logoOrange">Home</Link>
          <Link to="/UpcomingActivities" className="text-lg font-medium text-white hover:text-logoOrange">Activities</Link>
          <Link to="/UpcomingItineraries" className="text-lg font-medium text-white hover:text-logoOrange">Itineraries</Link>
          <Link to="/HistoricalPlaces" className="text-lg font-medium text-white hover:text-logoOrange">Historical Places</Link>
          <Link to="/Museums" className="text-lg font-medium text-white hover:text-logoOrange">Museums</Link>
          <Link to="/Wishlist" className="text-lg font-medium text-white hover:text-logoOrange">Wishlist</Link>
          <Link to="/products" className="text-lg font-medium text-logoOrange">Gift Shop</Link>
          <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-logoOrange">Transportation</Link>
        </nav> 
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-full mx-auto p-24 flex">
  {/* Product Image */}
  <div className="flex-none w-2/3 pr-4">
    <img 
      src={product.Picture} 
      alt={product.Product_Name} 
      className="w-full max-w-2xl mx-auto rounded-lg" // Increased max width for a wider image
    />
  </div>

          {/* Product Info and Buttons */}
          <div className="flex-grow pl-8"> {/* Added padding-left for spacing */}
    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.Product_Name}</h1>
    <p className="text-gray-600 mb-4">{product.Description}</p>
    <p className="text-2xl font-bold text-gray-800 mb-4">Price: ${product.Price}</p>
    <p className="text-gray-600 mb-4">Quantity: {product.Quantity}</p>
    <p className="text-gray-600 mb-4">Seller Name: {product.Seller_Name}</p>
    <p className="text-gray-600 mb-4">Rating: {product.Rating}</p>
    <p className="text-gray-600 mb-4">Reviews: {product.Reviews}</p>
    <p className="text-gray-600 mb-4">Archived: {product.Archived ? 'Yes' : 'No'}</p>
    <p className="text-gray-600 mb-4">Sold: {product.Saled}</p>

    {/* Add to Cart Button */}
    <button
      onClick={() => handleAddToCart(product.Product_Name)}
      className="mt-4 w-60 py-2 px-4 flex items-center justify-center bg-black text-white rounded-full" // Rounded edges
    >
      <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
      Add to Cart
    </button>

    {/* Add to Wishlist Button */}
    <button
      onClick={() => handleAddToWishlist(product.Product_Name)}
      className="mt-2 w-60 py-2 px-4 flex items-center justify-center bg-red-500 text-white rounded-full" // Rounded edges
    >
      <FontAwesomeIcon icon={faHeart} className="mr-1" />
      Add to Wishlist
    </button>
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
          {/* Logo or branding */}
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
