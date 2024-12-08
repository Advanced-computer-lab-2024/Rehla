import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { viewMyWishlist, getTouristProfile } from '../services/api';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons';


const Wishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
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
      const [conversionRates] = useState({
          USD: 1,
          EUR: 0.85,
          GBP: 0.75,
          JPY: 110,
          CAD: 1.25,
          AUD: 1.35
      });  

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

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            const mail = localStorage.getItem('email');
            if (!mail) {
                setError('No email found in local storage.');
                setLoading(false);
                return;
            }

            try {
                const data = await viewMyWishlist(mail);
                setWishlistProducts(data);
            } catch (error) {
                setError('Failed to load wishlist products');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, []);

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleRemoveFromWishlist = (productId) => {
        // Implement the logic to remove the product from the wishlist
        console.log(`Removing product with ID: ${productId}`);
    };

    const handleNavigateToProduct = (product) => {
        // Implement the logic to navigate to the product details page
        console.log(`Navigating to product details for: ${product.Productname}`);
    };

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
                    <Link to="/Wishlist" className="text-lg font-medium text-logoOrange hover:text-logoOrange">
                        Wishlist
                    </Link>
                    <Link to="/products" className="text-lg font-medium text-white">
                        Gift Shop
                    </Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-logoOrange">
                        Transportation
                    </Link>
                </nav>            
            </div>
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold text-center mb-8">Wishlist</h1>
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-10">{error}</div>
                ) : wishlistProducts.length === 0 ? (
                    <div className="text-center py-10">Your wishlist is empty.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistProducts.map(product => (
                            <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <img
                                    src={product.Picture || 'https://via.placeholder.com/150'} // Use a placeholder image if product.Picture is not available
                                    alt={product.Productname}
                                    className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                                    onClick={() => handleNavigateToProduct(product)}
                                />
                                <h3 className="text-xl font-medium mb-2 cursor-pointer" onClick={() => handleNavigateToProduct(product)}>
                                    {product.Productname}
                                </h3>
                                <p className="text-gray-600 mb-2">{product.Description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">{product.Price} {product.Currency}</p>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
        </div>
    );
};

export default Wishlist;
