const Admin = require('../Models/Admin');
const Product = require('../Models/Product');
const activity = require('../Models/activities');
const itinerarym = require('../Models/itineraries') ;
const Tourist = require('../Models/tourists');
const sellerm = require('../Models/sellers');
const tour_guidem=require('../Models/tour_guides');
const AdvertisersModel = require('../Models/Advertisers.js');
const Request= require('../Models/Requests.js');
const tourism_governers = require('../Models/tourism_governers');
const activity_tagsm = require('../Models/activity_tags.js');
const activity_categoriesm = require('../Models/activity_categories.js');
const categoriesm = require('../Models/categories.js');
const historical_places_tagsm = require('../Models/historical_places_tags.js');
const historical_placesm = require('../Models/historical_places.js');
const itinerary_activitiesm = require('../Models/itenerary_activities') ;
const museumsm = require('../Models/museums') ;
const p_tagsm = require('../Models/p_tags') ;
const tourist_itinerariesm = require('../Models/tourist_iteneraries') ;
const advertiser_activitiesm = require('../Models/advertiser_activities');
const Seller = require("../Models/sellers.js");
const advertiser_activities = require('../Models/advertiser_activities');
const historical_places_tags = require('../Models/historical_places_tags.js');
const tour_guide_itinerariesm = require('../Models/tour_guide_itineraries.js');
const tourismgoverner_museumsandhistoricalplacesm = require('../Models/tourismgoverner_museumsandhistoricalplaces.js');


// Creating a new Admin user or Tourism Governor
const createUserAdmin = async (req, res) => {
    try {
        const { Username, Password, Email, Type } = req.body;

        // Check if all fields are provided
        if (!Username || !Password || !Email || !Type) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Ensure only "Admin" or "Tourism Governor" are allowed as Type
        if (Type !== 'Admin' && Type !== 'Tourism Governor') {
            return res.status(400).json({ error: 'Invalid type. Only "Admin" or "Tourism Governor" are allowed.' });
        }

        const existingGoverner = await tourism_governers.findOne({ Email });
        if (existingGoverner) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        const existingAdmin = await Admin.findOne({ Email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        let newUser;

        // If Type is Admin, save to Admin collection
        if (Type === 'Admin') {
            newUser = new Admin({
                Username,
                Email,
                Password,
                Type
            });
        } 
        // If Type is Tourism Governor, save to TourismGovernor collection
        else if (Type === 'Tourism Governor') {
            newUser = new tourism_governers({
                Username,
                Email,
                Password,
                Type
            });
        }

        // Save the user to the correct table based on Type
        await newUser.save();

        // Respond with the created user
        return res.status(201).json(newUser);

    } catch (error) {
        console.error('Error creating user:', error); // Log error details
        return res.status(500).json({ error: 'Error creating user', details: error.message });
    }
};

// Deleting an Admin user
const deleteUserAdmin = async (req, res) => {
    try {
        const { email } = req.params; // Get the email from URL parameters
  
        // Define all models where the user could exist
        const models = [Admin, tourism_governers, Tourist, tour_guidem, AdvertisersModel, Seller]; // Add all the models here
        
        // Initialize an empty variable to store the deleted user
        let deletedUser = null;
  
        // Use Promise.all to search all collections in parallel
        await Promise.all(models.map(async (Model) => {
            const user = await Model.findOneAndDelete({ Email: email });
            if (user) deletedUser = user;  // If a user is found, store the deleted user
        }));
  
        // If no user was found in any collection, return a 404 error
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found in any table.' });
        }
  
        // If a user was deleted, send success response
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user', details: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await Product.find(); 
  
      // Check if there are any products
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found." });
      }
  
      // Send the list of products as a response
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while fetching products." });
    }
};

const searchProductByName = async (req, res) => {
    const { productName } = req.params; // Get product name from request body

  try {
    // Check if productName is provided in the request body
    if (!productName) {
      return res.status(400).json({ message: "Product name is required." });
    }

    // Search for the product by name (case-insensitive search)
    const product = await Product.findOne({ Product_Name: { $regex: new RegExp(productName, 'i') } });

    // If no product is found
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Return the found product
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while searching for the product." });
  }
};

//test
const filterProductByPrice = async (req, res) => {
  try {
      const { minPrice, maxPrice } = req.params;

      // Convert minPrice and maxPrice to numbers
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      // Validate if they are numbers
      if ((minPrice && isNaN(min)) || (maxPrice && isNaN(max))) {
          return res.status(400).json({ message: 'Invalid price parameters.' });
      }

      // Construct price filter query
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = min; // Greater than or equal to minPrice
      if (maxPrice) priceFilter.$lte = max; // Less than or equal to maxPrice

      // Find products that match the price filter
      const products = await Product.find({ Price: priceFilter });

      if (!products || products.length === 0) {
          return res.status(404).json({ message: 'No products found within the specified price range.' });
      }

      // Return the filtered products
      res.status(200).json({
          message: 'Products filtered by price range',
          products
      });
  } catch (error) {
      res.status(500).json({ message: 'Error filtering products by price', error: error.message });
  }
};

const sortActivities = async (req, res) => {
    try {
        const { sortBy } = req.query; // Extract sorting criteria from query parameters
        const sortOptions = {};
  
        // Determine the sort order based on the provided parameter
        if (sortBy === 'price') {
            sortOptions.Price = 1; // Ascending order
        } else if (sortBy === 'rating') {
            sortOptions.Rating = 1; // Ascending order
        } else {
            return res.status(400).json({ message: 'Invalid sort criteria. Use "price" or "rating".' });
        }
  
        // Get the current date and ensure it's at midnight for accurate comparison
        const currentDateTime = new Date();
        //currentDateTime.setHours(currentDateTime.getHours() + 3); // Adjust for 3 hours ahead
  
        // Fetch upcoming activities and sort them accordingly
        const sortedActivities = await activity.find({ Date: { $gte: currentDateTime } }) // Fetch activities on or after the current date
            .sort(sortOptions)
            .exec();

        console.log(currentDateTime)    
  
        if (!sortedActivities || sortedActivities.length === 0) {
            return res.status(404).json({ message: 'No upcoming activities found.' });
        }
  
        res.status(200).json(sortedActivities);
    } catch (error) {
        console.error('Error sorting activities:', error);
        res.status(500).json({ error: 'Error sorting activities', details: error.message });
    }
  };

  const sortItineraries = async (req, res) => {
    try {
        const { sortBy } = req.query; // Extract sorting criteria from query parameters
        const sortOptions = {};

        // Determine the sort order based on the provided parameter
        if (sortBy === 'price') {
            sortOptions.Tour_Price = 1; // Ascending order
        } else if (sortBy === 'rating') {
            sortOptions.Rating = 1; // Ascending order
        } else {
            return res.status(400).json({ message: 'Invalid sort criteria. Use "price" or "rating".' });
        }

        // Get the current date and ensure it's at midnight for accurate comparison
        const currentDateTime = new Date();
        // currentDateTime.setHours(currentDateTime.getHours() + 3); // Adjust for 3 hours ahead if needed

        // Fetch upcoming itineraries (greater than or equal to current date and time) and sort them accordingly
        const sortedItineraries = await itinerarym.find({ Available_Date_Time: { $gte: currentDateTime } })
            .sort(sortOptions)
            .exec();

        // Debugging step to log the upcoming itineraries
        console.log(currentDateTime);

        if (!sortedItineraries || sortedItineraries.length === 0) {
            return res.status(404).json({ message: 'No upcoming itineraries found.' });
        }

        res.status(200).json(sortedItineraries);
    } catch (error) {
        console.error('Error sorting itineraries:', error);
        res.status(500).json({ error: 'Error sorting itineraries', details: error.message });
    }
};


