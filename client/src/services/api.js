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
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error 3:', error);
            throw error;
        }

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

export const checkoutOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/checkout-order`, orderData);
        return response.data; // Return the response from the backend
    } catch (error) {
        console.error('Error during order checkout:', error);

        // Check for specific error messages from the backend
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message); // Return the backend error message
        } else {
            throw new Error('Failed to checkout order. Please try again later.');
        }
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
      const response = await axios.post(`${API_URL}/signIn`, { Email: email, Password: password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Return 403 status if terms are not accepted
        return { status: 403, message: "You must accept the terms before signing in." };
      } else {
        throw error;
      }
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
    try {
        const response = await axios.post(`${API_URL}/getTourGuideProfile`, data); // Ensure correct API method
        return response.data; // Return the tour Guide profile data
      } catch (error) {
        console.error('Error in getTourGuideProfile API:', error);
        throw error;
      }
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

export const getAdvertiserProfile = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/readAdvertisers`, data);
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


  export const updateItinerary = async (itineraryData) => {
    try {
        // Log the itinerary data being sent
        console.log('Updating itinerary with data:', itineraryData);

        // Send a PUT request to the API for updating the itinerary
        const response = await axios.put(`${API_URL}/updateItinerary`, itineraryData);
        
        // Return the updated itinerary data from the server
        return response.data;
    } catch (error) {
        // Enhanced error logging
        if (error.response) {
            console.error('Error updating itinerary:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Error updating itinerary:', error.message);
            throw error.response ? error.response.data : { message: 'Network error' }; // Handle error
        }
    }
};



export const deleteItinerary = async (itineraryName) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteItinerary`, { data: { Itinerary_Name: itineraryName } });
        return response.data; // Return the success message from the server
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        throw error.response ? error.response.data : { message: 'Network error' }; // Handle error
    }
};

export const createMuseum = async (museumData) => {
    return await axios.post(`${API_URL}/creatingMuseum`, museumData);
};

export const readMuseum = async (museumName) => {
    return await axios.post(`${API_URL}/readMuseum`, { name: museumName });
};

export const createHistoricalPlace = async (placeData) => {
    return await axios.post(`${API_URL}/createHistoricalPlace`, placeData);
};

export const readHistoricalPlace = async (placeName) => {
    return await axios.post(`${API_URL}/readHistoricalPlace`, { name: placeName });
};

export const updateMuseum = async (museumData) => {
    return await axios.put(`${API_URL}/updateMuseum`, museumData);
};

export const updateHistoricalPlace = async (placeData) => {
    return await axios.put(`${API_URL}/updateHistoricalPlace`, placeData);
};

export const deleteMuseum = async (museumName) => {
    return await axios.delete(`${API_URL}/deleteMuseum`, { data: { Name: museumName } });
};

export const deleteHistoricalPlace = async (placeName) => {
    return await axios.delete(`${API_URL}/deleteHistoricalPlace`, { data: { Name: placeName } });
};

export const getAllCreatedByEmail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getAllCreatedByEmail/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching created items:", error);
        throw error;
    }
};

export const createActivityByAdvertiser = async (activityData) => {
    try {
        const response = await axios.post(`${API_URL}/createActivityByAdvert`, activityData);
        return response.data; // Return response data for further processing
    } catch (error) {
        console.error('API call failed:', error); // Log the error
        throw error; // Rethrow the error for further handling
    }
};

export const readActivity = async (name) => {
    try {
        // Make a GET request to the API with the activity name
        const response = await axios.get(`${API_URL}/readActivity/${name}`);
        return response.data; // { message: ..., data: activityDetails }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error retrieving activity');
    }
};

export const deleteActivityByAdvertiser = async (Name) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteActivityByAdvert`, { data: { Name: Name } });
        return response.data; // Return the success message from the server
    } catch (error) {
        console.error('Error deleting activity:', error);
        throw error.response ? error.response.data : { message: 'Network error' }; // Handle error
    }
};

