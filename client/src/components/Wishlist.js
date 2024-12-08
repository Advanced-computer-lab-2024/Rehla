import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { viewMyWishlist, getTouristProfile, deleteProductFromMyWishList } from '../services/api';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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

    const handleRemoveFromWishlist = async (productId, productName) => {
        const email = localStorage.getItem('email');
        if (!email) {
            alert('You must be logged in to remove items from the wishlist.');
            return;
        }

        try {
            await deleteProductFromMyWishList(email, productName);
            setWishlistProducts((prevWishlist) => prevWishlist.filter(product => product._id !== productId));
            alert(`Successfully removed ${productName} from your wishlist.`);
        } catch (error) {
            console.error(error);
            alert('Failed to remove product from wishlist. Please try again.');
        }
    };

    const handleNavigateToProduct = (product) => {
        console.log(`Navigating to product details for: ${product.Product_Name}`);
    };

    return (
        <div>
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
                    <Link to="/Wishlist" className="text-lg font-medium text-logoOrange hover:text-logoOrange">Wishlist</Link>
                    <Link to="/products" className="text-lg font-medium text-white">Gift Shop</Link>
                    <Link to="/eventsplaces" className="text-lg font-medium text-white hover:text-logoOrange">Transportation</Link>
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
                            <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <h3 className="text-xl font-medium mb-2 cursor-pointer" onClick={() => handleNavigateToProduct(product)}>
                                    {product.Product_Name}
                                </h3>
                                <img 
                                    src={product.Picture} 
                                    alt={product.Product_Name} 
                                    className="w-full h-48 object-cover rounded-lg mt-4"
                                />
                                <p className="text-lg font-semibold">{product.Price} {currency}</p>
                                <p className="text-gray-600 mb-2">{product.Description}</p>
                                <p className="text-gray-500">Seller: {product.Seller_Name}</p>
                                <p className="text-gray-500">Quantity: {product.Quantity}</p>
                                <p className="text-gray-500">Rating: {product.Rating || 'N/A'} ({product.Reviews || 0} reviews)</p>
                                <p className="text-gray-500">Sold: {product.Saled}</p>
                                <div className="flex justify-between items-center">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                                        onClick={() => handleRemoveFromWishlist(product._id, product.Product_Name)}
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

export default Wishlist;