const filterPlacesAndMuseums = async (req, res) => {
    const { category, value } = req.params; // Get category and value from request parameters

    try {
        let results;

        if (category === 'historical_places') {
            // Step 1: Get all tags that match the specified type
            const tagDetails = await historical_places_tagsm.find({ Type: value });

            // Step 2: Extract the names from the matching tags
            const matchingNames = tagDetails.map(detail => detail.Name);

            // Step 3: Find historical places that have matching names
            results = await historical_placesm.find({ Name: { $in: matchingNames } });
        } else if (category === 'museums') {
            // Step 1: Find museums that match the specified tag
            results = await museumsm.find({ Tag: value });
        } else {
            return res.status(400).json({ message: 'Invalid category. Use "historical_places" or "museums".' });
        }

        // Step 4: Send the response
        if (results.length > 0) {
            res.status(200).json(results); // Return the filtered results
        } else {
            res.status(404).json({ message: `No ${category} found for this ${category === 'historical_places' ? 'type' : 'tag'}.` });
        }
    } catch (error) {
        console.error('Error filtering:', error);
        res.status(500).json({ error: 'Internal server error' }); // Handle error
    }
};

// Controller function to filter itineraries based on criteria
const filterItineraries = async (req, res) => {
    try {
        const { minPrice, maxPrice, startDate, endDate, preferences, language } = req.query;
        
        // Build the filter object based on the query params
        let filters = {};

        // Filter by price range
        if (minPrice && maxPrice) {
            filters.Tour_Price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        }

        // Filter by date range
        const currentDateTime = new Date(); // Get the current date and time
        if (startDate && endDate) {
            filters.Available_Date_Time = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else {
            filters.Available_Date_Time = { $gte: currentDateTime }; // Default to current and future dates if no date range is specified
        }

        // Filter by language
        if (language) {
            filters.Language = language;
        }

        // Filter by preferences (like beaches, historic areas, etc.)
        if (preferences) {
            const preferenceList = preferences.split(',').map(pref => pref.trim());
            filters.P_Tag = { $in: preferenceList };
        }

        // Find the itineraries that match the filters
        const itineraries = await itinerarym.find(filters);
        
        // Respond with the filtered itineraries
        if (itineraries.length > 0) {
            res.status(200).json(itineraries);
        } else {
            res.status(404).json({ message: 'No upcoming itineraries found with the specified filters.' });
        }
    } catch (err) {
        res.status(500).json({ message: "Error while filtering itineraries", error: err.message });
    }
};

const viewAllRequests = async (req, res) => {
    try {
        // Fetch all requests from the database
        const requests = await Request.find();

        // Check if requests were found
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No requests found.' });
        }

        // Respond with the list of requests
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error retrieving requests:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Example of setting up a route to use this function

const processRequestByEmail = async (req, res) => {
    const { email } = req.params; // Get the email from request parameters

    try {
        // Step 1: Find the request by email
        const requests = await Request.findOne({ Email: email });
        
        if (!requests) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        // Step 2: Check the type of request and add to the corresponding table
        let newRecord;
        if (requests.Type === 'TOUR_GUIDE') {
            newRecord = new tour_guidem({
                Username: requests.Username,
                Email: requests.Email,
                Password: requests.Password,
                Type: requests.Type,
                //Mobile_Number: requests.Mobile_Number,
                //Experience: requests.Experience,
                //Previous_work: requests.Previous_work,
            });
        } else if (requests.Type === 'SELLER') {
            newRecord = new Seller({
                Username: requests.Username,
                Email: requests.Email,
                Password: requests.Password,
                //Shop_Name: requests.Shop_Name,
                //Description: requests.Description,
                //Shop_Location: requests.Shop_Location,
                Type: requests.Type,
            });
        } else if (requests.Type === 'ADVERTISER') {
            newRecord = new AdvertisersModel({
                Username: requests.Username,
                Email: requests.Email,
                Password: requests.Password,
                //Link_to_website: requests.Link_to_website,
                //Hotline: requests.Hotline,
               // Company_Profile: requests.Company_Profile,
                //Company_Name: requests.Company_Name,
                Type: requests.Type,
            });
        } else {
            return res.status(400).json({ message: 'Invalid request type.' });
        }

        // Step 3: Save the new record to the corresponding table
        await newRecord.save();

        // Optional: Delete the request after processing
        //await RequestsModel.deleteOne({ Email: email });

        // Step 4: Respond with the created record
        res.status(201).json(newRecord);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const registerTourist = async (req, res) => {
    try {
        const { Username, Email, Password, Mobile_Number, Nationality, DOB, Job_Student } = req.body;

        // Ensure all required fields are provided
        if (!Username || !Email || !Password || !Mobile_Number || !Nationality || !DOB || !Job_Student) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if email already exists
        const existingRequest = await Tourist.findOne({ Email });
        if (existingRequest) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        // Create a new tourist object without password hashing
        const newTourist = new Tourist({
            Username,
            Email,
            Password,  // No password hashing here
            Mobile_Number,
            Nationality,
            DOB,
            Job_Student,  // The field will be either "Job" or "Student"
            Type: 'Tourist', // Default type is Tourist
            Wallet: 0 // Initial wallet balance
        });

        // Save the tourist to the database
        await newTourist.save();

        // Return the created tourist
        return res.status(201).json(newTourist);

    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ error: 'Error registering tourist', details: error.message });
    }
};

const registerRequest = async (req, res) => {
    try {
        const { Username, Email, Password, Type } = req.body;

        // Ensure all required fields are provided
        if (!Username || !Email || !Password || !Type) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Allowed types for registration requests
        const allowedTypes = ['Tour Guide', 'Advertiser', 'Seller'];

        // Check if the Type is valid
        if (!allowedTypes.includes(Type)) {
            return res.status(400).json({ error: 'Invalid registration type. Must be Tour Guide, Advertiser, or Seller.' });
        }

        // Check if email already exists
        const existingRequest = await Request.findOne({ Email });
        if (existingRequest) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        // Create a new request object
        const newRequest = new Request({
            Username,
            Email,
            Password,  // No password hashing here
            Type
        });

        // Save the request to the database
        await newRequest.save();

        // Return the created request
        return res.status(201).json({ message: "Request successfully submitted", request: newRequest });

    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ error: 'Error submitting request', details: error.message });
    }
};

