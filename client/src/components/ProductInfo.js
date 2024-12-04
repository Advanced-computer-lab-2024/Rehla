import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const ProductInfo = () => {
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">No product details</h1>
      </div>

      {/* Footer */}
      <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
        <div className="w-full mx-auto md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img src={logo} className="w-12" alt="Flowbite Logo" />
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
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default ProductInfo;
