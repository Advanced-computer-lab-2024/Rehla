import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';

const ProductInfo = () => {
  const { state } = useLocation();
  const { product } = state || {};

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="NavBar">
        <img src={logo} alt="Logo" className="mx-auto my-4" />
        <nav className="main-nav text-center">
          <ul className="nav-links">
            <Link to="/">Home</Link>
          </ul>
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

      {/* Footer */}
      <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default ProductInfo;