const createActivityCategory = async (req, res) => {
    try {
        const { Name} = req.body;
        if (!Name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const activityCategory = new categoriesm({Name});
        const savedActivityCategory = await activityCategory.save();
        res.status(201).json(savedActivityCategory );
  
    } catch (error) {
        console.error('Error details:', error); // Add detailed logging
        res.status(500).json({ error: 'Error creating  category', details: error.message || error });
      }
};
  
const readActivityCategories = async (req, res) => {
      try {
          const categories = await categoriesm.find();
          res.status(200).json(categories);
      } catch (error) {
          res.status(500).json({ error: 'Error fetching categories', details: error });
      }
};

const updateActivityCategory = async (req, res) => {
      try {
          const { currentName } = req.params;
          const { newName } = req.body;
          if (!newName) {
              return res.status(400).json({ error: 'New category name is required.' });
          }
  
          const updatedCategory = await categoriesm.findOneAndUpdate(
              { Name: currentName }, 
              { Name: newName },     
              { new: true }                   
          );
          if (!updatedCategory) {
              return res.status(404).json({ message: 'Category not found' });
          }
  
          res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
      } catch (error) {
          console.error('Error updating category:', error.message);
          res.status(500).json({ error: 'Error updating category', details: error.message });
      }
};

const deleteActivityCategory = async (req,res) =>{
    try {

        const { Name } = req.body;

        if (!Name) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const category = await categoriesm.findOne({ Name: Name });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await categoriesm.deleteOne({ Name: Name });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Error deleting Category', error: error.message });
    }
};

const createPreferenceTag = async (req, res) => {
    try {
        const { Name} = req.body;
        if (!Name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const preferenceTag = new p_tagsm({Name});
        const savedPreferenceTag = await preferenceTag.save();
        res.status(201).json(savedPreferenceTag );
  
    } catch (error) {
        console.error('Error details:', error); // Add detailed logging
        res.status(500).json({ error: 'Error creating pereference tag', details: error.message || error });
    }
};
  
const readPreferenceTag = async (req, res) => {
    try {
        const preferences = await p_tagsm.find();
        res.status(200).json(preferences);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pereference tags', details: error });
    }
};
  
const updatePreferenceTag = async (req, res) => {
    try {
        const { currentName } = req.params;
        const { newName } = req.body;
        if (!newName) {
            return res.status(400).json({ error: 'New category name is required.' });
        }
  
        const updatedTag = await p_tagsm.findOneAndUpdate(
            { Name: currentName }, 
            { Name: newName },     
            { new: true }                   
        );
        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
  
        res.status(200).json({ message: 'Tag updated successfully', data: updatedCategory });
    } catch (error) {
        console.error('Error updating Tag:', error.message);
        res.status(500).json({ error: 'Error updating Tag', details: error.message });
    }
};
  
const deletePreferenceTag = async (req,res) =>{
    try {
  
        const { Name } = req.body;
  
        if (!Name) {
            return res.status(400).json({ message: 'Tag name is required' });
        }
        const tag = await p_tagsm.findOne({ Name: Name });
  
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        await p_tagsm.deleteOne({ Name: Name });
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
  
        res.status(500).json({ message: 'Error Tag Category', error: error.message });
    }
};

const searchByNameCategoryTag = async (req, res) => {
    try {
        const { searchTerm } = req.query;
  
        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required.' });
        }
  
        // Define a regex to match the search term (case-insensitive)
        const searchRegex = new RegExp(searchTerm, 'i');
  
        // Search in the museum collection by Name or Tag
        const museums = await museumsm.find({
            $or: [
                { Name: searchRegex },
                { Tag: searchRegex }
            ]
        });
  
        // Search in the historical places collection by Name
        const historicalPlaces = await historical_placesm.find({
            Name: searchRegex
        });
  
        const historicalTags = await historical_places_tagsm.find({
            Type: searchRegex
        })
  
        const activityName = await activity.find({
            Name: searchRegex
        })
  
        // Search in the activity tags by Tag and fetch corresponding activities
        const activityTags = await activity_tagsm.find({
            Tag: searchRegex
        });
  
        // Search in the activity categories by Category
        const activityCategories = await activity_categoriesm.find({
            Category: searchRegex
        })
  
        // Search in the itineraries collection by Itinerary_Name or Tag (P_Tag)
        const itineraries = await itinerarym.find({
            $or: [
                { Itinerary_Name: searchRegex },
                { P_Tag: searchRegex }
            ]
        });
  
        // Combine all search results into one object
        const searchResults = {
            museums,
            historicalPlaces:{
                name : historicalPlaces,
                tag : historicalTags
            },
            activities: {
                name: activityName,
                tags: activityTags,
                categories: activityCategories
            },
            itineraries
        };
  
        // Return the results as JSON
        res.status(200).json(searchResults);
  
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'Error searching for data', details: error.message });
    }
};
  