export const updateActivityByAdvertiser = async (activityData) => {
    try {
        // Log the itinerary data being sent
        console.log('Updating activity with data:', activityData);

        // Send a PUT request to the API for updating the activity
        const response = await axios.put(`${API_URL}/updateActivity`, activityData);
        
        // Return the updated activity data from the server
        return response.data;
    } catch (error) {
        // Enhanced error logging
        if (error.response) {
            console.error('Error updating activity:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Error updating activity:', error.message);
            throw error.response ? error.response.data : { message: 'Network error' }; // Handle error
        }
    }
};
export const commentOnItinerary = async (touristEmail, itineraryName, comment) => {
    try {
        const response = await axios.post(`${API_URL}/commentOnItinerary`, {
            Tourist_Email: touristEmail,
            Itinerary_Name: itineraryName,
            Comment: comment,
        });
        return response.data; // Return the updated itinerary with the comment
    } catch (error) {
        console.error('Error commenting on itinerary:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

// Function to rate an itinerary
export const rateItinerary = async (touristEmail, itineraryName, rating) => {
    try {
        const response = await axios.post(`${API_URL}/rateItinerary`, {
            Tourist_Email: touristEmail,
            Itinerary_Name: itineraryName,
            Rating: rating
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error rating itinerary:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const rateActivity = async (touristEmail, activityName, rating) => {
    try {
        const response = await axios.post(`${API_URL}/rateActivity`, {
            Tourist_Email: touristEmail,
            Activity_Name: activityName,
            Rating: rating
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error rating activity:', error.response ? error.response.data : error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const commentOnEvent = async (touristEmail, activityName, Comment) => {
    try {
        const response = await axios.post(`${API_URL}/commentOnEvent`, {
            Tourist_Email: touristEmail,
            Activity_Name: activityName,
            Comment
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error commenting on event:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const rateTourGuide = async (touristEmail, tourGuideEmail, rating) => {
    try {
        const response = await axios.post(`${API_URL}/rateTourGuide`, {
            Tourist_Email: touristEmail,
            TourGuide_Email: tourGuideEmail,
            Rating: rating
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error rating tour guide:', error.response ? error.response.data : error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const commentTourGuide = async (touristEmail, tourGuideEmail, comment) => {
    try {
        const response = await axios.post(`${API_URL}/commentTourGuide`, {
            Tourist_Email: touristEmail,
            TourGuide_Email: tourGuideEmail,
            Comment: comment
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error commenting on tour guide:', error.response ? error.response.data : error);
        throw error; // Rethrow the error for handling in the calling component
    }
};


// Function to get attended itineraries by tourist email
export const getAttendedItineraries = async (touristEmail) => {
    try {
        const response = await axios.post(`${API_URL}/getAttendedItineraries`, { Tourist_Email: touristEmail });
        return response.data;
    } catch (error) {
        console.error('Error fetching attended itineraries:', error);
        throw error;
    }
};

// Function to get attended activities by tourist email
export const getAttendedActivities = async (touristEmail) => {
    try {
        const response = await axios.post(`${API_URL}/getAttendedActivities`, { Tourist_Email: touristEmail });
        return response.data;
    } catch (error) {
        console.error('Error fetching attended activities:', error);
        throw error;
    }
};

export const getPurchasedProducts = async (touristEmail) => {
    try {
        const response = await axios.get(`${API_URL}/getPurchasedProducts`, {
            params: { Tourist_Email: touristEmail } // Send email as a query parameter
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching purchased products:', error);
        throw error;
    }
};

// export const viewAllComplaints = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/viewComplaints`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching complaints:", error.response || error);
//         throw error.response?.data || 'Error fetching complaints';
//     }
// };
// Function to fetch all complaints
export const viewAllComplaints = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewComplaints`);
        return response.data; // Returns an array of complaints
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw error; // Rethrow to handle it in the component
    }
};

// Function to process a complaint by email
export const processComplaintByEmail = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/processComplaint/${email}`); // Adjust the route if necessary
        return response.data; // Returns the processed complaint
    } catch (error) {
        console.error('Error processing complaint:', error);
        throw error; // Rethrow to handle it in the component
    }
};

// Function to view a specific complaint by Tourist_Email
export const viewComplaintByEmail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/viewComplaint/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching complaint by email:', error);
        throw error;
    }
};
// Function to reply to a complaint by email
export const replyToComplaint = async (email, reply) => {
    try {
        const response = await axios.put(`${API_URL}/replyComplaint/${email}`, { reply });
        return response.data; // Returns the updated complaint with the reply
    } catch (error) {
        console.error('Error replying to complaint:', error);
        throw error; // Rethrow to handle it in the component
    }
};

// Archive or Unarchive Product
export const toggleProductArchiveStatus = async (productName) => {
    try {
        const response = await axios.put(`${API_URL}/ArchiveProduct/${productName}`);
        return response.data;
    } catch (error) {
        console.error('Failed to toggle product archive status:', error.message);
        throw error;
    }
};

// Function to view all complaints sorted by date
export const viewAllComplaintsSortedByDate = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewAllComplaintsSortedByDate`);
        return response.data; // Returns the sorted complaints from the server
    } catch (error) {
        console.error('Error fetching sorted complaints by date:', error);
        throw error; // Rethrow to handle it in the component
    }
};

// Function to filter complaints by status
export const filterComplaintsByStatus = async (status) => {
    try {
        const response = await axios.get(`${API_URL}/filterComplaintsByStatus/${status}`);
        return response.data; // Returns the list of complaints with the specified status
    } catch (error) {
        console.error('Error filtering complaints by status:', error);
        throw error; // Rethrow to handle it in the component
    }
};
     


export const updateComplaintStatus = async (email,title) => {
    try {
        const response = await axios.put(`${API_URL}/ComplaintStatus/${email}/${title}`);
        return response.data; // Returns the updated complaint with the resolved status
    } catch (error) {
        console.error('Error updating complaint status:', error);
        throw error; // Rethrow to handle it in the component
    }
};

export const flagActivity = async (name) => {
    try {
        const response = await axios.put(`${API_URL}/flagActivity/${name}`);
        return response.data; // Returns the flagged activity details
    } catch (error) {
        console.error('Error flagging activity:', error);
        throw error; // Rethrow to handle it in the component
    }
};


export const flagItinerary = async (name) => {
    try {
        const response = await axios.put(`${API_URL}/flagItinerary/${name}`);
        return response.data; // Returns the flagged itinerary data
    } catch (error) {
        console.error('Error flagging itinerary:', error);
        throw error; // Rethrow to handle it in the component
    }
};

export const createTouristItinerary = async (touristEmail, itineraryName) => {
    try {
        const response = await axios.post(`${API_URL}/creatTouristItenrary`, {
            Tourist_Email: touristEmail,
            Itinerary_Name: itineraryName
        });
        return response.data; // Return the response from the API
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error creating tourist itinerary:', error);
            throw error;
        }
    }
};


export const deleteTouristItenrary = async (touristEmail, itineraryName) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteTouristItenrary`, {
            data: {
                Tourist_Email: touristEmail,
                Itinerary_Name: itineraryName,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error creating tourist itinerary:', error);
            throw error;
        }
    }
};


export const deleteTouristActivity = async (touristEmail, activityName) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteTouristActivity`, {
            data: {
                Tourist_Email: touristEmail,
                Activity_Name: activityName
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error creating tourist itinerary:', error);
            throw error;
        }
    }
};

export const uploadProfilePicture = async (email, file) => {
    const formData = new FormData();
    formData.append('document', file); // Append the file to the form data
    formData.append('email', email); // Append the email to the form data

    try {
        const response = await axios.post(`${API_URL}/gettouristprofilepic`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error  :', error);
            throw error;
        }
    }
};
export const uploadTourguidePicture = async (email, file) => {
    const formData = new FormData();
    formData.append('document', file); // Append the file to the form data
    formData.append('email', email); // Append the email to the form data

    try {
        const response = await axios.post(`${API_URL}/gettourguideprofilepic`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error 2:', error);
            throw error;
        }
    }
};
export const uploadsellerLogo= async (email, file) => {
    const formData = new FormData();
    formData.append('document', file); // Append the file to the form data
    formData.append('email', email); // Append the email to the form data

    try {
        const response = await axios.post(`${API_URL}/getsellerLogo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error 3:', error);
            throw error;
        }
    }
};

export const uploadadvertiserLogo= async (email, file) => {
    const formData = new FormData();
    formData.append('document', file); // Append the file to the form data
    formData.append('email', email); // Append the email to the form data

    try {
        const response = await axios.post(`${API_URL}/getadvertiserLogo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error 4:', error);
            throw error;
        }
    }
};


export const uploadProductPicture = async (product, file) => {
    const formData = new FormData();
    formData.append('document', file); // Append the file to the form data
    formData.append('productname', product); // Append the email to the form data

    try {
        const response = await axios.post(`${API_URL}/getproductpic`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error uploading picture :', error);
            throw error;
        }
    }
};

export const createTouristActivity = async (touristEmail, activityName) => {
    try {
        const response = await axios.post(`${API_URL}/createTouristActivity`, {
            Tourist_Email: touristEmail,
            Activity_Name: activityName
        });
        return response.data; // Return the response from the API
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error creating tourist itinerary:', error);
            throw error;
        }
    }
};

export const createComplaint = async (email, complaintTitle, complaintBody) => {
    try {
        const response = await axios.post(`${API_URL}/createComplaint`,{
            Tourist_Email : email, 
            Title : complaintTitle, 
            Body : complaintBody});
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error creating complaint:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const redeemPoints = async (email, pointsToRedeem) => {
    try {
        const response = await axios.put(`${API_URL}/redeemPoints`, {
            Email: email,          // Match backend capitalization
            pointsToRedeem: pointsToRedeem,  // Send the points to redeem
        });
        return response.data;
    } catch (error) {
        console.error("Error redeeming points:", error);
        const errorMessage = error.response ? error.response.data : { message: "Network error" };
        throw errorMessage;
    }
};

export const createPreference = async (email, historicAreas, beaches, familyFriendly, shopping, budgetFriendly) => {
    try {
        const response = await axios.post(`${API_URL}/createPreference`, {
            email,
            historicAreas,
            beaches,
            familyFriendly,
            shopping,
            budgetFriendly
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error creating preference:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};


// Function to activate or update the itinerary accessibility
export const Itineraryactivation = async (Itinerary_Name, Accessibility) => {
    try {
        const response = await axios.put(`${API_URL}/Itineraryactivation`, {
            Itinerary_Name: Itinerary_Name,
            Accessibility: Accessibility
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error activating itinerary:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const acceptTerms = async (email) => {
    try {
        const response = await axios.put(`${API_URL}/acceptTerms`, {
            Email: email, // Send the email of the user
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error accepting terms:', error);
        const errorMessage = error.response ? error.response.data : { message: "Network error" };
        throw errorMessage; // Rethrow the error for handling in the calling component
    }
};

export const requestDeleteProfile = async (username, email, password, type) => {
    try {
        const requestData = { Username: username, Email: email, Password: password, Type: type };
        const response = await axios.post(`${API_URL}/requestDeleteProfile`, requestData);
        return response.data;  // Return the response data (e.g., success message or request details)
    } catch (error) {
        console.error("Error requesting profile deletion:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};





export const getDeleteRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewDeleteRequests`); // Ensure this matches your backend route
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error fetching delete requests');
    }
};

// Function to update or add a review and rating for a product
export const productRateReview = async (reviewData) => {
    if (!reviewData.Tourist_Email || !reviewData.Product_Name || reviewData.Review === undefined || reviewData.Rating === undefined) {
        throw new Error("Missing required fields: Tourist_Email, Product_Name, Review, and Rating must be provided.");
    }

    try {
        const response = await axios.put(`${API_URL}/productRateReview`, reviewData);
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error updating product review:', error.response?.data || error.message);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const getAllTransportation = async () => {
    try {
        // Make a GET request to the backend route for transportation data
        const response = await axios.get(`${API_URL}/viewAllTransportation`); // Ensure this route matches your backend
        return response.data; // Return the response data from the server
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error fetching transportation');
    }
};

// Function to delete a request based on email
export const deleteRequest = async (email) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteRequest`, { data: { Email: email } });
        return response.data;
    } catch (error) {
        console.error('Failed to delete request:', error);
        throw error;
    }
};

export const bookTransportation = async (touristEmail, routeNumber) => {
    try {
        const response = await axios.post(`${API_URL}/bookTransportation`, {
            Tourist_Email: touristEmail,
            Route_Number: routeNumber
        });
        return response.data; // Return the response from the API (success message, booking data, etc.)
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from the backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error booking transportation:', error);
            throw error;
        }
    }
};

export const uploadGuestDocuments = async (email, type, files) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('document', file); // Ensure the field name matches what the server expects
    });
    formData.append('email', email);
    formData.append('type', type);

    try {
        const response = await axios.post(`${API_URL}/uploadGuestDocuments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
        } else {
            console.error('Error uploading documents:', error);
            throw error;
        }
    }
};


export const getAllFiles = async () => {
    try {
        const response = await axios.get(`${API_URL}/getAllFiles`);  // Call the new endpoint
        return response.data;  // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error);  // If error data is available, throw it
        } else {
            console.error('Error retrieving files:', error);  // Log any error
            throw error;
        }
    }
};

export const fetchSalesReport = async (sellerName) => {
    try {
        const response = await axios.post(`${API_URL}/salesReport/${sellerName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sales report:', error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export const fetchAllSalesReportsSeller = async () => {
    try {
        const response = await axios.get(`${API_URL}/getAllSalesReportsseller`);
        console.log('Sales reports:', response.data); // Debugging line to view the fetched data
        return response.data;  // Return the fetched sales reports
    } catch (error) {
        console.error('Error fetching sales reports:', error); // Error handling
        throw error;  // Re-throw the error to be handled by the calling function
    }
};

export const calculateActivityRevenue = async (email) => {
    try {
        // Send a POST request with the email
        const response = await axios.post(`${API_URL}/calculateActivityRevenue`, { email });
        console.log('Revenue response:', response.data); // Log the response for debugging
        
        // Return the list of reports generated
        return response.data.reports;
    } catch (error) {
        console.error('Error calculating activity revenue:', error.message);
        throw new Error('Failed to calculate activity revenue');
    }
};

export const fetchAllSalesReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/advertiser_salesreport`);
        console.log('Sales reports:', response.data); // Debugging line to view the fetched data
        return response.data;  // Return the fetched sales reports
    } catch (error) {
        console.error('Error fetching sales reports:', error); // Error handling
        throw error;  // Re-throw the error to be handled by the calling function
    }
};




export const calculateItineraryRevenue = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/calculateItineraryRevenue`, { email });
        return response.data; // Return the detailed revenue data
    } catch (error) {
        console.error('Error calculating itinerary revenue:', error);
        const errorMessage = error.response
            ? error.response.data
            : { message: 'Network error' };
        throw errorMessage; // Throw for front-end handling
    }
};
export const fetchAllSalesReportsitin = async () => {
    try {
        const response = await axios.get(`${API_URL}/getAllSalesReportsitin`);
        console.log('Sales reports:', response.data); // Debugging line to view the fetched data
        return response.data;  // Return the fetched sales reports
    } catch (error) {
        console.error('Error fetching sales reports:', error); // Error handling
        throw error;  // Re-throw the error to be handled by the calling function
    }
};


export const fetchAllSalesReportsemail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/advertiser_salesreport`, {
            params: { email },
        });
        console.log('Sales reports (Advertiser):', response.data); // Debugging line to view the fetched data
        return response.data;  // Return the fetched sales reports
    } catch (error) {
        console.error('Error fetching sales reports (Advertiser):', error); // Error handling
        throw error;  // Re-throw the error to be handled by the calling function
    }
};

export const fetchAllSalesReportsitinemail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getAllSalesReportsitin`, {
            params: { email },
        });
        console.log('Sales reports (Itinerary):', response.data); // Debugging line to view the fetched data
        return response.data;  // Return the fetched sales reports
    } catch (error) {
        console.error('Error fetching sales reports (Itinerary):', error); // Error handling
        throw error;  // Re-throw the error to be handled by the calling function
    }
};

export const fetchAllSalesReportsSelleremail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getAllSalesReportsseller`, {
            params: { email },
        });
        console.log('Sales reports (Seller):', response.data); // Debugging line to view the fetched data
        return response.data;  // Return the fetched sales reports
    } catch (error) {
        console.error('Error fetching sales reports (Seller):', error); // Error handling
        throw error;  // Re-throw the error to be handled by the calling function
    }
};


export const fetchFilteredTourGuideSalesReport = async (email, itinerary, startDate, endDate, month) => {
    try {
        let url = `${API_URL}/filterTourGuideSalesReport?email=${email}`;

        if (itinerary) url += `&itinerary=${itinerary}`;
        if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
        if (month) url += `&month=${month}`;

        const response = await axios.get(url);
        console.log('Filtered Tour Guide sales reports:', response.data);
        return response.data;  // Return the filtered sales reports
    } catch (error) {
        console.error('Error fetching filtered Tour Guide sales reports:', error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
};
export const fetchFilteredAdvertiserSalesReport = async (email, activity, startDate, endDate, month) => {
    try {
        let url = `${API_URL}/filterAdvertiserSalesReport?email=${email}`;

        if (activity) url += `&activity=${activity}`;
        if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
        if (month) url += `&month=${month}`;

        const response = await axios.get(url);
        console.log('Filtered Advertiser sales reports:', response.data);
        return response.data;  // Return the filtered sales reports
    } catch (error) {
        console.error('Error fetching filtered Advertiser sales reports:', error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
};
export const fetchFilteredSellerSalesReport = async (email, product, startDate, endDate, month) => {
    try {
        let url = `${API_URL}/filterSellerSalesReport?email=${email}`;

        if (product) url += `&product=${product}`;
        if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
        if (month) url += `&month=${month}`;

        const response = await axios.get(url);
        console.log('Filtered Seller sales reports:', response.data);
        return response.data;  // Return the filtered sales reports
    } catch (error) {
        console.error('Error fetching filtered Seller sales reports:', error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
};

export const fetchFilteredSellerSalesReportad = async (product, startDate, endDate, month) => {
    try {
        let url = `${API_URL}/filterSellerSalesReportad`;

        const params = [];
        if (product) params.push(`product=${product}`);
        if (startDate && endDate) params.push(`startDate=${startDate}&endDate=${endDate}`);
        if (month) params.push(`month=${month}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        const response = await axios.get(url);
        console.log('Filtered Seller sales reports:', response.data);
        return response.data;  // Return the filtered sales reports
    } catch (error) {
        console.error('Error fetching filtered Seller sales reports:', error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
};



// function to create new promo code
export const createPromoCode = async (Code, Discount, Expiry,CreatedBy ,type) => {
    try {
        const response = await axios.post(`${API_URL}/createPromoCode`, {Code, Discount, Expiry,CreatedBy ,type});
        return response.data;
    } catch (error) {
        console.error('Error creating promo code:', error);
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

export const addDeliveryAddress = async (addressData) => {
    try {
      const response = await axios.post(`${API_URL}/addTouristAddress`, addressData);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      
      // Provide more detailed error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        throw new Error(error.response.data.message || 'Failed to add address. Please try again.');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        // Something else happened during request setup
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };
  
export const saveEvent = async (eventData) => {
    try {
        const response = await axios.post(`${API_URL}/saveEvent`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error saving event:', error);
        throw error;
    }
};

// export const viewSavedEvents = async (email) => {
//     try {
//         const response = await axios.post(`${API_URL}/viewSavedEvents`, { email });
//         return response.data; // Return the data from the server
//     } catch (error) {
//         console.error('Error retrieving saved events:', error);
//         throw error; // Throw the error to let the caller handle it
//     }
// };

export const viewUserStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/viewUserStats`);
        return response.data; // Return the response data containing stats
    } catch (error) {
        console.error('Error retrieving user statistics:', error);
        throw error; // Propagate the error for handling in the calling component
    }
};

export const getWishlistProducts = async () => {
    const response = await fetch('/api/wishlist'); // Adjust the endpoint as needed
    if (!response.ok) {
        throw new Error('Failed to fetch wishlist products');
    }
    return await response.json();
};
export const getPaidActivities = async (email) => {
    try {
        if (!email) {
            throw new Error('Email is required to fetch paid activities.');
        }

        const response = await axios.get(`${API_URL}/getPaidActivities/${email}`);
        return response.data; // Return the activities from the server response
    } catch (error) {
        console.error('Error fetching paid activities:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred while fetching paid activities.' };
    }
};
export const getPastPaidActivities = async (email) => {
    try {
        if (!email) {
            throw new Error('Email is required to fetch past paid activities.');
        }

        const response = await axios.get(`${API_URL}/getPastPaidActivities/${email}`);
        return response.data; // Return the activities from the server response
    } catch (error) {
        console.error('Error fetching past paid activities:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred while fetching past paid activities.' };
    }
};
export const getPaidItineraries = async (email) => {
    try {
        if (!email) {
            throw new Error('Email is required to fetch paid itineraries.');
        }

        const response = await axios.get(`${API_URL}/getPaidItineraries/${email}`);
        return response.data; // Return the itineraries from the server response
    } catch (error) {
        console.error('Error fetching paid itineraries:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred while fetching paid itineraries.' };
    }
};
export const getPastPaidItineraries = async (email) => {
    try {
        if (!email) {
            throw new Error('Email is required to fetch past paid itineraries.');
        }

        const response = await axios.get(`${API_URL}/getPastPaidItineraries/${email}`);
        return response.data; // Return the itineraries from the server response
    } catch (error) {
        console.error('Error fetching past paid itineraries:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred while fetching past paid itineraries.' };
    }
};
export const cancelOrder = async (cancelData) => {
    try {
        // Sending the cancel data (email and cart number) via DELETE request
        const response = await axios.delete(`${API_URL}/cancelOrder`, { data: cancelData });
        return response.data;  // Return the server's response
    } catch (error) {
        console.error('Error canceling order:', error);  // Log the error if it occurs
        throw error;  // Propagate the error so that it can be handled in the calling code
    }
};
export const cancelSavedEvent = async (eventData) => {
    try {
        const response = await axios.delete(`${API_URL}/cancelSavedEvent`, {
            data: eventData // Pass data in the request body
        });
        return response.data;
    } catch (error) {
        console.error('Error canceling saved event:', error);
        throw error;
    }
};

export const viewSavedActivities = async (touristEmail) => {
    try {
        // Make the POST request with touristEmail in the body
        const response = await axios.post(`${API_URL}/viewSavedActivities`, { touristEmail });
        return response.data; // Return the response data containing activities
    } catch (error) {
        console.error('Error retrieving saved activities:', error);
        throw error; // Propagate the error for handling in the calling component
    }
};

export const viewSavedItineraries = async (touristEmail) => {
    try {
        // Make the POST request with touristEmail in the body
        const response = await axios.post(`${API_URL}/viewSavedItineraries`, { touristEmail });
        return response.data; // Return the response data containing itineraries
    } catch (error) {
        console.error('Error retrieving saved itineraries:', error);
        throw error; // Propagate the error for handling in the calling component
    }
};

export const viewMyProducts = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/viewmyproducts`, { email });
        return response.data; // Return the response data containing products
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Propagate the error for handling in the calling component
    }
};

// Get all unseen notifications for a specific user
export const getNotifications = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/getNotifications`, { user });
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Mark a notification as seen
export const markAsSeen = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/markAsSeen`, { id });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as seen:", error);
        throw error;
    }
};

// Create a new notification
export const createNotification = async (message, user, title) => {
    try {
        const response = await axios.post(`${API_URL}/createNotification`, {
            message,
            user,
            title,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Get all notifications for a specific user by email
export const getAllNotifications = async (email) => {
    try {
        if (!email) {
            throw new Error("Email is required to fetch notifications.");
        }

        // Make an API call with the email as a query parameter
        const response = await axios.get(`${API_URL}/getAllNotifications`, {
            params: { email }, // Pass email as query parameter
        });

        return response.data; // Return the fetched notifications
    } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};


// Function to request a notification for an event
export const requestNotificationForEvent = async (user, eventId) => {
    try {
        const response = await axios.post(`${API_URL}/requestNotificationForEvent`, {
            user,
            eventId,
        });

        console.log('Notification request submitted successfully:', response.data);
        return response.data; // Return the server response
    } catch (error) {
        console.error('Error requesting notification for event:', error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

// Function to notify users for available bookings based on their email
export const notifyForAvailableBookings = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/notifyForAvailableBookings`, { email });
        console.log('Notifications processed successfully:', response.data);
        return response.data; // Return the server response
    } catch (error) {
        console.error("Error processing notifications:", error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

// Function to notify for flagged activities
export const notifyForFlaggedActivities = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/notifyForFlaggedActivities`, { email });
        return response.data; // Return success message or response data
    } catch (error) {
        console.error('Error notifying for flagged activities:', error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};
export const getNotificationsForTourGuide = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getNotificationsForTourGuide/${email}`);
        return response.data.notifications; // Handle the notifications as needed
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Mark a notification as seen
export const markAsSeenn = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/markAsSeenn`, { id });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as seen:", error);
        throw error;
    }
};

// Function to notify for flagged activities
export const notifyForFlaggedItins = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/notifyForFlaggedItins`, { email });
        return response.data; // Return success message or response data
    } catch (error) {
        console.error('Error notifying for flagged activities:', error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};
export const getNotificationsForTourGuidet = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getNotificationsForTourGuidet/${email}`);
        return response.data.notifications; // Handle the notifications as needed
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Mark a notification as seen
export const markAsSeennt = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/markAsSeennt`, { id });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as seen:", error);
        throw error;
    }
};

// Function to create a wishlist item
export const createwishlistItem = async (wishlistData) => {
    try {
        const response = await axios.post(`${API_URL}/createwishlistItem`, wishlistData);
        return response.data; // Return the response data received from the backend
   
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error 2:', error);
            throw error;
        }
    }};


// Function to remind the user of upcoming paid activities
export const remindUpcomingPaidActivities = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/remindUpcomingPaidActivities`, { email });
        return response.data;
    } catch (error) {
        console.error("Error reminding upcoming paid activities:", error);
        throw error;
    }
};

export const viewMyWishlist = async (mail) => {
    try {
        const response = await axios.post(`${API_URL}/viewMyWishlist`, {
            mail,  // Pass email in the request body
        });
        
        return response.data.wishlistProducts; // Return the response from the backend
    } catch (error) {
        console.error("Error fetching your wish list:", error);
        throw error.response ? error.response.data : { message: "Network error" }; // Proper error handling
    }
};

 export const checkIfEventSaved = async (email, name) => {
    try {
        const response = await axios.post(`${API_URL}/checkEventSaved`, { email, name });
        return response.data; // Contains isSaved and message
    } catch (error) {
        console.error("Error checking event saved status:", error);
        return { isSaved: false, message: "An error occurred." };
    }
};

// Function to book a hotel
export const bookHotel = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/bookhotel`, bookingData);
        return response.data;
    } catch (error) {
        console.error('Error booking hotel:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

// Function to book a flight
export const bookFlight = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/bookflight`, bookingData);
        return response.data;
    } catch (error) {
        console.error('Error booking flight:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export const shareactivtybyemail = async (to, link) => {
    try {
        const response = await axios.post(`${API_URL}/shareactivtybyemail`, { to, link });
        return response.data;
    }catch (error) {
        console.error('Error sharing activity:', error);
        throw error;
    }
};

// Function to view order details by email
export const viewOrderDetails = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/view-order-details`, { Email: email });
        return response.data; // Return the cart details from the server
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error; // Re-throw the error to handle it in the caller
    }
};

