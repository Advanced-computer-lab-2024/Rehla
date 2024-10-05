// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Adjust the port if necessary

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/getProducts`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // Return the fetched products
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/addUser`, userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const deleteUser = async (email) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteUser/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const registerTourist = async(touristData) => {
    try {
        const response = await axios.post(`${API_URL}/registerTourist`, touristData);
        return response.data;
    } catch (error) {
        console.error('Error adding tourist:', error);
        throw error;
    }
};

export const registerRequest= async(requestData)=>{
    try{
        const response = await axios.post(`${API_URL}/registerRequest`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error sending request:', error);
        throw error;

    }
};

export const getAllUpcomingEventsAndPlaces = async () => {
    try {
        const response = await axios.get(`${API_URL}/getAllUpcomingEventsAndPlaces`);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming events and places:', error);
        throw error;  // Rethrow for error handling in the component
    }
};

export const updateProduct = async (productData) => {
    try {
        const response = await axios.put(`${API_URL}/updateProduct`, productData);
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error updating product:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const sortActivities = async (sortBy) => {
    try {
        const response = await axios.get(`${API_URL}/sortActivities`, {
            params: { sortBy },
        });
        return response.data;
    } catch (error) {
        console.error('Error sorting activities:', error);
        throw error;
    }
};

export const sortItineraries = async (sortBy) => {
    try {
        const response = await axios.get(`${API_URL}/sortItineraries`, {
            params: { sortBy },
        });
        return response.data;
    } catch (error) {
        console.error('Error sorting itineraries:', error);
        throw error;
    }
};

// Add a new filterActivities function
export const filterActivities = async (filterParams) => {
    try {
        const response = await axios.get(`${API_URL}/filterActivities`, filterParams);
        return response.data;
    } catch (error) {
        console.error('Error filtering activities:', error);
        throw error;
    }
};

export const filterItineraries = async (filterParams) => {
    try {
        const response = await axios.get(`${API_URL}/filterItineraries`, {
            params: filterParams
        });
        return response.data;
    } catch (error) {
        console.error('Error filtering itineraries:', error);
        throw error;
    }
};

export const filterPlacesAndMuseums = async (filterParams) => {
    const { category, value } = filterParams; // Destructure category and value from filterParams
    try {
        // Use category and value dynamically in the URL
        const response = await axios.get(`${API_URL}/filter/${category}/${value}`);
        return response.data;
    } catch (error) {
        console.error('Error filtering places and museums:', error);
        throw error;
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await axios.post(`${API_URL}/addProduct`, productData);
        return response.data; // Return the response data received from the backend
    } catch (error) {
        console.error('Error adding product:', error); // Log the error
        throw error; // Rethrow the error for handling in the calling component
    }
};


export const searchProductByName = async (productName) => {
    try {
        // Make sure the URL matches the route in your backend, including the correct route parameter
        const response = await axios.get(`${API_URL}/getProductByName/${productName}`);
        return response.data; // Return the found product data
    } catch (error) {
        console.error('Error searching for product:', error);
        throw error; // Throw the error to handle it in the calling component
    }
};


export const filterProductsByPrice = async (minPrice, maxPrice) => {
    try {
        const response = await axios.get(`${API_URL}/filterProductsByPrice/${minPrice}/${maxPrice}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by price:', error);
        // Optionally, you can throw the error to handle it in the calling function
        throw new Error('Failed to filter products by price. Please try again later.');
    }
};

export const getProductsSortedByRating = async () => {
    try {
        const response = await axios.get(`${API_URL}/getProductsSortedByRating`);
        return response.data; // Returns the sorted products from the response
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Error fetching products sorted by rating');
    }
};

export const signIn = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signIn`, {
            Email: email,
            Password: password
        });
        return response.data; // Returns response from backend
    } catch (error) {
        console.error("Error signing in:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export const searchEventsPlaces = async (searchTerm) => {
    try {
        const response = await fetch(`${API_URL}/searchByNameCategoryTag?searchTerm=${encodeURIComponent(searchTerm)}`); // Ensure it's correctly formed
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json(); // Return the response data
    } catch (error) {
        console.error("Error in searchEventsPlaces:", error);
        throw error; // Re-throw the error to be handled in the component
    }
};

// Function to delete a user by admin
export const deleteUserAdmin = async (email) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteUser/${email}`);
        return response.data; // Return the response data (e.g., success message)
    } catch (error) {
        throw error.response?.data?.error || 'Error deleting user'; // Throw error to be caught in the front-end
    }
};



