import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTouristProfile, getProductsInCart } from '../services/api';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [currency, setCurrency] = useState('USD');
  const [conversionRates] = useState({
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    CAD: 1.25,
    AUD: 1.35
  });
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Profile_Pic: ''
  });

  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {
    const email = localStorage.getItem('email');
    const fetchCartDetails = async () => {
        try {
            setLoading(true);
            const details = await getProductsInCart(email);
            setCartDetails(details);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };
    fetchCartDetails();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-44" />
          <div className="flex items-center ml-auto">
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="rounded p-1 mx-2 bg-transparent text-white"
            >
              {Object.keys(conversionRates).map((curr) => (
                <option key={curr} value={curr} className="bg-black hover:bg-gray-700 px-4 py-2 rounded">{curr}</option>
              ))}
            </select>
            <Link to="/Cart" className="ml-2">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            <Link to="/TouristHome/TouristProfile" className="ml-2">
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
            </Link>
          </div>
        </div>

        <nav className="flex space-x-6">
          <Link to="/" className="text-lg font-medium text-white hover:text-logoOrange">Home</Link>
          <Link to="/UpcomingActivities" className="text-lg font-medium text-white hover:text-logoOrange">Activities</Link>
          <Link to="/UpcomingItineraries" className="text-lg font-medium text-white hover:text-logoOrange">Itineraries</Link>
          <Link to="/HistoricalPlaces" className="text-lg font-medium text-white hover:text-logoOrange">Historical Places</Link>
          <Link to="/Museums" className="text-lg font-medium text-white hover:text-logoOrange">Museums</Link>
          <Link to="/Wishlist" className="text-lg font-medium text-white hover:text-logoOrange">Wishlist</Link>
          <Link to="/products" className="text-lg font-medium text-white">Gift Shop</Link>
          <Link to="/Transportation" className="text-lg font-medium text-white hover:text-logoOrange">Transportation</Link>
        </nav>
      </div>

      {/* Main Content - Cart Details */}
      <div className="flex-grow bg-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
        {cartDetails.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartDetails.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                <img
                  src={item.Picture}
                  alt={item.Product_Name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{item.Product_Name}</h4>
                  <p className="text-gray-700">Price: ${item.Price}</p>
                  <p className="text-gray-600">Quantity in Cart: {item.Quantity_In_Cart}</p>
                  <p className="text-gray-600">Available Stock: {item.Quantity_Available}</p>
                  <p className="text-gray-600">Seller: {item.Seller_Name}</p>
                </div>
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                  <button className="bg-logoOrange text-white px-4 py-2 rounded">Remove</button>
                  <p className="text-gray-500">Rating: {item.Rating}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black shadow dark:bg-black">
        <div className="w-full mx-auto md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"></a>
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
    </div>
  );
};

export default Cart;