//function add Product From Wish List To Cart 
export const addProductFromWishListToCart = async (email, product) => {
    try {
        const response = await axios.post(`${API_URL}/addProductFromWishListToCart`, { email, product });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

// Function to fetch the activity report based on the email
export const fetchActivityReport = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/view-report`, { email });
        return response.data; // Return the report data
    } catch (error) {
        console.error("Error fetching activity report:", error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

// Function to fetch the itinerary report based on the email
export const fetchItineraryReport = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/viewTotalAttendeesForItineraries`, { email });
        return response.data; // Return the report data
    } catch (error) {
        console.error("Error fetching itinerary report:", error.response?.data || error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

<<<<<<< HEAD
export const addToCart = async (email, productName) => {
    try {
        const response = await axios.post(`${API_URL}/addToCart`, { email, productName });
        return response.data; // Return the response data from the server
    } catch (error) {
        if (error.response && error.response.data) {
            // Return the error message from backend if available
            throw new Error(error.response.data.error);
        } else {
            console.error('Error 2:', error);
            throw error;
        }
    }};


=======
// Function to create notifications for out-of-stock products
export const createOutOfStockNotifications = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/createOutOfStockNotifications`, { email });
        return response.data;
    } catch (error) {
        console.error("Error creating out-of-stock notifications:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// Mark a notification as seen
export const markAsSeenns = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/markAsSeenns`, { id });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as seen:", error);
        throw error;
    }
};
export const getNotificationsForseller = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getNotificationsForseller/${email}`);
        return response.data.notifications; // Handle the notifications as needed
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Function to create notifications for out-of-stock products
export const createOutOfStockNotificationsadmin = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/createOutOfStockNotificationsadmin`, { email });
        return response.data;
    } catch (error) {
        console.error("Error creating out-of-stock notifications:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// Mark a notification as seen
export const markAsSeenna = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/markAsSeenna`, { id });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as seen:", error);
        throw error;
    }
};
export const getNotificationsForadmin = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/getNotificationsForadmin/${email}`);
        return response.data.notifications; // Handle the notifications as needed
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};
>>>>>>> 719b68297ea8d38b4a19d0b656b6be9bef8dadd4
