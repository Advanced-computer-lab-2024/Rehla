import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import logo from '../images/logoWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell  } from '@fortawesome/free-solid-svg-icons';
import { getProducts, viewMyProducts, getProductsSortedByRating, addProduct, updateProduct,toggleProductArchiveStatus,uploadProductPicture,fetchSalesReport,getSellerProfile,fetchAllSalesReportsSelleremail ,fetchFilteredSellerSalesReport,createOutOfStockNotifications,markAsSeenns,getNotificationsForseller } from '../services/api';
//import { Link, useNavigate } from 'react-router-dom';

const Header = () => (
    <div className="NavBar">
        <img src={logo} alt="Logo" />
        <nav className="main-nav">
            <ul className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/Sellerproducts">Products</Link>
            </ul>
        </nav>
        <nav className="signing">
            <Link to="/SellerHome/SellerProfile">My Profile</Link>
        </nav>
        
    </div>
);

const Footer = () => (
    <footer className="bg-black shadow dark:bg-black m-0">
        <div className="w-full mx-auto md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="w-12" alt="Flowbite Logo" />
                </a>
                <div className="flex justify-center w-full">
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 -ml-14">
                        <li><a href="/" className="hover:underline me-4 md:me-6">About</a></li>
                        <li><a href="/" className="hover:underline me-4 md:me-6">Privacy Policy</a></li>
                        <li><a href="/" className="hover:underline me-4 md:me-6">Licensing</a></li>
                        <li><a href="/" className="hover:underline">Contact</a></li>
                    </ul>
                </div>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
        </div>
    </footer>
);

