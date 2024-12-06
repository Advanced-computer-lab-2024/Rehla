import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { viewMyWishlist } from '../services/api'; // Import the API call for fetching wishlist products

const Header = () => (
    <div className="NavBar">
    <img src={logo} alt="Logo" />
    <nav className="main-nav">
        <ul className="nav-links">
            <Link to="/TouristHome">Home</Link>
            <Link to="/MyEvents">Events/Places</Link>
        </ul>
    </nav>

    <nav className="signing">
        <Link to="/TouristHome/TouristProfile">My Profile</Link>
    </nav>
</div>
);

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

const Wishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            const mail = localStorage.getItem('email'); // Retrieve email from local storage
            if (!mail) {
                setError('No email found in local storage.');
                setLoading(false);
                return;
            }

            try {
                const data = await viewMyWishlist(mail); // Fetch the wishlist products using the user's email
                setWishlistProducts(data);
            } catch (error) {
                setError('Failed to load wishlist products');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, []); // Empty dependency array means this runs once when the component mounts

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    if (wishlistProducts.length === 0) {
        return <div className="text-center py-10">Your wishlist is empty.</div>;
    }

    return (
        <div>
        <div className="container mx-auto px-4 py-10">
            <Header/>

            </div>
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-8">Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistProducts.map(product => (
                    <div key={product._id} className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-medium">{product.Productname}</h3>
                        <img 
                            src={product.Picture} 
                            alt={product.Productname} 
                            className="w-full h-48 object-cover rounded-lg mt-4"
                        />
                        <p className="mt-2 text-lg font-semibold">{product.Price} {product.Currency}</p>
                        <p className="text-gray-600 mt-2">{product.Description}</p>
                    </div>
                ))}
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default Wishlist;