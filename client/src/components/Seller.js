 // src/components/Seller.js
import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom'; // Assuming you will navigate to a view page for products
import { addProduct, getProducts } from '../services/api'; // Import the addProduct and getProducts API functions

const Seller = () => {
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        Product_Name: '',
        Picture: '',
        Price: '',
        Quantity: '',
        Seller_Name: '',
        Description: '',
        Rating: '',
        Reviews: ''
    });
    const [message, setMessage] = useState('');

    // Fetch products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addProduct(formData);
            setMessage(response.message);
            setError('');
            // Optionally refetch products to see the new product in the list
            const data = await getProducts();
            setProducts(data);
            // Reset the form
            setFormData({
                Product_Name: '',
                Picture: '',
                Price: '',
                Quantity: '',
                Seller_Name: '',
                Description: '',
                Rating: '',
                Reviews: ''
            });
        } catch (error) {
            setError('Error adding product: ' + error.message);
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Seller Dashboard</h1>
            
            {/* Render buttons to show view products or add products */}
            {!showAddProductForm && (
                <div>
                    <button onClick={() => setShowAddProductForm(true)}>Add Product</button>
                </div>
            )}

            {/* Show add product form when Add Product button is clicked */}
            {showAddProductForm && (
                <div>
                    <h2>Add New Product</h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Product Name:</label>
                            <input
                                type="text"
                                name="Product_Name"
                                value={formData.Product_Name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Picture URL:</label>
                            <input
                                type="text"
                                name="Picture"
                                value={formData.Picture}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="Price"
                                value={formData.Price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="Quantity"
                                value={formData.Quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Seller Name:</label>
                            <input
                                type="text"
                                name="Seller_Name"
                                value={formData.Seller_Name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="Description"
                                value={formData.Description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label>Rating:</label>
                            <input
                                type="number"
                                name="Rating"
                                value={formData.Rating}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Reviews:</label>
                            <input
                                type="number"
                                name="Reviews"
                                value={formData.Reviews}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <button type="submit">Add Product</button>
                        <button type="button" onClick={() => setShowAddProductForm(false)} style={{ marginLeft: '10px' }}>Back to seller</button>
                    </form>

                    {/* Display success or error message */}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            )}

            {/* Render the product list when not showing the form */}
            {!showAddProductForm && !loading && !error && (
                <div>
                    <h2>Product List</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {products.map((product) => (
                            <div key={product._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '300px' }}>
                                <h3>{product.Product_Name}</h3>
                                <p>Price: ${product.Price.toFixed(2)}</p>
                                <p>{product.Description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading and error states */}
            {loading && <div>Loading products...</div>}
            {error && <div>{error}</div>}
        </div>
    );
};

export default Seller;