import React, { useEffect, useState } from 'react';
import { getWishlistProducts } from '../services/api'; // Import the API call for fetching wishlist products

const Wishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                const data = await getWishlistProducts(); // Fetch the wishlist products
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

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-8">Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistProducts.map(product => (
                    <div key={product._id} className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-medium">{product.Product_Name}</h3>
                        <img 
                            src={product.Picture} 
                            alt={product.Product_Name} 
                            className="w-full h-48 object-cover rounded-lg mt-4"
                        />
                        <p className="mt-2 text-lg font-semibold">{product.Price} {product.Currency}</p>
                        <p className="text-gray-600 mt-2">{product.Description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
