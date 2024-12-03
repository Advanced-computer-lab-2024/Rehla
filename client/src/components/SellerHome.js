import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { getProducts, getProductsSortedByRating, addProduct, updateProduct,toggleProductArchiveStatus,uploadProductPicture,fetchSalesReport,getSellerProfile,fetchAllSalesReportsSelleremail ,fetchFilteredSellerSalesReport } from '../services/api';
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
    <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
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
        const fetchProfile = async () => {
            const email = localStorage.getItem('email'); // Get email from local storage

            if (!email) {
                navigate('/login'); // Redirect to login if no email found
                return;
            }

            try {
                const response = await getSellerProfile({ Email: email });
                setSeller(response);
                //setFormData(response); // Set form data for editing
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
            <div className="container mx-auto px-4 py-10">
                <Header />
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
                                className="border border-gray-300 rounded-full px-6 py-3 w-full max-w-3xl"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                                            />
                                            {preview && (
                                            <img src={preview} alt="Preview"   className="mt-2 w-32 h-32 rounded-full object-cover"/>
                                            )}
                                        </div>
                                            <button
                                            type="button"
                                            onClick={handleUploadProductPicture}
                                            className="bg-brandBlue text-white px-6 py-2 rounded-lg"
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
                                            className="bg-brandBlue text-white px-6 py-2 rounded-lg"
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
                                    </div>
                                </div>
                       )}


                        <button 
                            onClick={() => setIsAdding(true)} 
                            className="bg-brandBlue text-white px-6 py-2 rounded-lg mb-4"
                                >
                            Add Product
                        </button>


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
                                className="bg-brandBlue text-white px-6 py-2 rounded-lg"
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

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
        <div
            key={product._id}
            className={`bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer ${product.Archived ? 'opacity-50' : 'opacity-100'}`}
        >
            {product.Picture && (
                <img
                    src={product.Picture}
                    alt={product.Product_Name}
                    className="w-full h-40 object-cover mb-4 rounded"
                />
            )}
            <h3 className="text-lg font-semibold">{product.Product_Name}</h3>
            <p>Price: ${product.Price}</p>
            <p>Rating: {product.Rating}</p>
            <p>Quantity: {product.Quantity}</p>
            <p>Sales: {product.Saled}</p>
            <p>{product.Description}</p>
            

            {/* Archive/Unarchive Button */}
            <button
                onClick={() => handleArchiveToggle(product.Product_Name)}
                className={`mt-4 px-4 py-2 rounded-full text-white ${product.Archived ? 'bg-red-500' : 'bg-green-500'}`}
            >
                {product.Archived ? 'Unarchive' : 'Archive'}
            </button>
        </div>
    ))}
</div>
<div>
            <h1>Advertiser Home</h1>
            <button onClick={handleFetchReport}>report</button>

            {loading && <p>Loading Product revenue...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && reports.length > 0 && (
                <div>
                    <h2>Product Revenue Reports</h2>
                    <ul>
                        {reports.map((report, index) => (
                            <li key={index}>
                                <strong>Product:</strong> {report.Product} <br />
                                <strong>Revenue:</strong> ${report.Revenue.toFixed(2)} <br />
                                <strong>Sales:</strong> {report.Sales} <br />
                                <strong>Price:</strong> ${report.Price.toFixed(2)} <br />
                                <strong>Report No:</strong> {report.Report_no}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!loading && !error && reports.length === 0 && <p>No reports found.</p>}
        </div>
        <div>
    <h1>Tour Guide Home</h1>
    {loading && <p>Loading Products...</p>}
    {error && <p>Error: {error.message}</p>}
    {messagee && <p>{messagee}</p>}

    {/* Filter Section */}
    <div>
        <h2>Filter Sales Reports</h2>
        <div>
            <label htmlFor="productFilter">Product:</label>
            <input
                type="text"
                id="productFilter"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                placeholder="Enter product name"
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="endDate">End Date:</label>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="month">Month:</label>
            <input
                type="month"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <button
            onClick={handleFilterFetchSalesReports}
            style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Apply Filters
        </button>
    </div>
            
        <h2>Sales Reports - Products</h2>
        <button
            onClick={handleFetchSalesReports}
            style={{
                marginBottom: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Fetch All Sales Reports
        </button>
        {salesReports.length > 0 ? (
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontSize: "1rem",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Product</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Revenue</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Sales</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {salesReports.map((report) => (
                        <tr
                            key={report.Report_no}
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: report.Report_no % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                        >
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Product}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>${report.Revenue}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Sales}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No sales reports available.</p>
        )}
    </div>
            </div>
            <Footer />
        </div>
    );
};

export default SellerHome;