//Tourist - admin - seller : Sort Product by ratings
const getProductsSortedByRating = async (req, res) => {
    try {
      // Fetch all products and sort by Rating in descending order (-1)
      const products = await Product.find().sort({ Rating: -1 });
  
      // Return the sorted list of products
      res.status(200).json({ message: 'Products sorted by rating', products: products });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

//Admin - seller : add a product with its details , price and available quantities 
const addProduct = async (req, res) => {
    try {
        // Destructure product attributes from the request body
        const { Product_Name, Picture, Price, Quantity, Seller_Name, Description, Rating, Reviews } = req.body;
  
        // Check if the Picture is provided in the request body
        if (!Picture) {
            return res.status(400).json({ message: "Error: 'Picture' field is required." });
        }

        // Check if a product with the same name already exists in the database
        const existingProduct = await Product.findOne({ Product_Name });
        if (existingProduct) {
            return res.status(400).json({ message: "Error: Product with this name already exists." });
        }
  
        // Create a new product instance using the product model
        const newProduct = new Product({
            Product_Name,   // e.g. "Product 1"
            Picture,        // e.g. "url_to_image.jpg"
            Price,          // e.g. 10
            Quantity,       // e.g. 100
            Seller_Name,    // e.g. "Egyptian Treasures"
            Description,    // e.g. "Description of Product 1"
            Rating,         // e.g. 4.5
            Reviews         // e.g. 150
        });
  
        // Save the new product to the database
        await newProduct.save();
  
        // Return success response
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

//Admin - seller : edit product details and price 
const updateProduct = async (req, res) => {
    try {
      // Destructure Product_Name from the request body
      const { Product_Name, Picture, Price, Description, Seller_Name, Rating, Reviews, Quantity } = req.body;
  
      // Create an object to hold only the fields that are provided (not undefined)
      const updateFields = {};
      if (Picture) updateFields.Picture = Picture;
      if (Price) updateFields.Price = Price;
      if (Description) updateFields.Description = Description;
      if (Seller_Name) updateFields.Seller_Name = Seller_Name;
      if (Rating) updateFields.Rating = Rating;
      if (Reviews) updateFields.Reviews = Reviews;
      if (Quantity) updateFields.Quantity = Quantity;
  
      // Check if Product_Name is provided
      if (!Product_Name) {
        return res.status(400).json({ message: 'Product_Name is required to update the product.' });
      }
  
      // Debugging output
      console.log('Querying for Product_Name:', Product_Name);
  
      // Find the product by name and update the fields
      const updatedProduct = await Product.findOneAndUpdate(
        { Product_Name: { $regex: new RegExp(`^${Product_Name.trim()}$`, 'i') } }, // Case-insensitive search
        updateFields,
        { new: true }
      );
  
      // Check if the product exists
      if (!updatedProduct) {
        console.log('No product found for the given Product_Name:', Product_Name);
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Return success response
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

  //Tourist - Guest :Activities Filter 

// Tourist : view Tourist profile
const getTouristProfile = async (req, res) => {
  try {
      // Extract the email from the request body
      const { Email } = req.body; // Destructure Email from req.body

      // Check if Email is provided
      if (!Email) {
          return res.status(400).json({ message: 'Email is required' });
      }

      // Find the tourist by email
      const tourist = await Tourist.findOne({ Email });
      
      // Check if the tourist was found
      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Return the tourist profile
      res.status(200).json(tourist);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving tourist profile', error: error.message });
  }
};

const updateTouristProfile= async (req, res) => {
  try {
      // Extract the email and fields to update from the request body
      const { Email, Password, Mobile_Number, Nationality, Job_Student, Type } = req.body;

      if (!Email) {
          return res.status(400).json({ message: 'Email is required' });
      }

      // Find tourist by email
      const tourist = await Tourist.findOne({ Email: Email });

      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Only update the fields that are allowed to be modified
      if (Password) tourist.Password = Password;
      if (Mobile_Number) tourist.Mobile_Number = Mobile_Number;
      if (Nationality) tourist.Nationality = Nationality;
      if (Job_Student) tourist.Job_Student = Job_Student;
      if (Type) tourist.Type = Type;

      // Save the updated profile
      const updatedTourist = await tourist.save();

      // Return the updated profile
      res.status(200).json({
          message: 'Tourist profile updated successfully',
          tourist: updatedTourist
      });
  } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Error updating tourist profile', error: error.message });
  }
};

//Seller : Create my profile 
const createSellerProfile = async (req, res) => {
    try {
        const { Username, Email, Password, Shop_Name, Description, Shop_Location, Type } = req.body;

        // Check if a seller with the same email already exists in the database
        const existingSeller = await sellerm.findOne({ Email });
        if (existingSeller) {
            return res.status(400).json({ message: "Error: A seller with this email already exists." });
        }

        // Create a new seller profile
        const newSeller = new sellerm({
            Username,
            Email,
            Password,
            Shop_Name,
            Description,
            Shop_Location,
            Type
        });

        // Save the new seller profile
        const savedSeller = await newSeller.save();

        // Return success response
        res.status(201).json(savedSeller);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error creating seller profile', error: error.message });
    }
};

//Seller : get my profile 
const getSellerProfile = async (req, res) => {
    try {
      const { Email } = req.body; // Destructure to extract Email correctly
      if (!Email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const seller = await sellerm.findOne({ Email: Email });
  
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      res.status(200).json(seller);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving seller profile', error: error.message });
    }
};

const updateSellerProfile = async (req, res) => {
    try {
        // Extract email and the fields to update from the request body
        const {Username, Email, Password, Shop_Name, Description, Shop_Location,Type } = req.body;

        // Check if email is provided
        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find the seller by email
        const seller = await sellerm.findOne({ Email: Email });

        // If seller is not found
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Only update the fields that are provided in the request body
        if (Username) seller.Username = Username;
        if (Password) seller.Password = Password;
        if (Shop_Name) seller.Shop_Name = Shop_Name;
        if (Description) seller.Description = Description;
        if (Shop_Location) seller.Shop_Location = Shop_Location;
        if (Type) seller.Type = Type;

        // Save the updated seller profile
        const updatedSeller = await seller.save();

        // Return the updated seller profile
        res.status(200).json({
            message: 'Seller profile updated successfully',
            seller: updatedSeller
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error updating seller profile', error: error.message });
    }
};

//Tour guide: Create Profile 
const createTourGuideProfile = async (req, res) => {
    try {
        const { Username, Email, Password, Type, Mobile_Number, Experience, Previous_work } = req.body;

        // Check if a tour guide with the same email already exists in the database
        const existingTourGuide = await tour_guidem.findOne({ Email });
        if (existingTourGuide) {
            return res.status(400).json({ message: "Error: A tour guide with this email already exists." });
        }

        // Create a new tour guide profile
        const newTourGuide = new tour_guidem({
            Username,
            Email,
            Password,
            Mobile_Number,
            Experience,
            Previous_work
        });

        // Save the new tour guide to the database
        const savedTourGuide = await newTourGuide.save();
        
        // Return success response
        res.status(201).json({
            message: 'Tour guide profile created successfully',
            tourGuide: savedTourGuide
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error creating tour guide profile', error: error.message });
    }
};
 
//Tour guide : update profile
const updateTourGuideProfile = async (req, res) => {
    try {
        // Extract the email and fields to update from the request body
        const { Username, Email, Password, Type, Mobile_Number, Experience, Previous_work } = req.body;

        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find tour guide by email
        const tour_guide = await tour_guidem.findOne({ Email: Email });

        if (!tour_guide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        // Only update the fields that are allowed to be modified
        if (Username) tour_guide.Username = Username;
        if (Password) tour_guide.Password = Password;
        if (Type) tour_guide.Type = Type;
        if (Mobile_Number) tour_guide.Mobile_Number = Mobile_Number;
        if (Experience) tour_guide.Experience = Experience;
        if (Previous_work) tour_guide.Previous_work = Previous_work;

        // Save the updated profile
        const updatedTourGuide = await tour_guide.save();

        // Return the updated profile
        res.status(200).json({
            message: 'Tour guide profile updated successfully',
            tour_guide: updatedTourGuide
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error updating tour guide profile', error: error.message });
    }
};

//Tour guide : Get profile 
const getTourGuideProfile = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find tour guide by email
        const tour_guide = await tour_guidem.findOne({ Email: Email });

        if (!tour_guide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        // Return the tour guide profile
        res.status(200).json({
            message: 'Tour guide profile retrieved successfully',
            tour_guide: tour_guide
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving tour guide profile', error: error.message });
    }
};

//Create an itinerary 
const createItinerary = async (req, res) => {
    try {
        // Destructure the itinerary data from the request body
        const { 
            Email,
            Itinerary_Name, 
            Timeline, 
            Duration, 
            Language, 
            Tour_Price, 
            Available_Date_Time, 
            Accessibility, 
            Pick_Up_Point, 
            Drop_Of_Point, 
            Booked, 
            Empty_Spots, 
            Country, 
            Rating, 
            P_Tag 
        } = req.body;

        // Validate required fields
        if (!Email||!Itinerary_Name || !Timeline || !Duration || !Language || 
            !Tour_Price || !Available_Date_Time || !Accessibility || 
            !Pick_Up_Point || !Drop_Of_Point || !Booked || 
            !Empty_Spots || !Country || !Rating || !P_Tag) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if an itinerary with the same name already exists
        const existingItinerary = await itinerarym.findOne({ Itinerary_Name });
        if (existingItinerary) {
            return res.status(409).json({ error: 'Itinerary name already exists.' });
        }

        // Create a new itinerary instance with the data from the request body
        const newItinerary = new itinerarym({
            Itinerary_Name,
            Timeline,
            Duration,
            Language,
            Tour_Price,
            Available_Date_Time,
            Accessibility,
            Pick_Up_Point,
            Drop_Of_Point,
            Booked,
            Empty_Spots,
            Country,
            Rating,
            P_Tag
        });

        // Save the itinerary to the database
        const savedItinerary = await newItinerary.save();

        const newTourGuideItinerary = new tour_guide_itinerariesm({
            Email,
            Itinerary_Name
        });

        // Save the tour guide itinerary mapping to the database
        const savedTourGuideItinerary = await newTourGuideItinerary.save();

        // Return success response
        res.status(201).json({
            message: 'Itinerary created successfully',
            itinerary: savedItinerary,
            tourGuideItinerary: savedTourGuideItinerary
        });
    } catch (error) {
        console.error("Error creating itinerary:", error.message); // Log the error for debugging
        res.status(500).json({ message: 'Error creating itinerary', error: error.message });
    }
};

const getItineraryByName = async (req, res) => {
    try {
        // Extract Itinerary_Name from req.params
        const { itineraryName } = req.params;

        if (!itineraryName) {
            return res.status(400).json({ message: 'Itinerary name is required' });
        }

        // Find itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name: itineraryName });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Return the itinerary
        res.status(200).json({
            message: 'Itinerary retrieved successfully',
            itinerary: itinerary
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving itinerary', error: error.message });
    }
};


//Update itinerary by name
const updateItinerary = async (req, res) => {
    try {
        // Extract itinerary name and the fields to update from the request body
        const { Itinerary_Name, Timeline, Duration, Language, Tour_Price, Available_Date_Time, Accessibility, Pick_Up_Point, Drop_Of_Point, Booked, Empty_Spots, Country, Rating, P_Tag } = req.body;

        // Check if itinerary name is provided
        if (!Itinerary_Name) {
            return res.status(400).json({ message: 'Itinerary name is required' });
        }

        // Find the itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name: Itinerary_Name });

        // If itinerary is not found
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Only update the fields that are provided in the request body
        if (Timeline) itinerary.Timeline = Timeline;
        if (Duration) itinerary.Duration = Duration;
        if (Language) itinerary.Language = Language;
        if (Tour_Price) itinerary.Tour_Price = Tour_Price;
        if (Available_Date_Time) itinerary.Available_Date_Time = Available_Date_Time;
        if (Accessibility != null) itinerary.Accessibility = Accessibility;
        if (Pick_Up_Point) itinerary.Pick_Up_Point = Pick_Up_Point;
        if (Drop_Of_Point) itinerary.Drop_Of_Point = Drop_Of_Point;
        if (Booked) itinerary.Booked = Booked;
        if (Empty_Spots) itinerary.Empty_Spots = Empty_Spots;
        if (Country) itinerary.Country = Country;
        if (Rating) itinerary.Rating = Rating;
        if (P_Tag) itinerary.P_Tag = P_Tag;

        // Save the updated itinerary
        const updatedItinerary = await itinerary.save();

        // Return the updated itinerary
        res.status(200).json({
            message: 'Itinerary updated successfully',
            itinerary: updatedItinerary
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error updating itinerary', error: error.message });
    }
};

//Delete Itinerary 
const deleteItinerary = async (req, res) => {
    try {
        // Extract itinerary name from the request body
        const { Itinerary_Name } = req.body;

        // Check if itinerary name is provided
        if (!Itinerary_Name) {
            return res.status(400).json({ message: 'Itinerary name is required' });
        }

        // Find the itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name: Itinerary_Name });

        // If itinerary is not found
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Check if the itinerary has any bookings (Booked > 0)
        if (itinerary.Booked > 0) {
            return res.status(400).json({ message: 'Cannot delete itinerary with active bookings' });
        }

        // If no bookings, delete the itinerary
        await itinerarym.deleteOne({ Itinerary_Name: Itinerary_Name });

        // Return success message
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error deleting itinerary', error: error.message });
    }
};

//view all upcoming: itineraries , activities & historical places and museums
const getAllUpcomingEventsAndPlaces = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Query itineraries where Available_Date_Time is in the future
        const upcomingItineraries = await itinerarym.find({
            Available_Date_Time: { $gt: currentDate }
        });

        // Query activities where Date is greater than or equal to the current date
        const upcomingActivities = await activity.find({
            Date: { $gte: currentDate }
        });

        // Query to find all museums in the database
        const museums = await museumsm.find();

        // Query to find all historical places in the database
        const historicalPlaces = await historical_placesm.find();

        // Prepare the response
        res.status(200).json({
            message: 'Upcoming events and places retrieved successfully',
            upcomingItineraries: upcomingItineraries.length > 0 ? upcomingItineraries : 'No upcoming itineraries found',
            upcomingActivities: upcomingActivities.length > 0 ? upcomingActivities : 'No upcoming activities found',
            museums: museums.length > 0 ? museums : 'No museums found',
            historicalPlaces: historicalPlaces.length > 0 ? historicalPlaces : 'No historical places found'
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving data', error: error.message });
    }
};

//Creating Advertiser as a request
const createUserAdvertiser = async (req, res) => {
    try {
        const {  Username,Email,Password, Type,Link_to_website,
            Hotline,Company_Profile,Company_Name } = req.body;
        
            if (!Username || !Password || !Email || !Type ||!Link_to_website
                ||!Hotline||!Company_Profile||!Company_Name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newadvertiser = new AdvertisersModel({
            Username,
            Email,
            Password, 
            Type,
            Link_to_website,
            Hotline,
            Company_Profile,
            Company_Name
        });
        const savedUser= await newadvertiser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } 
    catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
};

//Reading all advertiser detail by email
const readAdvertiser = async (req,res)=>{
    try{
        const { email } = req.body; 
        const advertiserProfile = await AdvertisersModel.findOne({ Email: email });

        if (!advertiserProfile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        res.status(200).json({ message: 'Advertiser fetched successfully', data: advertiserProfile });
    }
    catch(error){
        console.error("Error fetching company profile:", error.message);
        res.status(500).json({ error: 'Error fetching company profile', details: error.message });
    }
}

//Updating advertiser using email
const updateUserAdvertiser = async (req, res) => {
    //update a user in the database
    try{
        const {Username,Email,Password,type,Link_to_website, Hotline ,Company_Profile,Company_Name } = req.body;
        const updatedUser = await AdvertisersModel.findOneAndUpdate(
            {Email: Email },
            {Username,Email,Password,type,Link_to_website, Hotline ,Company_Profile,Company_Name },  // Fields to update
            {new: true, runValidators: true }  // Options: return the updated document and run schema validators
    );
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
};

//Advertiser Creating An Activity
const createActivityByAdvertiser = async (req, res) => {
    try {
        const { 
            Name, Location, Time, Duration, Price, Date, Discount_Percent, 
            Booking_Available, Available_Spots, Booked_Spots, Rating, 
            Category, Tag 
        } = req.body;

        // Check if all required fields are provided
        if (!Name || !Location || !Time || !Duration || !Price || !Date || 
            !Discount_Percent || !Booking_Available || !Available_Spots || 
            !Booked_Spots || !Rating || !Category || !Tag) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a new activity
        const newActivity = new activity({
            Name, Location, Time, Duration, Price, Date, 
            Discount_Percent, Booking_Available, Available_Spots, 
            Booked_Spots, Rating
        });

        // Save the new activity
        const savedActivity = await newActivity.save();

        // Create the category entry
        const newCategory = new activity_categoriesm({
            Activity: savedActivity.Name,  // Link category to the created activity
            Category
        });

        await newCategory.save(); // Save the category

        // Create the tag entry
        const newTag = new activity_tagsm({
            Activity: savedActivity.Name,  // Link tag to the created activity
            Tag
        });

        await newTag.save(); // Save the tag

        // Return success response
        res.status(201).json({ 
            message: 'Activity created successfully', 
            activity: savedActivity 
        });
    } 
    catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating activity', details: error.message });
    }
};


//Advertiser Reading Activity
const readActivity = async (req,res)=>{
    try{
        const { name } = req.body; // Assuming email is passed as a URL parameter
        const activityDetails = await activity.findOne({ Name: name });

        if (!activityDetails) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'Activity fetched successfully', data: activityDetails });
    }
    catch(error){
        console.error("Error fetching company profile:", error.message);
        res.status(500).json({ error: 'Error fetching company profile', details: error.message });
    }
}


//Advertiser Updates Activity
const updateActivityByAdvertiser = async (req, res) => {
    try {
        const { 
            Name, 
            Location, 
            Time, 
            Duration, 
            Price, 
            Date, 
            Tag, 
            Category, 
            Discount_Percent,
            Booking_Available,
            Available_Spots,
            Booked_Spots,
            Rating 
        } = req.body;

        const updatedActivity = await activity.findOneAndUpdate(
            { Name }, // Find activity by Name
            { 
                Location,
                Time,
                Duration,
                Price,
                Date,
                Discount_Percent,
                Booking_Available,
                Available_Spots,
                Booked_Spots,
                Rating 
            },  // Fields to update
            { new: true, runValidators: true }  // Options: return the updated document and run schema validators
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Update the associated activity category
        await activity_categoriesm.findOneAndUpdate(
            { Activity: Name }, 
            { Category }
        );

        // Update the associated activity tag
        await activity_tagsm.findOneAndUpdate(
            { Activity: Name }, 
            { Tag }
        );

        res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
    } catch (error) {
        console.error("Error updating activity:", error.message);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
};


//Advertiser deletes activity
const deleteActivityByAdvertiser = async (req, res) => {
    try {
        const { Name } = req.body;

        // Find the activity by name and delete it
        const deletedActivity = await activity.findOneAndDelete({ Name });

        if (!deletedActivity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Also delete the associated category and tag
        await activity_categoriesm.findOneAndDelete({ Activity: Name });
        await activity_tagsm.findOneAndDelete({ Activity: Name });

        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error("Error deleting activity:", error.message);
        res.status(500).json({ error: 'Error deleting activity', details: error.message });
    }
};

const createUserTourism_Governer = async(req,res) => {
    //add a new user to the database with 
    //Name, Email and Age
    try {
       const {Username, Email, Password, Type} = req.body;
   
       // Create a new user instance with the data
       const newUser = new tourism_governers({ Username, Email, Password, Type});
   
       // Save the user to the database
       await newUser.save();
   
       // Return success response
       res.status(201).json({ message: 'User created successfully', user: newUser });
     } catch (error) {
       // Handle errors
       res.status(500).json({ message: 'Error creating user', error: error.message });
     }
};

 const deleteUserTourism_Governer = async (req, res) => {
    try {
        const Email = req.body;

        // Find the user by ID and delete it
        const deleteUserTourism_Governer = await tourism_governers.findOneAndDelete(Email);

        if (!deleteUserTourism_Governer) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user', details: error });
    }
};


const createMuseum = async (req, res) => {
    try {
        const {  Name,description,pictures, location,Country,
            Opening_Hours,S_Tickets_Prices,F_Tickets_Prices,N_Tickets_Prices , Tag } = req.body;
        
            if (!Name || !description || !pictures || !location ||!Country
                ||!Opening_Hours||!S_Tickets_Prices||!F_Tickets_Prices||!N_Tickets_Prices ||!Tag) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newMuseum = new museumsm({
            Name,
            description,
            pictures, 
            location,
            Country,
            Opening_Hours,
            S_Tickets_Prices,
            F_Tickets_Prices,
            N_Tickets_Prices,
            Tag
        });
        const savedMuseum= await newMuseum.save();
        res.status(201).json({ message: 'Museum created successfully', Museum: savedMuseum });
    } 
    catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating Museum', details: error.message });
    }
};

const readMuseum = async (req,res)=>{
    try{
        const { name } = req.body; 
        const museumProfile = await museumsm.findOne({ Name: name });

        if (!museumProfile) {
            return res.status(404).json({ message: 'Museum not found' });
        }
        res.status(200).json({ message: 'Museum fetched successfully', data: museumProfile });
    }
    catch(error){
        console.error("Error fetching Museum:", error.message);
        res.status(500).json({ error: 'Error fetching Museum', details: error.message });
    }
};

const createHistoricalPlace = async (req, res) => {
    try {
        const {  Name, 
            Description, 
            Pictures, 
            Location, 
            Country, 
            Opens_At, 
            Closes_At, 
            S_Ticket_Prices, 
            F_Ticket_Prices, 
            N_Ticket_Prices } = req.body;
        
            if (!Name || !Description || !Pictures || !Location ||!Country
                ||!Opens_At ||!Closes_At ||!S_Ticket_Prices||!F_Ticket_Prices||!N_Ticket_Prices) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newHistoricalPlace = new historical_placesm({
            Name,
            Description,
            Pictures, 
            Location,
            Country,
            Opens_At,
            Closes_At,
            S_Ticket_Prices,F_Ticket_Prices,N_Ticket_Prices
        });
        const savedHistorical= await newHistoricalPlace.save();
        res.status(201).json({ message: 'Historical Place created successfully', HistoricalPlace: savedHistorical });
    } 
    catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating Historical Place', details: error.message });
    }
};

const readHistoricalPlace = async (req,res)=>{
    try{
        const { name } = req.body; 
        const hpProfile = await historical_placesm.findOne({ Name: name });

        if (!hpProfile) {
            return res.status(404).json({ message: 'Historical Place not found' });
        }
        res.status(200).json({ message: 'Historical Place fetched successfully', data: hpProfile });
    }
    catch(error){
        console.error("Error fetching Historical Place:", error.message);
        res.status(500).json({ error: 'Error fetching Historical Place', details: error.message });
    }
}

const updateMuseum = async (req, res) => {
    //update a user in the database
    try{
        const {Name,
            description,
            pictures, 
            location,
            Country,
            Opening_Hours,
            S_Tickets_Prices,
            F_Tickets_Prices,
            N_Tickets_Prices,
            Tag} = req.body;
        const updatedMuseum = await museumsm.findOneAndUpdate(
            {Name: Name },
            {Name,description,pictures, location,Country,
            Opening_Hours,S_Tickets_Prices,F_Tickets_Prices,N_Tickets_Prices,Tag },  // Fields to update
            {new: true, runValidators: true }  // Options: return the updated document and run schema validators
        );
    if (!updatedMuseum) {
        return res.status(404).json({ message: 'Museum not found' });
    }
    res.status(200).json({ message: 'Museum updated successfully', user: updatedMuseum });
    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
};


const updateHistoricalPlace = async (req, res) => {
    //update a user in the database
    try{
        const {Name, 
            Description, 
            Pictures, 
            Location, 
            Country, 
            Opens_At, 
            Closes_At, 
            S_Ticket_Prices, 
            F_Ticket_Prices, 
            N_Ticket_Prices} = req.body;
        const updatedHistoricalPlace = await historical_placesm.findOneAndUpdate(
            {Name: Name },
            {Name, Description,Pictures, Location,Country,Opens_At, 
            Closes_At, S_Ticket_Prices,F_Ticket_Prices, N_Ticket_Prices },  // Fields to update
            {new: true, runValidators: true }  // Options: return the updated document and run schema validators
        );
    if (!updatedHistoricalPlace) {
        return res.status(404).json({ message: 'Historical Place not found' });
    }
    res.status(200).json({ message: 'Historical Place updated successfully', user: updatedHistoricalPlace });
    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
};

const deleteMuseum = async (req, res) => {
    try {
        const {Name} = req.body;

        // Find the museum by name and delete it
        const deletedMuseum = await museumsm.findOneAndDelete({ Name: Name });

        if (!deletedMuseum) {
            return res.status(404).json({ error: 'Museum not found' });
        }

        res.status(200).json({ message: 'Museum deleted successfully' });
    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error deleting Museum', details: error.message });
    }
};

const deleteHistoricalPlace= async (req, res) => {
    try {
        const {Name} = req.body;

        // Find the historical place by name and delete it
        const deletedPlace = await historical_placesm.findOneAndDelete({ Name: Name });

        if (!deletedPlace) {
            return res.status(404).json({ error: 'Historical Place not found' });
        }

        res.status(200).json({ message: 'Historical Place deleted successfully' });
    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error deleting Historical Place', details: error.message });
    }
};

const creatTouristItenrary= async(req,res)=>{
    try {
        const {Tourist_Email,Itinerary_Name}=req.body;

        if (!Tourist_Email || !Itinerary_Name){
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const touristExists = await Tourist.findOne({ Email: Tourist_Email }); // Change 'email' to 'Email'
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        const itineraryExists = await itinerarym.findOne({ Itinerary_Name });
        if (!itineraryExists) {
            return res.status(409).json({ error: 'Itinerary name not found.' });
        }

        if (itineraryExists.Empty_Spots <= 0) {
            return res.status(400).json({ error: 'No available spots for this itinerary.' });
        }

        const duplicateItinerary = await tourist_itinerariesm.findOne({ Tourist_Email, Itinerary_Name });
        if (duplicateItinerary) {
            return res.status(409).json({ error: 'This itinerary has already been booked by the tourist.' });
        }

        const newTouristItenrary = new tourist_itinerariesm({Tourist_Email,Itinerary_Name});
        const savedTouristItenrary = await newTouristItenrary.save();
        res.status(201).json({ message: 'Tourist itinerary created successfully', Tourist_Itinerary: savedTouristItenrary });

        await itinerarym.findOneAndUpdate(
            { Itinerary_Name },
            { $inc: { Booked: 1, Empty_Spots: -1 } } // Increment Booked and decrement Empty_Spots
        );

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating tourist itinerary', details: error.message });
    }
}

const filterActivities = async (req, res) => {
    try {
        const { minPrice, maxPrice, startDate, endDate, rating, category } = req.query;

        const filters = {};

        // Filter by Price
        if (minPrice || maxPrice) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            if ((minPrice && isNaN(min)) || (maxPrice && isNaN(max))) {
                return res.status(400).json({ message: 'Invalid price parameters' });
            }
            filters.Price = {};
            if (minPrice) filters.Price.$gte = min;
            if (maxPrice) filters.Price.$lte = max;
        }

        // Filter by Date
        if (startDate || endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: 'Invalid date format' });
            }
            end.setHours(23, 59, 59, 999);
            filters.Date = { $gte: start, $lte: end };
        }

        // Filter by Rating
        if (rating) {
            const ratingNumber = parseFloat(rating);
            if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 10) {
                return res.status(400).json({ message: 'Invalid rating parameter. Please provide a number between 0 and 10.' });
            }
            filters.Rating = ratingNumber;
        }

        // Filter by Category
        if (category) {
            const activityCategories = await activity_categoriesm.find({ Category: category });
            const activityNames = activityCategories.map(cat => cat.Activity);
            filters.Name = { $in: activityNames };
        }

        // Find activities based on filters
        const activities = await activity.find(filters).sort({ Date: 1, Rating: -1 });

        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: 'No activities found matching the filters.' });
        }

        res.status(200).json({ message: 'Filtered activities', activities });
    } catch (error) {
        res.status(500).json({ message: 'Error filtering activities', error: error.message });
    }
};


const deleteTouristItenrary = async (req, res) => {
    try {
        const { Tourist_Email, Itinerary_Name } = req.body;

        // Validate input
        if (!Tourist_Email || !Itinerary_Name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the tourist exists
        const touristExists = await Tourist.findOne({ Email: Tourist_Email });
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the itinerary exists
        const itineraryExists = await itinerarym.findOne({ Itinerary_Name });
        if (!itineraryExists) {
            return res.status(409).json({ error: 'Itinerary name not found.' });
        }

        // Check if the tourist itinerary exists
        const touristItineraryExists = await tourist_itinerariesm.findOne({ Tourist_Email, Itinerary_Name });
        if (!touristItineraryExists) {
            return res.status(404).json({ error: 'Tourist itinerary not found.' });
        }

        // Delete the tourist itinerary
        await tourist_itinerariesm.deleteOne({ Tourist_Email, Itinerary_Name });

        // Update the itinerary: decrement Booked and increment Empty_Spots
        await itinerarym.findOneAndUpdate(
            { Itinerary_Name },
            { $inc: { Booked: -1, Empty_Spots: 1 } }
        );

        // Send a response
        res.status(200).json({ message: 'Tourist itinerary deleted successfully.' });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error deleting tourist itinerary', details: error.message });
    }
};

const updateTouristItenrary = async (req, res) => {
    try {
        const { Tourist_Email, Itinerary_Name, newItineraryData } = req.body;

        // Validate input
        if (!Tourist_Email || !Itinerary_Name || !newItineraryData || !newItineraryData.Itinerary_Name) {
            return res.status(400).json({ error: 'Tourist email, current itinerary name, and new itinerary name are required.' });
        }

        const newItineraryName = newItineraryData.Itinerary_Name;

        // Check if the tourist exists
        const touristExists = await Tourist.findOne({ Email: Tourist_Email });
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the old itinerary exists
        const oldItineraryExists = await itinerarym.findOne({ Itinerary_Name });
        if (!oldItineraryExists) {
            return res.status(409).json({ error: 'Current itinerary not found.' });
        }

        // Check if the new itinerary exists
        const newItineraryExists = await itinerarym.findOne({ Itinerary_Name: newItineraryName });
        if (!newItineraryExists) {
            return res.status(409).json({ error: 'New itinerary not found.' });
        }

        if (newItineraryExists.Empty_Spots <= 0) {
            return res.status(400).json({ error: 'No available spots for the new itinerary.' });
        }

        // Check if the tourist itinerary exists
        const touristItineraryExists = await tourist_itinerariesm.findOne({ Tourist_Email, Itinerary_Name });
        if (!touristItineraryExists) {
            return res.status(404).json({ error: 'Tourist itinerary not found.' });
        }

        // Update the tourist itinerary with the new itinerary name
        const updatedTouristItinerary = await tourist_itinerariesm.findOneAndUpdate(
            { Tourist_Email, Itinerary_Name },
            { $set: { Itinerary_Name: newItineraryName } },
            { new: true } // Return the updated document
        );

        // Decrement Booked and increment Empty_Spots for the old itinerary
        await itinerarym.findOneAndUpdate(
            { Itinerary_Name },
            { $inc: { Booked: -1, Empty_Spots: 1 } }
        );

        // Increment Booked and decrement Empty_Spots for the new itinerary
        await itinerarym.findOneAndUpdate(
            { Itinerary_Name: newItineraryName },
            { $inc: { Booked: 1, Empty_Spots: -1 } }
        );

        // Send response
        res.status(200).json({ message: 'Tourist itinerary updated successfully', updatedTouristItinerary });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error updating tourist itinerary', details: error.message });
    }
};

const getBookedItineraries = async (req, res) => {
    try {
        const { Tourist_Email } = req.body;

        // Validate input
        if (!Tourist_Email) {
            return res.status(400).json({ error: 'Tourist email is required.' });
        }

        // Check if the tourist exists
        const touristExists = await Tourist.findOne({ Email: Tourist_Email });
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Find all booked itineraries for the tourist
        const bookedItineraries = await tourist_itinerariesm.find({ Tourist_Email });

        if (bookedItineraries.length === 0) {
            return res.status(404).json({ error: 'No itineraries found for this tourist.' });
        }

        // Retrieve full details for each booked itinerary
        const itineraryDetails = await Promise.all(
            bookedItineraries.map(async (booking) => {
                const itinerary = await itinerarym.findOne({ Itinerary_Name: booking.Itinerary_Name });
                return itinerary;
            })
        );

        // Send response
        res.status(200).json({ message: 'Booked itineraries retrieved successfully', itineraries: itineraryDetails });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error retrieving booked itineraries', details: error.message });
    }
};


const viewMyCreatedActivities = async (req, res) => {
    try {
        const { Email } = req.body;  // Extract the Email from request body

        // Find all activities by advertiser's email (use find instead of findOne)
        const activities = await advertiser_activitiesm.find({ Email: Email });

        // Check if any activities were found
        if (activities.length > 0) {
            return res.status(200).json({
                message: 'Activities found',
                activities: activities // Return the activities in the response
            });
        } else {
            return res.status(404).json({
                message: 'No activities found for this email.',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving activities', error: error.message });
    }
};

const viewMyCreatedItenrary = async (req, res) => {
    try {
        const { Email } = req.query; // Extract email from the request body

        // Find itineraries by the tour guide's email
        const itineraries = await tour_guide_itinerariesm.find({ Email: Email });

        // Check if any itineraries were found
        if (itineraries.length > 0) {
            // If found, return the itineraries in the response
            return res.status(200).json({
                message: 'Itineraries found',
                itineraries: itineraries, // Return the actual itineraries found
            });
        } else {
            // If no itineraries are found
            return res.status(404).json({
                message: 'No itineraries found for this email.',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error retrieving itineraries',
            error: error.message,
        });
    }
};


const viewMyCreatedMuseumsAndHistoricalPlaces = async(req, res) =>{
    try{
        const { Email } = req.body;
        
        // Find activities by tour guide's email
        const email = await tourismgoverner_museumsandhistoricalplacesm.findOne({ email: Email });

        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Check if any itenraries were found
        if (tourismgoverner_museumsandhistoricalplacesm.length > 0) {
            res.status(200).json({
                message: 'Museums and Historical Placees found',
                museums: tourismgoverner_museumsandhistoricalplacesm,
                historical_places:tourismgoverner_museumsandhistoricalplacesm
                
            });
        } else {
            res.status(404).json({
                message: 'No Museums and Historical Places found for this email.',
            });
        }
        
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Museums and Historical Places', error: error.message });
    }
};

const createHistoricalTag = async(req,res) => {

    try {
       const {Name, Historical_Period, Type} = req.body;
   
       // Create a new user instance with the data
       const newTag = new historical_places_tags({ Name, Historical_Period, Type});
   
       // Save the user to the database
       await newTag.save();
   
       // Return success response
       res.status(201).json({ message: 'Tag created successfully', tag: newTag });
     } catch (error) {
       // Handle errors
       res.status(500).json({ message: 'Error creating tag', error: error.message });
     }
};

const signIn = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "Email and Password are required." });
    }

    try {
        // Check in tourists table
        let user = await Tourist.findOne({ Email, Password });
        if (user) {
            return res.status(200).json({ Type: user.Type });
        }

        // Check in admins table
        user = await Admin.findOne({ Email, Password });
        if (user) {
            return res.status(200).json({ Type: user.Type });
        }

        // Check in sellers table
        user = await Seller.findOne({ Email, Password });
        if (user) {
            return res.status(200).json({ Type: user.Type });
        }

        // Check in tourism governors table
        user = await tourism_governers.findOne({ Email, Password });
        if (user) {
            return res.status(200).json({ Type: user.Type });
        }

        // Check in tour guides table
        user = await tour_guidem.findOne({ Email, Password });
        if (user) {
            return res.status(200).json({ Type: user.Type });
        }

        // If no user found
        return res.status(401).json({ message: "Invalid email or password." });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



// ----------------- Activity Category CRUD -------------------

module.exports = { 
    createUserAdmin, 
    deleteUserAdmin,
    getAllProducts ,
    searchProductByName,
    filterProductByPrice,
    sortActivities,
    sortItineraries,
    filterPlacesAndMuseums,
    filterItineraries,
    viewAllRequests,
    processRequestByEmail,
    registerTourist,
    registerRequest,
    createActivityCategory,
    readActivityCategories,
    updateActivityCategory,
    deleteActivityCategory,
    createPreferenceTag,
    readPreferenceTag,
    updatePreferenceTag,
    deletePreferenceTag,
    searchByNameCategoryTag,
    getProductsSortedByRating, 
    addProduct,
    updateProduct,
    getTouristProfile ,
    updateTouristProfile,
    createSellerProfile ,
    getSellerProfile,
    updateSellerProfile,
    createTourGuideProfile,
    updateTourGuideProfile ,
    getTourGuideProfile,
    createItinerary,
    createUserAdvertiser,
    readAdvertiser, 
    updateUserAdvertiser,
    createActivityByAdvertiser,
    readActivity,
    updateActivityByAdvertiser,
    deleteActivityByAdvertiser,
    createUserTourism_Governer,
    deleteUserTourism_Governer,
    getItineraryByName,
    createMuseum,
    readMuseum,
    createHistoricalPlace,
    readHistoricalPlace,
    updateMuseum,
    updateHistoricalPlace,
    deleteMuseum,
    deleteHistoricalPlace,
    deleteItinerary,
    updateItinerary,
    getAllUpcomingEventsAndPlaces,
    creatTouristItenrary,
    filterActivities,
    deleteTouristItenrary,
    updateTouristItenrary,
    getBookedItineraries,
    viewMyCreatedActivities,
    createHistoricalTag,
    viewMyCreatedItenrary,
    viewMyCreatedMuseumsAndHistoricalPlaces,
    signIn
};
