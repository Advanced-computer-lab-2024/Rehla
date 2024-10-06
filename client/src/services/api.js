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
export const filterActivities = async (filters) => {
    try {
        // Construct query parameters from the filters object
        const queryParams = new URLSearchParams(filters).toString();

        // Make a GET request to the back-end endpoint with query parameters
        const response = await axios.get(`${API_URL}/filterActivities?${queryParams}`);
        
        // Return the response data
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered activities:', error);
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



// api.js
export const viewMyCreatedActivities = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/viewMyCreatedActivities`, {
            params: { Email: email },  // Pass email as a query parameter
        });
        return response.data; // Return the response from the backend
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error.response ? error.response.data : { message: "Network error" }; // Proper error handling
    }
};

export const createUserAdmin = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/addUser`, userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error.response || error);
        throw error.response?.data || 'Error creating user';
    }
};

// Create a new activity category
export const createActivityCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/addCategory`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating activity category:", error.response || error);
        throw error.response?.data || 'Error creating activity category';
    }
};

// Get all activity categories
export const readActivityCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/getCategory`);
        return response.data;
    } catch (error) {
        console.error("Error fetching activity categories:", error.response || error);
        throw error.response?.data || 'Error fetching activity categories';
    }
};

// Update an existing activity category by current name
export const updateActivityCategory = async (currentName, newName) => {
    try {
        const response = await axios.put(`${API_URL}/updateCategory/${currentName}`, newName);
        return response.data;
    } catch (error) {
        console.error("Error updating activity category:", error.response || error);
        throw error.response?.data || 'Error updating activity category';
    }
};

// Delete an activity category by name
export const deleteActivityCategory = async (categoryData) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteCategory`, { data: categoryData });
        return response.data;
    } catch (error) {
        console.error("Error deleting activity category:", error.response || error);
        throw error.response?.data || 'Error deleting activity category';
    }
};


// Create a new preference tag
export const createPreferenceTag = async (tagData) => {
    try {
        const response = await axios.post(`${API_URL}/addTag`, tagData);
        return response.data;
    } catch (error) {
        console.error("Error creating preference tag:", error.response || error);
        throw error.response?.data || 'Error creating preference tag';
    }
};

// Get all preference tags
export const readPreferenceTags = async () => {
    try {
        const response = await axios.get(`${API_URL}/getTag`);
        return response.data;
    } catch (error) {
        console.error("Error fetching preference tags:", error.response || error);
        throw error.response?.data || 'Error fetching preference tags';
    }
};

// Update an existing preference tag by current name
export const updatePreferenceTag = async (currentTagName, newTagName) => {
    try {
        const response = await axios.put(`${API_URL}/updateTag/${currentTagName}`, newTagName);
        return response.data;
    } catch (error) {
        console.error("Error updating preference tag:", error.response || error);
        throw error.response?.data || 'Error updating preference tag';
    }
};

// Delete a preference tag by name
export const deletePreferenceTag = async (tagData) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteTag`, { data: tagData });
        return response.data;
    } catch (error) {
        console.error("Error deleting preference tag:", error.response || error);
        throw error.response?.data || 'Error deleting preference tag';
    }
};
export const createHistoricalTag = async (tagData) => {
    try {
        const response = await axios.post(`${API_URL}/createHistoricalTag`, tagData);
        return response.data; // Return the response from the server
    } catch (error) {
        console.error('Error creating tag:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const viewMyCreatedItineraries = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/viewMyCreatedItenrary`, {
            params: { Email: email },  // Pass email as a query parameter
        });
        return response.data; // Return the response from the backend
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        throw error.response ? error.response.data : { message: "Network error" }; // Proper error handling
    }
};



export const createItinerary = async (itineraryData) => {
    try {
        const response = await axios.post(`${API_URL}/createItinerary`, itineraryData); // POST request for creating itinerary
        return response.data; // Return the data from the backend
    } catch (error) {
        console.error("Error creating itinerary:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};


export const getItineraryByName = async (itineraryName) => {
    try {
        // Make a GET request to the API with the itinerary name
        const response = await axios.get(`${API_URL}/getItineraryByName/${itineraryName}`);
        
        // Return the data from the response
        return response.data;
    } catch (error) {
        // Handle errors (you can customize this further as needed)
        throw error.response ? error.response.data : new Error('Error retrieving itinerary');
    }
};

export const getTouristProfile = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/getTouristProfile`, data); // Ensure correct API method
      return response.data; // Return the tourist profile data
    } catch (error) {
      console.error('Error in getTouristProfile API:', error);
      throw error;
    }
  };

  export const updateTouristProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/updateTouristProfile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  export const getSellerProfile = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/getSellerProfile`, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  };
  
  export const updateSellerProfile = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/updateSellerProfile`, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  };

export const createTourGuideProfile = async (data) => {
    const response = await axios.post(`${API_URL}/createTourGuideProfile`, data);
    return response.data; // Return the created profile data
};

export const getTourGuideProfile = async (data) => {
    const response = await axios.post(`${API_URL}/getTourGuideProfile`, data);
    return response.data; // Return the profile data
};

export const updateTourGuideProfile = async (data) => {
    const response = await axios.put(`${API_URL}/updateTourGuideProfile`, data);
    return response.data; // Return the updated profile data
};

export const createAdvertiserProfile = async (advertiserData) => {
    try {
        const response = await axios.post(`${API_URL}/addUserAdvertisers`, advertiserData);
        return response.data;
    } catch (error) {
        console.error("Error creating advertiser profile:", error);
        throw error;
    }
};

export const getAdvertiserProfile = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/readAdvertisers`, { email });
        return response.data;
    } catch (error) {
        console.error("Error fetching advertiser profile:", error);
        throw error;
    }
};

export const updateAdvertiserProfile = async (advertiserData) => {
    try {
        const response = await axios.put(`${API_URL}/updateUserAdvertisers`, advertiserData);
        return response.data;
    } catch (error) {
        console.error("Error updating advertiser profile:", error);
        throw error;
    }
};

// Function to get all requests
export const viewAllRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  };
  
  // Function to process a request by email
  export const processRequestByEmail = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/processRequest/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error processing request:', error);
      throw error;
    }
  };