const SellerHome = () => {
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
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({ Product_Name: '', Price: '', Description: '', Rating: '' });
    const [newProduct, setNewProduct] = useState({ Product_Name: '',Picture: '' , Price: '', Quantity: '',Seller_Name: '',Description: ''});
    const [isAdding, setIsAdding] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [email] = useState(localStorage.getItem('email')); // Get seller's email from localStorage
    const [report, setReport] = useState(null);
    const [fetchError, setFetchError] = useState(""); // Renamed error state
    const [isLoading, setIsLoading] = useState(false); // Renamed loading state
    const [seller, setSeller] = useState({});
    const [salesReports, setSalesReports] = useState([]);
    const [messagee, setMessagee] = useState('');
    const [reports, setReports] = useState([]);

    const [productFilter, setProductFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [month, setMonth] = useState("");

    const [myProducts, setMyProducts] = useState([]); // New state for my products
    const [notifications, setNotifications] = useState([]); // State for notifications
    const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
    const [showModal, setShowModal] = useState(false); // State to show/hide the modal
    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success
    const [emaill, setEmail] = useState('');
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Shop_Name: '',
        Description: '',
        Shop_Location: '',
        Type: ''
    });





    const navigate = useNavigate();

    const handleFilterFetchSalesReports = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            const reports = await fetchFilteredSellerSalesReport(email, productFilter, startDate, endDate, month); // Send filters to API
            setSalesReports(reports);
            setLoading(false);
        } catch (err) {
            setMessagee("Error fetching filtered sales reports.");
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
    
            const handleNotifyForBookings = async () => {
                try {
                    const response = await createOutOfStockNotifications(storedEmail); // Pass email to notify function
                    setNotificationSuccess(response.message || 'Notifications processed successfully.');
                } catch (err) {
                    setNotificationError(err.message || 'Failed to process notifications.');
                }
            };
    
            handleNotifyForBookings();
        }
    }, []); // This runs only once when the component mounts

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
                if (!storedEmail) {
                    throw new Error("User email not found in local storage.");
                }
    
                // Fetch notifications for the signed-in user
                const data = await getNotificationsForseller(storedEmail);
                setNotifications(data); // Set notifications
                const unread = data.filter((notification) => !notification.seen).length; // Count unread notifications
                setUnreadCount(unread);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
    
        fetchNotifications();
    }, []);
    
    const handleNotificationClick = async () => {
        setShowModal(true); // Show the modal when the notification icon is clicked
    
        try {
            const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
            if (!storedEmail) {
                throw new Error("User email not found in local storage.");
            }
    
            // Mark all unseen notifications for the user as seen
            for (const notification of notifications) {
                if (!notification.seen) {
                    await markAsSeenns(notification._id); // Mark as seen
                }
            }
    
            // Refresh the notifications for the signed-in user
            const updatedNotifications = await getNotificationsForseller(storedEmail);
            setNotifications(updatedNotifications); // Set updated notifications
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };
    

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setUnreadCount(0); // Reset the unread count when the modal is closed
    };
    

    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('email'); // Get email from local storage

            if (!email) {
                navigate('/login'); // Redirect to login if no email found
                return;
            }

            try {
                const response = await getSellerProfile({ Email: email });
                setSeller(response);
                setFormData(response); // Set form data for editing
            } catch (error) {
                setError('Failed to fetch profile. Please try again later.');
            }
        };

        fetchProfile();
    }, [navigate]);

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
        const fetchMyProducts = async () => {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
            console.log(email);
            try {
                if (!email) {
                    setError('No email found. Please sign in again.');
                    return;
                }
                const fetchedProducts = await viewMyProducts(email);
                console.log(fetchedProducts);
                setProducts(fetchedProducts);
            } catch (error) {
                //setError('Failed to load my products');
                console.error(error);
            }
        };
        fetchMyProducts();
    }, []);

    const handleFetchSalesReports = async () => {
        try {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
    
            if (!email) {
                setMessagee('No email found. Please sign in again.');
                return;
            }
    
            const reports = await fetchAllSalesReportsSelleremail(email); // Pass the email to the API function
            setSalesReports(reports);
        } catch (err) {
            setMessagee('Error fetching seller sales reports.');
            console.error(err);
        }
    };
    

 
    

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

    const handleArchiveToggle = async (productName) => {
        try {
            const updatedProduct = await toggleProductArchiveStatus(productName);
            // Update the product list based on response, if needed
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.Product_Name === productName ? updatedProduct.data : product
                )
            );
        } catch (error) {
            console.error('Failed to toggle archive status:', error.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setPriceFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleCardClick = (product) => {
        setUpdatedProduct(product);  // Pre-fill form with product data
        setIsEditing(true);
    };


    
    const handleUpdateProduct = async () => {
        try {
            await updateProduct(updatedProduct); // Call API to update product
            // Update local product list with edited product
            setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    const handleAddProduct = async () => {
        try {
            const addedProduct = await addProduct(newProduct); // Call API to add product
            setProducts([...products, addedProduct]);
            setAlertMessage('Product added successfully!');
        } catch (error) {
            setAlertMessage('Failed to add product.');
            console.error("Failed to add product:", error);
        } finally {
            setIsAdding(false);
            setNewProduct({ Product_Name: '', Price: '', Description: '', Picture: '' }); // Reset new product form
        }
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
          setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
        }
      };
    
      const handleUploadProductPicture = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
    
        const productname = updatedProduct.Product_Name;
        if (!productname) {
            alert('Product name is missing.');
            return;
        }
    
        try {
            const response = await uploadProductPicture(productname, file);
            alert('Product picture uploaded successfully!');
            
            window.location.reload(); // Reload to fetch the new profile picture

        } catch (error) {
            console.error('Error uploading picture:', error);
            alert('Failed to upload picture.');
        }
    };
    

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }
    const handleFetchReport = async () => {
        setFetchError("");
        setIsLoading(true);
        try {
            const reportsData= await fetchSalesReport(seller.Username); // Fetch sales report using email
            setReports(reportsData);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error(err);
                setError('Failed to fetch activity revenue. Please try again later.');
            } finally {
                setLoading(false);
            }
        };


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
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <div className="relative ml-2"> {/* Reduced ml-4 to ml-2 */}
                                <FontAwesomeIcon
                                    icon={faBell}
                                    size="1x" // Increased the size to 2x
                                    onClick={handleNotificationClick}
                                    className="cursor-pointer text-white" // Added text-white to make the icon white
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
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
                <Link to="/SellerHome" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                            My Products
                        </Link>
                        <a onClick={() => setIsAdding(true)} href="#uh" className="text-lg font-medium font-family-cursive text-white hover:text-blue-500">
                            Create
                        </a>
                        <Link to="/SellerHome" className="text-lg font-medium text-white hover:text-blue-500">
                            Reports
                        </Link>
                </nav>            
            </div>
            <div className="container mx-auto px-4 py-10">

                {/* Search, Filter, and Sort Section */}
                <div className="mb-8">
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
                            className="bg-black w-36 text-white px-6 py-2 rounded-lg"
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
                {/* Notification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-xl text-gray-500"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-3 mb-2 rounded-lg ${
                                            notification.seen ? 'bg-gray-100' : 'bg-yellow-100'
                                        }`}
                                    >
                                        <p className="font-semibold">{notification.title}</p>
                                        <p>{notification.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No notifications available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            

               {/* Conditionally Render Products */}
                    {isSearched ? (
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4">Search Results:</h3>
                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchResults.map(product => (
                                        <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleCardClick(product)}>
                                            {product.Picture && (
                                                <img src={product.Picture} alt={product.Product_Name} className="w-full h-40 object-cover mb-4 rounded" />
                                            )}
                                            <h3 className="text-lg font-semibold">{product.Product_Name}</h3>
                                            <p>Price: ${product.Price}</p>
                                            <p>Rating: {product.Rating}</p>
                                            <p>Quantity: {product.Quantity}</p>
                                            <p>Sales: {product.Saled}</p>
                                            <p>{product.Description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No products found matching your search criteria.</p>
                            )}
                        </div>
                    ) : isFiltered ? (
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4">Filtered Products:</h3>
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map(product => (
                                        <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleCardClick(product)}>
                                            {product.Picture && (
                                                <img src={product.Picture} alt={product.Product_Name} className="w-full h-40 object-cover mb-4 rounded" />
                                            )}
                                            <h3 className="text-lg font-semibold">{product.Product_Name}</h3>
                                            <p>Price: ${product.Price}</p>
                                            <p>Rating: {product.Rating}</p>
                                            <p>Quantity: {product.Quantity}</p>
                                            <p>Sales: {product.Saled}</p>
                                            <p>{product.Description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No products found in this price range.</p>
                            )}
                        </div>
                        ) : isSorted ? (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold mb-4">Products Sorted by Rating:</h3>
                                {sortedProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {sortedProducts.map(product => (
                                            <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleCardClick(product)}>
                                                {product.Picture && (
                                                    <img src={product.Picture} alt={product.Product_Name} className="w-full h-40 object-cover mb-4 rounded" />
                                                )}
                                                <h3 className="text-lg font-semibold">{product.Product_Name}</h3>
                                                <p>Price: ${product.Price}</p>
                                                <p>Rating: {product.Rating}</p>
                                                <p>Quantity: {product.Quantity}</p>
                                                <p>Sales: {product.Saled}</p>
                                                <p>{product.Description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No products found.</p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold mb-4">All Products:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map(product => (
                                        <div key={product._id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleCardClick(product)}>
                                            {product.Picture && (
                                                <img src={product.Picture} alt={product.Product_Name} className="w-full h-40 object-cover mb-4 rounded" />
                                            )}
                                            <h3 className="text-lg font-semibold">{product.Product_Name}</h3>
                                            <p>Price: ${product.Price}</p>
                                            <p>Rating: {product.Rating}</p>
                                            <p>Quantity: {product.Quantity}</p>
                                            <p>Sales: {product.Saled}</p>
                                            <p>{product.Description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Update Product Modal */}
                        {isEditing && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-lg p-6 max-w-lg w-full"> {/* Adjusted width here */}
                                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                                        {/* Product Name Display */}
                                        <div className="mb-2">
                                            <h3 className="text-lg font-semibold" >{updatedProduct.Product_Name}</h3>
                                        </div>
                                        {/* Product Picture Input */}
                                        <div>
                                        <div className="mb-2">
                                            <label className="block font-medium">Product Picture:</label>
                                            <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                            {preview && (
                                            <img src={preview} alt="Preview"   className="mt-2 w-32 h-32 rounded-full object-cover"/>
                                            )}
                                        </div>
                                            <button
                                            type="button"
                                            onClick={handleUploadProductPicture}
                                            className="bg-black text-white px-6 py-2 rounded-lg"
                                            >
                                            Upload Product Picture
                                            </button>

                                        </div>
                                        
                                        {/* Price Input */}
                                        <div className="mb-2">
                                            <label className="block font-medium">Price:</label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                value={updatedProduct.Price}
                                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, Price: parseFloat(e.target.value) })}
                                                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                            />
                                        </div>
                                        {/* Quantity Input */}
                                        <div className="mb-2">
                                            <label className="block font-medium">Quantity:</label>
                                            <input
                                                type="number"
                                                placeholder="Enter quantity"
                                                value={updatedProduct.Quantity}
                                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, Quantity: parseFloat(e.target.value) })}
                                                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                            />
                                        </div>
                                        {/* Description Textarea */}
                                        <div className="mb-2">
                                            <label className="block font-medium">Description:</label>
                                            <textarea
                                                placeholder="Enter description"
                                                value={updatedProduct.Description}
                                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, Description: e.target.value })}
                                                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                            />
                                        </div>
                                        {/* Update Button */}
                                        <button 
                                            onClick={handleUpdateProduct} 
                                            className="bg-black text-white px-6 py-2 rounded-lg"
                                        >
                                            Update Product
                                        </button>
                                        {/* Cancel Button */}
                                        <button 
                                            onClick={() => setIsEditing(false)} 
                                            className="bg-red-500 text-white px-6 py-2 rounded-lg ml-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleArchiveToggle(updatedProduct.Product_Name).then(() => {
                                                window.location.reload(); // Refresh the page; // Pass the desired value directly
                                            })}
                                            className="bg-logoOrange text-white px-6 py-2 rounded-lg ml-2"
                                        >
                                            {updatedProduct.Archived ? 'Unarchive' : 'Archive'}
                                        </button>
                                    </div>
                                </div>
                       )}
                         {/* Add Product Form */}
                         {isAdding && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg p-6 max-w-lg w-full pt-32 pb-4"> {/* Adjusted padding */}
                                    <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                                    
                                    {/* Product Name Input */}
                                    <div className="mb-2">
                                        <label className="block font-medium">Product Name:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter product name"
                                            value={newProduct.Product_Name}
                                            onChange={(e) => setNewProduct({ ...newProduct, Product_Name: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                        />
                                    </div>

                                    {/* Product Picture Input */}
                                    <div className="mb-2">
                                        <label className="block font-medium">Product Picture:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter product picture URL"
                                            value={newProduct.Picture}
                                            onChange={(e) => setNewProduct({ ...newProduct, Picture: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                        />
                                    </div>

                                    {/* Price Input */}
                                    <div className="mb-2">
                                        <label className="block font-medium">Price:</label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            value={newProduct.Price}
                                            onChange={(e) => setNewProduct({ ...newProduct, Price: parseFloat(e.target.value) })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                        />
                                    </div>

                                    {/* Quantity Input */}
                                    <div className="mb-2">
                                        <label className="block font-medium">Quantity:</label>
                                        <input
                                            type="number"
                                            placeholder="Enter quantity"
                                            value={newProduct.Quantity}
                                            onChange={(e) => setNewProduct({ ...newProduct, Quantity: parseFloat(e.target.value) })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                        />
                                    </div>

                                    {/* Seller Name Textarea */}
                                    <div className="mb-2">
                                        <label className="block font-medium">Seller Name:</label>
                                        <textarea
                                            placeholder="Enter seller name"
                                            value={newProduct.Seller_Name}
                                            onChange={(e) => setNewProduct({ ...newProduct, Seller_Name: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                        />
                                    </div>

                                    {/* Description Textarea */}
                                    <div className="mb-2">
                                        <label className="block font-medium">Description:</label>
                                        <textarea
                                            placeholder="Enter description"
                                            value={newProduct.Description}
                                            onChange={(e) => setNewProduct({ ...newProduct, Description: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                        />
                                    </div>

                                    {/* Add and Cancel Buttons */}
                                    <button 
                                        onClick={handleAddProduct} 
                                        className="bg-black text-white px-6 py-2 rounded-lg"
                                    >
                                        Add Product
                                    </button>
                                    <button 
                                        onClick={() => setIsAdding(false)} 
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg ml-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}


                </div>
                <div className="p-6 bg-gray-50 min-h-screen">
                    {/* Report Button and Error Message */}
                    <div className="mb-8">
                        <button
                        onClick={handleFetchReport}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-4"
                        >
                        Report
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>

                    {/* Reports Section */}
                    {!loading && !error && reports.length > 0 && (
                        <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Product Revenue Reports</h2>
                        <ul className="space-y-4">
                            {reports.map((report, index) => (
                            <li key={index} className="p-4 bg-white shadow-md rounded-md">
                                <p><strong>Product:</strong> {report.Product}</p>
                                <p><strong>Revenue:</strong> ${report.Revenue.toFixed(2)}</p>
                                <p><strong>Sales:</strong> {report.Sales}</p>
                                <p><strong>Price:</strong> ${report.Price.toFixed(2)}</p>
                                <p><strong>Report No:</strong> {report.Report_no}</p>
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}

                    {!loading && !error && reports.length === 0 && <p>No reports found.</p>}

                    {/* Seller Home Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold mb-6">Seller Home</h1>
                        {loading && <p className="text-gray-600">Loading Products...</p>}
                        {error && <p className="text-red-500">Error: {error.message}</p>}
                        {messagee && <p className="text-green-500">{messagee}</p>}
                    </div>

                    {/* Filter Section */}
                    <div className="mb-8 bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Filter Sales Reports</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="productFilter" className="block font-medium mb-1">
                            Product:
                            </label>
                            <input
                            type="text"
                            id="productFilter"
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            placeholder="Enter product name"
                            className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block font-medium mb-1">
                            Start Date:
                            </label>
                            <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block font-medium mb-1">
                            End Date:
                            </label>
                            <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="month" className="block font-medium mb-1">
                            Month:
                            </label>
                            <input
                            type="month"
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            />
                        </div>
                        </div>

                        <button
                        onClick={handleFilterFetchSalesReports}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                        Apply Filters
                        </button>
                    </div>

                    {/* Sales Reports Table */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Sales Reports - Products</h2>
                        <button
                        onClick={handleFetchSalesReports}
                        className="mb-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                        >
                        Fetch All Sales Reports
                        </button>

                        {salesReports.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse bg-white shadow-md rounded-md">
                            <thead>
                                <tr className="bg-gray-100">
                                <th className="border p-3 text-left">Product</th>
                                <th className="border p-3 text-left">Revenue</th>
                                <th className="border p-3 text-left">Sales</th>
                                <th className="border p-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesReports.map((report) => (
                                <tr key={report.Report_no} className="hover:bg-gray-50">
                                    <td className="border p-3">{report.Product}</td>
                                    <td className="border p-3">${report.Revenue.toFixed(2)}</td>
                                    <td className="border p-3">{report.Sales}</td>
                                    <td className="border p-3">{new Date(report.createdAt).toLocaleDateString()}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        ) : (
                        <p className="text-gray-600">No sales reports available.</p>
                        )}
                    </div>
                    </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Product Name</th>
                                <th className="py-2 px-4 border-b">Picture</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Seller Name</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Archived</th>
                                <th className="py-2 px-4 border-b">Saled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id.$oid}>
                                    <td className="py-2 px-4 border-b">{product.Product_Name}</td>
                                    <td className="py-2 px-4 border-b">
                                        <img src={product.Picture} alt={product.Product_Name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td className="py-2 px-4 border-b">{product.Price}</td>
                                    <td className="py-2 px-4 border-b">{product.Quantity}</td>
                                    <td className="py-2 px-4 border-b">{product.Seller_Name}</td>
                                    <td className="py-2 px-4 border-b">{product.Description}</td>
                                    <td className="py-2 px-4 border-b">{product.Archived ? 'Yes' : 'No'}</td>
                                    <td className="py-2 px-4 border-b">{product.Saled}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            
            <Footer />
        </div>
    );
};

export default SellerHome;
