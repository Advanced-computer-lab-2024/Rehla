const Admin = require('../Models/Admin');
const Product = require('../Models/Product');
const activity = require('../Models/activities');
const itinerarym = require('../Models/itineraries') ;
const Tourist = require('../Models/tourists');
const sellerm = require('../Models/sellers');
const Guest = require('../Models/Requests');
const tour_guidem=require('../Models/tour_guides');
const AdvertisersModel = require('../Models/Advertisers.js');
const Request= require('../Models/Requests.js');
const tourism_governers = require('../Models/tourism_governers.js');
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
const DeleteRequestsm = require('../Models/delete_requests.js');
const Preference = require('../Models/Preferences.js');
const touristIteneraries = require('../Models/tourist_iteneraries');
const tourist_products = require('../Models/tourist_products.js');
const tourist_complaints = require('../Models/tourist_complaints.js');
const tourist_activities = require('../Models/tourist_activities.js');
const TouristGuideReview = require('../Models/tour_guide_reviews.js');
const tourist_transportationsm = require('../Models/tourist_tranportations.js');
const transportationm = require('../Models/transportation.js');
const tourguidefiles = require('../Models/filesTourguide.js');
const sellerfiles = require('../Models/filesseller.js');
const advertiserfiles = require('../Models/filesadvertiser.js');
const cartm = require('../Models/Cart.js');
const promocodem = require('../Models/promocodes.js');
const tourist_addreessiesm = require('../Models/Tourist_addreessies.js');
const wishlist = require ('../Models/wishlist.js');
const order = require('../Models/Order.js');
const saved_eventm =require ('../Models/Saved_Events.js');
const advertiser_salesreport = require ('../Models/advertiser_salesreport.js');
const tourguide_salesreport = require ('../Models/tourguide_salesreport.js');
const seller_salesreport = require ('../Models/seller_salesreport.js');


// Define all models where the user could exist
const models = [Admin, tourism_governers, Tourist, tour_guidem, AdvertisersModel, Seller]; // Add all the models here
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const express = require('express');
const Amadeus = require('amadeus');
const app = express();
app.use(express.json());

const amadeus = new Amadeus({
  clientId: "qLctFI8fqU7154VBw7z1IUCGWBPa1dCL",
  clientSecret: "9j75tRpG4ts0dw6f"
});

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: 'rehlanotification@gmail.com', // Your email address
        pass: 'qpivaqxvfdwiparb'   // Your email password
    }
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'rehlanotification@gmail.com', // Sender address
        to: to,                       // List of receivers
        subject: subject,             // Subject line
        text: text                    // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Function to send a payment receipt email
const sendPaymentReceipt = async (to, amount, eventName) => {
    const mailOptions = {
        from: 'rehlanotification@gmail.com', // Sender address
        to: to,                       // List of receivers
        subject: `Payment Receipt for ${eventName}`,   // Subject line
        text: `Thank you for your payment of ${amount} for ${eventName}. Your transaction was successful.` // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Payment receipt email sent successfully');
    } catch (error) {
        console.error('Error sending payment receipt email:', error);
        throw error; // Rethrow the error to handle it in the route
    }
};

const sendyoureventitineraryisflagged = async (to, eventName) => {
    const mailOptions = {
        from: 'rehlanotification@gmail.com', // Sender address
        to: to,                       // List of receivers  
        subject: `Your ${eventName} is inapproriate now`,   // Subject line
        text: `Your ${eventName} is inapproriate now. Please review and make necessary changes.` // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Flagged event email sent successfully');
    } catch (error) {
        console.error('Error sending flagged event email:', error);
        throw error; // Rethrow the error to handle it in the route
    }
};

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

        await Promise.all(models.map(async (Model) => {
            const user = await Model.findOne({ Email: Email });
            if(user){
                return res.status(400).json({ error: 'Email is already in use.' });
            }
        }));

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
        
        // Initialize an empty variable to store the deleted user
        let deletedUser = null;
  
        // Use Promise.all to search all collections in parallel
        await Promise.all(models.map(async (Model) => {
            const user = await Model.findOneAndDelete({ Email: email });
            if (user) deletedUser = user;  // If a user is found, store the deleted user
        }));
        

       //check the type of the user
       if (deletedUser.Type === 'TOURIST') {
        // Delete all tourist itineraries by calling deleteTouristItenrary
        await deleteTouristItinerary(email);
        // Delete all tourist itineraries by calling deleteTouristActivity 
        await deleteTouristActivity(email);
        }
    
        //check the type of the user 
        if (deletedUser.Type === 'TOUR_GUIDE') {
            // Delete all tour guide itineraries by calling deleteTourGuideItinerary 
            await deleteItinerary(email);
        }

        //check the type of the user
        if (deletedUser.Type === 'ADVERTISER') {
            // Delete all advertiser activities by calling deleteActivityByAdvertiser
            await deleteActivityByAdvertiser(email);
        }



            // Check the type of the user
        if (deletedUser.Type === 'SELLER') {
            const shopName = deletedUser.Shop_Name;

            // Find and delete products associated with the seller's shop name
            const productsToDelete = await Product.find({ Seller_Name: shopName });
            if (productsToDelete.length > 0) {
                await Product.deleteMany({ Seller_Name: shopName });
                console.log('Deleted products:', productsToDelete);
            }
        }    
            
  
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

const updateAdmin= async (req, res) => {
    try {
        // Extract the email and fields to update from the request body
        const { Email, Password} = req.body;
  
        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }
  
        // Find tourist by email
        const admin = await Admin.findOne({ Email: Email });
  
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
  
        // Only update the fields that are allowed to be modified
        if (Password) admin.Password = Password;
  
        // Save the updated profile
        const updatedAdmin = await admin.save();
  
        // Return the updated profile
        res.status(200).json({
            message: 'Admin profile updated successfully',
            admin: updatedAdmin
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error updating Admin profile', error: error.message });
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
            //const tagDetails = await historical_places_tagsm.find({ Type: value });

            // Step 2: Extract the names from the matching tags
            //const matchingNames = tagDetails.map(detail => detail.Name);
            

            // Step 3: Find historical places that have matching names
            results = await historical_placesm.find({ Type: value });
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

const processRequestByEmail = async (req, res) => {
    const { email } = req.params; // Get the email from request parameters

    try {
        // Step 1: Find the request by email
        const requests = await Request.findOne({ Email: email });
        
        if (!requests) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        let existingRecord;
        if (requests.Type === 'TOUR_GUIDE' || requests.Type ==='Tour Guide') {
            existingRecord = await tour_guidem.findOne({ Email: email });
        } else if (requests.Type === 'SELLER' || requests.Type ==='Seller') {
            existingRecord = await Seller.findOne({ Email: email });
        } else if (requests.Type === 'ADVERTISER' || requests.Type ==='Advertiser') {
            existingRecord = await AdvertisersModel.findOne({ Email: email });
        } else {
            return res.status(400).json({ message: 'Invalid request type.' });
        }

        // If the email already exists, return a message
        if (existingRecord) {
            await Request.deleteOne({ Email: email });
            return res.status(400).json({ message: 'Email already exists in the corresponding collection.' });
        }

        // Step 2: Check the type of request and add to the corresponding table
        let newRecord;
        if (requests.Type === 'TOUR_GUIDE' || requests.Type ==='Tour Guide') {
            newRecord = new tour_guidem({
                Username: requests.Username,
                Email: requests.Email,
                Password: requests.Password,
                Type: requests.Type,
                //Mobile_Number: requests.Mobile_Number,
                //Experience: requests.Experience,
                //Previous_work: requests.Previous_work,
            });
        } else if (requests.Type === 'SELLER' || requests.Type ==='Seller') {
            newRecord = new Seller({
                Username: requests.Username,
                Email: requests.Email,
                Password: requests.Password,
                //Shop_Name: requests.Shop_Name,
                //Description: requests.Description,
                //Shop_Location: requests.Shop_Location,
                Type: requests.Type,
            });
        } else if (requests.Type === 'ADVERTISER' || requests.Type ==='Advertiser') {
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
        await Request.deleteOne({ Email: email });

        // Step 4: Respond with the created record
        res.status(201).json(newRecord);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const registerTourist = async (req, res) => {
    try {
        const { Username, Email, Password, Mobile_Number, Nationality, DOB, Job_Student, Profile_Pic } = req.body;

        // Ensure all required fields are provided
        if (!Username || !Email || !Password || !Mobile_Number || !Nationality || !DOB || !Job_Student) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if email already exists
        await Promise.all(models.map(async (Model) => {
            const user = await Model.findOne({ Email: Email });
            if(user){
                return res.status(400).json({ error: 'Email is already in use.' });
            }
        }));

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
            Wallet: 0, // Initial wallet balance
            Points: 0,
            Badge: 'Level 1',
            Profile_Pic
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

const redeemPoints = async (req, res) => {
    try {
        const { Email, pointsToRedeem } = req.body;

        if (!Email || pointsToRedeem === undefined) {
            return res.status(400).json({ error: 'Email and points to redeem are required.' });
        }

        // Find the tourist by email
        const tourist = await Tourist.findOne({ Email });

        if (!tourist) {
            return res.status(400).json({ error: 'Email not found.' });
        }

        // Check if the pointsToRedeem is greater than the available points
        if (pointsToRedeem > tourist.Points) {
            return res.status(400).json({ error: 'Not enough points to redeem.' });
        }

        // Calculate the equivalent wallet amount
        const walletAmount = pointsToRedeem / 100; // Assuming 1 point = 1/100th of a wallet unit

        // Update the tourist's points and wallet
        await tourist.updateOne({ $inc: { Points: -pointsToRedeem, Wallet: walletAmount } });

        return res.status(201).json({ message: 'Points redeemed successfully' });
    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ error: 'Error redeeming points', details: error.message });
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

        // Check if email already exists in all collections
        await Promise.all(models.map(async (Model) => {
            const user = await Model.findOne({ Email: Email });
            if(user){
                return res.status(400).json({ error: 'Email is already in use.' });
            }
        }));

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
            return res.status(400).json({ error: 'Tag name is required.' });
        }
  
        const updatedTag = await p_tagsm.findOneAndUpdate(
            { Name: currentName }, 
            { Name: newName },     
            { new: true }                   
        );
        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        // Return the updated tag
        res.status(200).json({ message: 'Tag updated successfully', data: updatedTag });
        
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

const createPreference = async (req, res) => {
    const { email, historicAreas, beaches, familyFriendly, shopping, budgetFriendly } = req.body;
  
    try {
        // check if the user has already set preferences
        const existingPreference = await Preference.findOne({ email });
        if (existingPreference) {
            // If preferences already exist, update them here
            const updatedPreference = await Preference.findOneAndUpdate({ email }, { historicAreas, beaches, familyFriendly, shopping, budgetFriendly }, { new: true });
            return res.status(200).json(updatedPreference);
        }

        const newPreference = new Preference({
        email,
        historicAreas,
        beaches,
        familyFriendly,
        shopping,
        budgetFriendly // Include budgetFriendly in the new preference
        });
      
      await newPreference.save();
      return res.status(201).json(newPreference);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating preference', error });
    }
};

// Update a preference
const updatePreference = async (req, res) => {
    const { email } = req.params; // Get email from route parameters
    const updates = req.body; // Get the updates from the request body
  
    try {
      const updatedPreference = await Preference.findOneAndUpdate(
        { email },
        updates,
        { new: true }
      );
  
      if (!updatedPreference) {
        return res.status(404).json({ message: 'Preference not found' });
      }
  
      return res.status(200).json(updatedPreference);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating preference', error });
    }
};

// Get preferences by email
const readPreferences = async (req, res) => {
    const { email } = req.params;
  
    try {
      const preferences = await Preference.find({ email });
      return res.status(200).json(preferences);
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving preferences', error });
    }
};

// Function to view all complaints
const viewAllComplaints = async (req, res) => {
    try {
      const complaints = await tourist_complaints.find();
      if (complaints.length === 0) {
        return res.status(404).json({ message: 'No complaints found' });
      }
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

// Function to view a specific complaint by Tourist_Email
const viewComplaintByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      const complaint = await tourist_complaints.find({ Tourist_Email: email });
      
      if (!complaint || complaint.length === 0) {
        return res.status(404).json({ message: 'No complaints found for this email' });
      }
      
      res.status(200).json(complaint);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

// Function to view all complaints sorted by date
const viewAllComplaintsSortedByDate = async (req, res) => {
    try {
      // Find all complaints and sort them by date (most recent first)
      const complaints = await tourist_complaints.find()
        .sort({ Date_Of_Complaint: -1 }); // -1 for descending (most recent first), 1 for ascending
  
      if (!complaints || complaints.length === 0) {
        return res.status(404).json({ message: 'No complaints found' });
      }
  
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

// Function to filter complaints by status
const filterComplaintsByStatus = async (req, res) => {
    const { status } = req.params;
  
    try {
      // Find complaints based on the provided status
      const complaints = await tourist_complaints.find({ Status: status });
  
      if (!complaints || complaints.length === 0) {
        return res.status(404).json({ message: `No complaints found with status: ${status}` });
      }
  
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

  const flagActivity = async (req, res) => {
    try {
        const { name } = req.params; 

        const flaggedActivity = await activity.findOneAndUpdate(
            {Name:name}, 
            { Flagged: true }, 
            { new: true }     
        );
        if (!flaggedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
     
        res.status(200).json({ message: 'Activity flagged as inappropriate successfully', data: flaggedActivity });
    } catch (error) {
        console.error('Error flagging activity:', error.message);
        res.status(500).json({ error: 'Error flagging activity', details: error.message });
    }
};

const flagItinerary = async (req, res) => {
    try {
        const { name } = req.params; 

        const flaggedItinerary = await itinerarym.findOneAndUpdate(
            {Itinerary_Name:name}, 
            { Flagged: true },  
            { new: true }        
        );


        if (!flaggedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        //get the createdby of this itinrary and use sendyoureventitineraryisflagged to send him a message
        const createdby = flaggedItinerary.Created_By;
        await sendyoureventitineraryisflagged(createdby, name);     

        res.status(200).json({ message: 'Itinerary flagged as inappropriate successfully', data: flaggedItinerary });
    } catch (error) {
        console.error('Error flagging itinerary:', error.message);
        res.status(500).json({ error: 'Error flagging itinerary', details: error.message });
    }
};

const replyToComplaint = async (req, res) => {
    try {
        const { email } = req.params; 
        const { reply } = req.body; 

        if (!reply) {
            return res.status(400).json({ error: 'Reply is required.' });
        }

        const complaint = await tourist_complaints.findOne({ Tourist_Email: email, Status: 'pending' });

        if (!complaint) {
            return res.status(404).json({ message: 'No pending complaint found for this email.' });
        }

        complaint.Reply = reply;
        await complaint.save();

        res.status(200).json({ message: 'Complaint resolved successfully', data: complaint });
    } catch (error) {
        console.error('Error replying to complaint:', error.message);
        res.status(500).json({ error: 'Error replying to complaint', details: error.message });
    }
};

const ComplaintStatus = async (req, res) => {
    try {
        const { email,title } = req.params; 

        const complaint = await tourist_complaints.findOne({ Tourist_Email: email, Title:title });

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found for this email.' });
        }
        if (complaint.Status !== 'pending') {
            return res.status(400).json({ message: 'Complaint is already resolved or cannot be updated.' });
        }

        complaint.Status = 'resolved';
        await complaint.save();
        res.status(200).json({ message: 'Complaint status updated to resolved.', data: complaint });
    } catch (error) {
        console.error('Error updating complaint status:', error.message);
        res.status(500).json({ error: 'Error updating complaint status', details: error.message });
    }
};

const ProductArchiveStatus = async (req, res) => {
    try {
        const { productName } = req.params; 

        const product = await Product.findOne({ Product_Name: productName });

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        product.Archived = !product.Archived;
        await product.save();

        res.status(200).json({ 
            message: `Product ${product.Archived ? 'archived' : 'unarchived'} successfully.`, 
            data: product 
        });
    } catch (error) {
        console.error('Error toggling product archive status:', error.message);
        res.status(500).json({ error: 'Error toggling product archive status', details: error.message });
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
        const { Product_Name, Picture, Price, Quantity, Seller_Name, Description} = req.body;
  
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
      const { Email, Password, Mobile_Number, Nationality, Job_Student, Type, Wallet, Profile_Pic } = req.body;

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
      if (Wallet) tourist.Wallet = Wallet;
      if (Profile_Pic) tourist.Profile_Pic = Profile_Pic;


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
            Type,
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
        const { Username, Email, Password, Mobile_Number, Experience, Previous_work } = req.body;

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
        res.status(200).json(tour_guide);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving tour guide profile', error: error.message });
    }
};

const requestDeleteProfile = async(req, res) => {
    try{

        const { Username, Email, Password, Type } = req.body;

        // Ensure all required fields are provided
        if (!Username || !Email || !Password || !Type) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Allowed types for registration requests
        const allowedTypes = ['TOURIST', 'Tour Guide', 'Advertiser', 'Seller'];

        // Check if the Type is valid
        if (!allowedTypes.includes(Type)) {
            return res.status(400).json({ error: 'Invalid registration type. Must be Tourist, Tour Guide, Advertiser, or Seller.' });
        }

        // Check if email already exists
        const existingRequest = await DeleteRequestsm.findOne({ Email });
        if (existingRequest) {
            return res.status(400).json({ error: 'Request already submitted.' });
        }

        // Create a new request object
        const newRequest = new DeleteRequestsm({
            Username,
            Email,
            Password,  // No password hashing here
            Type
        });

        // Save the request to the database
        await newRequest.save();

        // Return the created request
        return res.status(201).json({ message: "Request successfully submitted", request: newRequest });

    }catch{
        console.error('Error details:', error);
        return res.status(500).json({ error: 'Error submitting request', details: error.message });
    }
};

//Create an itinerary 
const createItinerary = async (req, res) => {
    try {
        // Destructure the itinerary data from the request body
        const { 
            Itinerary_Name, 
            Timeline, 
            Duration, 
            Language, 
            Tour_Price, 
            Available_Date_Time, 
            Accessibility, 
            Pick_Up_Point, 
            Drop_Of_Point, 
            Empty_Spots, 
            Country, 
            P_Tag,
            Created_By,
            Picture
        } = req.body;

        // Validate required fields
        if (!Itinerary_Name || !Timeline || !Duration || !Language || 
            !Tour_Price || !Available_Date_Time || !Accessibility || 
            !Pick_Up_Point || !Drop_Of_Point ||
            !Empty_Spots || !Country || !P_Tag  || !Created_By || !Picture) {
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
            Empty_Spots,
            Country,
            P_Tag,
            Created_By,
            Picture
        });

        // Save the itinerary to the database
        const savedItinerary = await newItinerary.save();

        // const newTourGuideItinerary = new tour_guide_itinerariesm({
        //     Email,
        //     Itinerary_Name
        // });

        // // Save the tour guide itinerary mapping to the database
        // const savedTourGuideItinerary = await newTourGuideItinerary.save();

        // Return success response
        res.status(201).json({
            message: 'Itinerary created successfully',
            itinerary: savedItinerary,
            //tourGuideItinerary: savedTourGuideItinerary
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
        // Extract Itinerary_Name and the fields to update from the request body
        const { 
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
            P_Tag,
            Created_By 
        } = req.body;

        // Ensure the itinerary name is provided
        if (!Itinerary_Name) {
            return res.status(400).json({ message: 'Itinerary name is required' });
        }

        // Find the itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name });

        // If itinerary is not found
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Define the fields to update, checking for any provided in the request body
        const fieldsToUpdate = {
            Timeline: Timeline || itinerary.Timeline,
            Duration: Duration || itinerary.Duration,
            Language: Language || itinerary.Language,
            Tour_Price: Tour_Price || itinerary.Tour_Price,
            Available_Date_Time: Available_Date_Time || itinerary.Available_Date_Time,
            Accessibility: Accessibility || itinerary.Accessibility,
            Pick_Up_Point: Pick_Up_Point || itinerary.Pick_Up_Point,
            Drop_Of_Point: Drop_Of_Point || itinerary.Drop_Of_Point,
            Booked: Booked != null ? Booked : itinerary.Booked, // Allow false to be updated
            Empty_Spots: Empty_Spots || itinerary.Empty_Spots,
            Country: Country || itinerary.Country,
            Rating: Rating || itinerary.Rating,
            P_Tag: P_Tag || itinerary.P_Tag,
            Created_By: Created_By || itinerary.Created_By
        };

        // Update only the provided fields in the itinerary
        Object.keys(fieldsToUpdate).forEach(field => {
            if (fieldsToUpdate[field] !== itinerary[field]) {
                itinerary[field] = fieldsToUpdate[field];
            }
        });

        // Save the updated itinerary
        const updatedItinerary = await itinerary.save();

        // Return the updated itinerary
        return res.status(200).json({
            message: 'Itinerary updated successfully',
            itinerary: updatedItinerary,
        });
    } catch (error) {
        // Handle errors
        console.error('Error updating itinerary:', error);
        return res.status(500).json({ message: 'Error updating itinerary', error: error.message });
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
const readAdvertiser = async (req, res) => {
    try {
        // Extract the email from the request body
        const { Email } = req.body; // Destructure Email from req.body
  
        // Check if Email is provided
        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }
  
        // Find the tourist by email
        const advertiser = await AdvertisersModel.findOne({ Email });
        
        // Check if the tourist was found
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
  
        // Return the tourist profile
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving advertiser profile', error: error.message });
    }
  };

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
            Name, Location, Time, Duration, Price, Date, Discount_Percent, Available_Spots, 
            Category, Tag ,Created_By
        } = req.body;

        // Check if all required fields are provided
        if (!Name || !Location || !Time || !Duration || !Price || !Date || 
            !Discount_Percent || !Available_Spots || !Category || !Tag || !Created_By) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a new activity
        const newActivity = new activity({
            Name, Location, Time, Duration, Price, Date, 
            Discount_Percent, Available_Spots , Created_By
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
        const { name } = req.params; // Assuming email is passed as a URL parameter
        const activityDetails = await activity.findOne({ Name: name });

        if (!activityDetails) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'Activity fetched successfully', data: activityDetails });
    }
    catch(error){
        console.error("Error fetching Activity:", error.message);
        res.status(500).json({ error: 'Error fetching Activity:', details: error.message });
    }
}

//Advertiser Updates Activity
const updateActivityByAdvertiser = async (req, res) => {
    try {
        const { 
            Name, // Required to identify the activity
            Location, 
            Time, 
            Duration, 
            Price, 
            Date, 
            Tag, 
            Category, 
            Discount_Percent,
            Available_Spots,
            Created_By,
            Picture 
        } = req.body;

        // Check if Name is provided (because it is necessary to identify the activity)
        if (!Name) {
            return res.status(400).json({ message: 'Activity name is required for updating.' });
        }

        // Create an update object only with fields that are provided (not undefined)
        const updateData = {};
        if (Location) updateData.Location = Location;
        if (Time) updateData.Time = Time;
        if (Duration) updateData.Duration = Duration;
        if (Price) updateData.Price = Price;
        if (Date) updateData.Date = Date;
        if (Discount_Percent) updateData.Discount_Percent = Discount_Percent;
        if (Available_Spots) updateData.Available_Spots = Available_Spots;
        if (Created_By) updateData.Created_By = Created_By;
        if (Picture) updateData.Picture = Picture;

        // Find and update the activity by Name
        const updatedActivity = await activity.findOneAndUpdate(
            { Name }, // Find activity by Name
            updateData,  // Update only the fields that are provided
            { new: true, runValidators: true }  // Options: return the updated document and run schema validators
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Update the associated category if provided
        if (Category) {
            await activity_categoriesm.findOneAndUpdate(
                { Activity: Name }, 
                { Category }
            );
        }

        // Update the associated tag if provided
        if (Tag) {
            await activity_tagsm.findOneAndUpdate(
                { Activity: Name }, 
                { Tag }
            );
        }

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

const updateTourism_Governer= async (req, res) => {
    try {
        // Extract the email and fields to update from the request body
        const { Email, Password} = req.body;
  
        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }
  
        // Find tourist by email
        const tgoverner = await tourism_governers.findOne({ Email: Email });
  
        if (!tgoverner) {
            return res.status(404).json({ message: 'Tourism Governer not found' });
        }
  
        // Only update the fields that are allowed to be modified
        if (Password) tgoverner.Password = Password;
  
        // Save the updated profile
        const updatedtgoverner = await tgoverner.save();
  
        // Return the updated profile
        res.status(200).json({
            message: 'Tourism Governer profile updated successfully',
            tgoverner: updatedtgoverner
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error updating Tourism Governer profile', error: error.message });
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
        const { Name, description, pictures, location, Country,
            Opening_Hours, S_Tickets_Prices, F_Tickets_Prices, N_Tickets_Prices, Tag, Created_By } = req.body;
        
        // Check if all fields are provided
        if (!Name || !description || !pictures || !location || !Country
            || !Opening_Hours || !S_Tickets_Prices || !F_Tickets_Prices || !N_Tickets_Prices || !Tag || !Created_By) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if a museum with the same name already exists
        const existingMuseum = await museumsm.findOne({ Name });
        if (existingMuseum) {
            return res.status(400).json({ error: 'Museum with this name already exists.' });
        }

        // Create a new museum if it doesn't exist
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
            Tag,
            Created_By
        });

        const savedMuseum = await newMuseum.save();
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
        const {  
            Name, 
            Description, 
            Pictures, 
            Location, 
            Country, 
            Opens_At, 
            Closes_At, 
            S_Ticket_Prices, 
            F_Ticket_Prices, 
            N_Ticket_Prices,
            Created_By 
        } = req.body;
        
        // Validate input
        if (!Name || !Description || !Pictures || !Location || !Country
            || !Opens_At || !Closes_At || !S_Ticket_Prices || !F_Ticket_Prices || !N_Ticket_Prices || !Created_By) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the historical place with the same name already exists
        console.log("Checking for existing place with name:", Name);
        const existingPlace = await historical_placesm.findOne({ Name });
        console.log("Existing place found:", existingPlace);

        if (existingPlace) {
            return res.status(400).json({ error: 'A historical place with this name already exists.' });
        }

        // Create the new historical place
        const newHistoricalPlace = new historical_placesm({
            Name,
            Description,
            Pictures, 
            Location,
            Country,
            Opens_At,
            Closes_At,
            S_Ticket_Prices,
            F_Ticket_Prices,
            N_Ticket_Prices,
            Created_By
        });
        
        const savedHistorical = await newHistoricalPlace.save();
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
    try {
        const { Name, ...fieldsToUpdate } = req.body;

        // Check if the Name field is provided, as it's required
        if (!Name) {
            return res.status(400).json({ message: 'Museum name is required' });
        }

        // Filter out empty or undefined fields from fieldsToUpdate
        const updateFields = Object.keys(fieldsToUpdate).reduce((acc, key) => {
            if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== '') {
                acc[key] = fieldsToUpdate[key];
            }
            return acc;
        }, {});

        // Ensure Name is included in the update, as it is required
        updateFields.Name = Name;

        const updatedMuseum = await museumsm.findOneAndUpdate(
            { Name: Name },
            updateFields,  // Only update fields provided in the request
            { new: true, runValidators: true }  // Options: return the updated document and run schema validators
        );

        if (!updatedMuseum) {
            return res.status(404).json({ message: 'Museum not found' });
        }

        res.status(200).json({ message: 'Museum updated successfully', museum: updatedMuseum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateHistoricalPlace = async (req, res) => {
    try {
        const { Name, ...fieldsToUpdate } = req.body;

        // Check if the Name field is provided, as it's required
        if (!Name) {
            return res.status(400).json({ message: 'Historical Place name is required' });
        }

        // Filter out fields that are empty or undefined in the request body
        const updateFields = Object.keys(fieldsToUpdate).reduce((acc, key) => {
            if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== '') {
                acc[key] = fieldsToUpdate[key];
            }
            return acc;
        }, {});

        // Ensure Name is included in the update, as it is required
        updateFields.Name = Name;

        const updatedHistoricalPlace = await historical_placesm.findOneAndUpdate(
            { Name: Name },
            updateFields,  // Only update fields provided in the request
            { new: true, runValidators: true }  // Options: return the updated document and run schema validators
        );

        if (!updatedHistoricalPlace) {
            return res.status(404).json({ message: 'Historical Place not found' });
        }

        res.status(200).json({ message: 'Historical Place updated successfully', historicalPlace: updatedHistoricalPlace });
    } catch (error) {
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
const getPaidActivities = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Tourist email is required" });
        }

        const today = new Date();

        const upcomingActivities = await tourist_activities.find({
            Tourist_Email: email,
            Paid: true,
            Date: { $gte: today } // Date is today or in the future
        }, 'Activity_Name Date');

        if (!upcomingActivities.length) {
            return res.status(404).json({ message: "No upcoming paid activities found." });
        }

        res.status(200).json({ activities: upcomingActivities });
    } catch (error) {
        console.error("Error fetching upcoming paid activities:", error);
        res.status(500).json({ message: "An error occurred while fetching upcoming paid activities.", error });
    }

};

const getPastPaidActivities = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Tourist email is required" });
        }

        const today = new Date();

        const pastActivities = await tourist_activities.find({
            Tourist_Email: email,
            Paid: true,
            Date: { $lt: today } // Date is in the past
        }, 'Activity_Name Date');

        if (!pastActivities.length) {
            return res.status(404).json({ message: "No past paid activities found." });
        }

        res.status(200).json({ activities: pastActivities });
    } catch (error) {
        console.error("Error fetching past paid activities:", error);
        res.status(500).json({ message: "An error occurred while fetching past paid activities.", error });
    }

};
const getPaidItineraries = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Tourist email is required" });
        }

        const today = new Date();

        const upcomingitineraries = await touristIteneraries.find({
            Tourist_Email: email,
            Paid: true,
            Date: { $gte: today } // Date is today or in the future
        }, 'Itinerary_Name Date');

        if (!upcomingitineraries.length) {
            return res.status(404).json({ message: "No upcoming paid itineraries found." });
        }

        res.status(200).json({ itineraries: upcomingitineraries });
    } catch (error) {
        console.error("Error fetching upcoming paid itineraries:", error);
        res.status(500).json({ message: "An error occurred while fetching upcoming paid itineraries.", error });
    }

};

const getPastPaidItineraries = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Tourist email is required" });
        }

        const today = new Date();

        const pastitineraries = await touristIteneraries.find({
            Tourist_Email: email,
            Paid: true,
            Date: { $lt: today } // Date is in the past
        }, 'Itinerary_Name Date');

        if (!pastitineraries.length) {
            return res.status(404).json({ message: "No past paid itineraries found." });
        }

        res.status(200).json({ itineraries: pastitineraries });
    } catch (error) {
        console.error("Error fetching past paid itineraries:", error);
        res.status(500).json({ message: "An error occurred while fetching past paid itineraries.", error });
    }

};

const getTouristAddresses = async (req, res) => {
    try {
        const { email } = req.params; 

        if (!email) {
            return res.status(400).json({ message: "Tourist email is required" });
        }

        const addresses = await tourist_addreessiesm.find({ Email: email }, 'Address');

        if (!addresses.length) {
            return res.status(404).json({ message: "No addresses found for this tourist." });
        }

        res.status(200).json({ addresses });
    } catch (error) {
        console.error("Error fetching tourist addresses:", error);
        res.status(500).json({ message: "An error occurred while fetching addresses.", error });
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

       //make sure that the historical place exists
         const existingHistoricalPlace = await historical_placesm.findOne({Name});
            if (!existingHistoricalPlace) {
                return res.status(404).json({ message: 'Historical Place not found' });
            }
        // make sure that the tag does not exist
        const existingTag = await historical_places_tags.findOne({Name});
        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists' });
        }
   
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
            if (!user.TermsAccepted) {
                return res.status(403).json({ message: "You must accept the terms before signing in." });
            }
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
            if (!user.TermsAccepted) {
                return res.status(403).json({ message: "You must accept the terms before signing in." });
            }
            return res.status(200).json({ Type: user.Type });
        }

        // Check in advertisers table
        user = await AdvertisersModel.findOne({ Email, Password });
        if (user) {
            if (!user.TermsAccepted) {
                return res.status(403).json({ message: "You must accept the terms before signing in." });
            }
            return res.status(200).json({ Type: user.Type });
        }

        // If no user found
        return res.status(401).json({ message: "Invalid email or password." });
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const getAllCreatedByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Fetch data from all collections in parallel
        const [activities, historicalPlaces, museums, itineraries] = await Promise.all([
            activity.find({ Created_By: email }),           // Ensure this matches your schema
            historical_placesm.find({ Created_By: email }),    // Matches historical_places schema
            museumsm.find({ Created_By: email }),             // Matches museums schema
            itinerarym.find({ Created_By: email })           // Matches itineraries schema
        ]);

        

        // Combine all results into a single object
        const results = {
            activities,
            historicalPlaces,
            museums,
            itineraries
        };

        return res.status(200).json({ message: 'Data retrieved successfully', data: results });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving data', details: error.message });
    }
};

const rateTourGuide = async (req, res) => {
    try {
        const { Tourist_Email, TourGuide_Email, Rating } = req.body;

        // Check if rating is provided and is between 1 and 5
        if (!Rating || Rating < 1 || Rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        // Ensure the tourist and tour guide emails are provided
        if (!Tourist_Email || !TourGuide_Email) {
            return res.status(400).json({ message: "Tourist email and tour guide email are required." });
        }

        //check if the tourist has already rated the tour guide and if yes update it 
        const existingReview = await TouristGuideReview.findOne({ Tourist_Email, TourGuide_Email });
        if (existingReview) {
            // Update the existing review
            existingReview.Rating = Rating;
            await existingReview.save();
            return res.status(200).json({ message: "Rating updated successfully." });
        }

        // Create a new review using the provided data
        const newReview = new TouristGuideReview({
            Tourist_Email,
            TourGuide_Email,
            Rating
        });

        // Save the review to the database
        await newReview.save();

        // Respond with success
        res.status(201).json({ message: "Review submitted successfully." });
    } catch (err) {
        // Handle errors and respond with error message
        res.status(500).json({ message: "Error submitting review", error: err.message });
    }
};

const commentTourGuide = async (req, res) => {
    try {
        const { Tourist_Email, TourGuide_Email, Comment } = req.body;

        // Check if rating is provided and is between 1 and 5
        if (!Comment) {
            return res.status(400).json({ message: "You must enter a comment" });
        }

        // Ensure the tourist and tour guide emails are provided
        if (!Tourist_Email || !TourGuide_Email) {
            return res.status(400).json({ message: "Tourist email and tour guide email are required." });
        }

        //check if the tourist has already rated the tour guide and if yes update it
        const existingReview = await TouristGuideReview.findOne({ Tourist_Email, TourGuide_Email });
        if (existingReview) {
            // Update the existing review
            existingReview.Comment = Comment;
            await existingReview.save();
            return res.status(200).json({ message: "Comment updated successfully." });
        }

        // Create a new review using the provided data
        const newReview = new TouristGuideReview({
            Tourist_Email,
            TourGuide_Email,
            Comment
        });

        // Save the review to the database
        await newReview.save();

        // Respond with success
        res.status(201).json({ message: "Review submitted successfully." });
    } catch (err) {
        // Handle errors and respond with error message
        res.status(500).json({ message: "Error submitting review", error: err.message });
    }
};

const rateItinerary = async (req, res) => {
    try {
        const { Tourist_Email, Itinerary_Name, Rating } = req.body;

        if (!Tourist_Email || !Itinerary_Name || !Rating ) {
            return res.status(400).json({ message: 'Tourist_Email, Itinerary_Name, and Rating are required.' });
        }

        // Find and update the rating in the tourist_iteneraries collection
        const updatedItinerary = await touristIteneraries.findOneAndUpdate(
            { Tourist_Email: Tourist_Email, Itinerary_Name: Itinerary_Name }, // Filter
            { Rating : Rating  }, // Update the Rating field
            { new: true } // Return the updated document
        );

        if (!updatedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found.' });
        }

        //call the function to update the rating of the itinerary
            await calculateItineraryRating(Itinerary_Name);

        res.status(200).json({ message: 'Itinerary rating updated successfully', itinerary: updatedItinerary });
    } catch (error) {
        console.error("Error updating itinerary rating:", error);
        res.status(500).json({ error: 'Error updating itinerary rating', details: error.message });
    }
};

const commentOnItinerary = async (req, res) => {
    const { Tourist_Email, Itinerary_Name, Comment } = req.body;

    try {
        // Find the itinerary by Tourist_Email and Itinerary_Name
        const itinerary = await touristIteneraries.findOneAndUpdate(
            { Tourist_Email, Itinerary_Name },
            { Comment },  // Update the comment field
            { new: true, runValidators: true }  // Return the updated document and run schema validators
        );

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        res.status(200).json({ message: 'Comment added successfully', itinerary });
    } catch (error) {
        console.error('Error commenting on itinerary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const rateActivity = async (req, res) => {
    const { Tourist_Email, Activity_Name, Rating } = req.body;

    try {
        // Validate input
        if (!Tourist_Email || !Activity_Name || !Rating  ) {
            return res.status(400).json({ error: 'Tourist_Email, Activity_Name, and Rating are required.' });
        }

        // Find the activity and update the rating
        const updatedActivity = await tourist_activities.findOneAndUpdate(
            { Tourist_Email, Activity_Name },
            { Rating }, // Overwrite existing Rating
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        // Check if the activity was found
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found for the given tourist.' });
        }

        res.status(200).json({ message: 'Activity rating updated successfully', activity: updatedActivity });
    } catch (error) {
        console.error('Error updating activity rating:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to add or update a comment on an attended event/activity
const commentOnEvent = async (req, res) => {
    const { Tourist_Email, Activity_Name, Comment } = req.body;

    try {
        // Validate input
        if (!Tourist_Email || !Activity_Name || !Comment  ) {
            return res.status(400).json({ error: 'Tourist_Email, Activity_Name, and comment are required.' });
        }

        // Find the activity and update the comment
        const updatedActivity = await tourist_activities.findOneAndUpdate(
            { Tourist_Email, Activity_Name },
            { Comment }, // Overwrite existing comment
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        // Check if the activity was found
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found for the given tourist.' });
        }

        res.status(200).json({ message: 'Activity comment updated successfully', activity: updatedActivity });
    } catch (error) {
        console.error('Error updating activity comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const productRateReview = async (req, res) => {
    const { Tourist_Email, Product_Name, Review, Rating } = req.body;

    if (!Tourist_Email || !Product_Name || Review === undefined || Rating === undefined) {
        return res.status(400).json({
            message: "Missing required fields: Tourist_Email, Product_Name, Review, and Rating must be provided."
        });
    }

    try {
        // Find the existing product review based on Tourist_Email and Product_Name
        const existingReview = await tourist_products.findOne({
            Tourist_Email: Tourist_Email,
            Product_Name: Product_Name
        });

        if (!existingReview) {
            return res.status(404).json({
                message: "Review not found. Please ensure the product and email are correct."
            });
        }

        // Update review and rating
        existingReview.Review = Review;
        existingReview.Rating = Rating;

        await existingReview.save();

        return res.status(200).json({
            message: "Review updated successfully",
            review: existingReview
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating review",
            error: error.message || error
        });
    }
};

const getMyComplaints = async (req, res) => {
    const { Tourist_Email } = req.body; // Get the email from request body

    try {
        // Find all complaints for the tourist
        const complaints = await tourist_complaints.find({ Tourist_Email: Tourist_Email });

        if (complaints.length === 0) {
            return res.status(404).json({
                message: "No complaints found for this email."
            });
        }

        return res.status(200).json({
            message: "Complaints retrieved successfully.",
            complaints: complaints
        });
    } catch (error) {
        console.error(error); // Log the error to the console
        return res.status(500).json({
            message: "Error retrieving complaints.",
            error: error.message // Include error message
        });
    }
};

const createComplaint = async (req, res) => {
    try {
        const { Tourist_Email, Title, Body } = req.body;

        // Create a new complaint object
        const newComplaint = new tourist_complaints({
            Tourist_Email,
            Title,
            Body,
            Date_Of_Complaint: new Date(), // Automatically set the date of complaint
        });

        // Save the complaint to the database
        await newComplaint.save();

        // Respond with success message
        res.status(201).json({ message: "Complaint created successfully!", complaint: newComplaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating complaint", error });
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

        //check if the Accessibility is true
        if (itineraryExists.Accessibility === false) {
            return res.status(400).json({ error: 'This itinerary is deactivated.' });
        }

        const newTouristItenrary = new tourist_itinerariesm({Tourist_Email,Itinerary_Name});
        const savedTouristItenrary = await newTouristItenrary.save();

        await itinerarym.findOneAndUpdate(
            { Itinerary_Name },
            { $inc: { Booked: 1, Empty_Spots: -1 } } // Increment Booked and decrement Empty_Spots
        );

        await savedTouristItenrary.save();

        res.status(201).json({ message: 'Tourist itinerary created successfully', Tourist_Itinerary: savedTouristItenrary });
        
    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating tourist itinerary', details: error.message });
    }
};

const payForItinerary = async (req, res) => {
    try {
        const { Tourist_Email, Itinerary_Name } = req.body;

        // Validate input
        if (!Tourist_Email || !Itinerary_Name) {
            return res.status(400).json({ error: 'Tourist email and itinerary name are required.' });
        }

        // Check if the tourist exists
        const tourist = await Tourist.findOne({ Email: Tourist_Email });
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the itinerary exists
        const itinerary = await itinerarym.findOne({ Itinerary_Name });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found.' });
        }

        // Check if the tourist has already booked the itinerary
        const booking = await tourist_itinerariesm.findOne({ Tourist_Email, Itinerary_Name });
        if (!booking) {
            return res.status(404).json({ error: 'Tourist itinerary not found.' });
        }

        // Check if the itinerary has already been paid for
        if (booking.Paid) { 
            return res.status(400).json({ error: 'Itinerary has already been paid for.' });
        }

        // Check if the tourist has enough balance in the wallet
        if (tourist.Wallet < itinerary.Tour_Price) {
            return res.status(400).json({ error: 'Insufficient wallet balance.' });
        }

        // Deduct the itinerary price from the tourist's wallet balance
        tourist.Wallet -= itinerary.Tour_Price;

        // Calculate points based on the level
        let points = 0;
        switch (tourist.Badge) {
            case 'Level 1':
                points = itinerary.Tour_Price * 0.5;
                break;
            case 'Level 2':
                points = itinerary.Tour_Price * 1;
                break;
            case 'Level 3':
                points = itinerary.Tour_Price * 1.5;
                break;
            default:
                points = 0;
        }

        // Add points to the tourist's account
        tourist.Points += points;
        await tourist.save();

        // Update the tourist's badge based on the new points
        if (tourist.Points <= 100000) {
            tourist.Badge = 'Level 1';
        } else if (tourist.Points <= 500000) {
            tourist.Badge = 'Level 2';
        } else {
            tourist.Badge = 'Level 3';
        }

        await tourist.save();

        // Mark the itinerary as paid
        booking.Paid = true;
        await booking.save();

        await sendPaymentReceipt(Tourist_Email, itinerary.Tour_Price, Itinerary_Name); 

        // Send a response
        res.status(200).json({ message: 'Payment successful. Itinerary booked and paid.', booking });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error processing payment', details: error.message });
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

        //48 hours before the itinerary date
        const itineraryDate = new Date(itineraryExists.Available_Date_Time);
        const currentDate = new Date();
        const timeDifference = itineraryDate.getTime() - currentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        if (hoursDifference < 48) {
            return res.status(400).json({ error: 'Cannot cancel booking. Itinerary date is less than 48 hours away.' });
        }

        // Check if the itinerary has already been paid for and if yes, refund the tourist
        if (touristItineraryExists.Paid) {
            // Refund the tourist
            const tourist = await Tourist.findOne({ Email: Tourist_Email });
            tourist.Wallet += itineraryExists.Tour_Price;
            // Calculate points based on the level
            let points = 0;
            switch (tourist.Badge) {
                case 'Level 1':
                    points = itineraryExists.Tour_Price * 0.5;
                    break;
                case 'Level 2':
                    points = itineraryExists.Tour_Price * 1;
                    break;
                case 'Level 3':
                    points = itineraryExists.Tour_Price * 1.5;
                    break;
                default:
                    points = 0;
            }
            // Deduct points from the tourist's account
            tourist.Points -= points;

            // Update the tourist's badge based on the new points
            if (tourist.Points <= 100000) {
                tourist.Badge = 'Level 1';
            } else if (tourist.Points <= 500000) {
                tourist.Badge = 'Level 2';
            } else {
                tourist.Badge = 'Level 3';
            }
            await tourist.save();
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
                if (!itinerary) {
                    return { ...booking.toObject(), Itinerary: null };
                }
                // Find the itinerary details and return the full itinerary object
                const itinerary = await itinerarym.findOne({ Itinerary_Name: booking.Itinerary_Name });
                return { ...booking.toObject(), Itinerary: itinerary };
            })
        );

        // Send response
        res.status(200).json({ message: 'Booked itineraries retrieved successfully', itineraries: itineraryDetails });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error retrieving booked itineraries', details: error.message });
    }
};

//create tourist_activity
const createTouristActivity = async (req, res) => {
    try {
        const { Tourist_Email, Activity_Name } = req.body;

        // Validate input
        if (!Tourist_Email || !Activity_Name) {
            return res.status(400).json({ error: 'Tourist email and activity name are required.' });
        }

        // Check if the tourist exists
        const touristExists = await Tourist.findOne({ Email: Tourist_Email });
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the activity exists
        const activityExists = await activity.findOne({ Name: Activity_Name });
        if (!activityExists) {
            return res.status(409).json({ error: 'Activity not found.' });
        }

        // Check if the tourist activity already exists
        const touristActivityExists = await tourist_activities.findOne({ Tourist_Email, Activity_Name });
        if (touristActivityExists) {
            return res.status(409).json({ error: 'Tourist activity already exists.' });
        }

        // Create a new tourist activity
        const newTouristActivity = new tourist_activities({ Tourist_Email, Activity_Name });
        const savedTouristActivity = await newTouristActivity.save();

        //increment the number of bookings for the activity and decrement the number of available spots
        await activity.findOneAndUpdate(
            { Name: Activity_Name },
            { $inc: { Booked_Spots: 1, Available_Spots: -1 } }
        );

        //update Booking_Available field in the activity collection to false if Available_Spots == 0
        await activity.findOneAndUpdate(
            { Name: Activity_Name, Available_Spots: 0 },
            { Booking_Available: false }
        );

        await savedTouristActivity.save();

        // Send a response
        res.status(201).json({ message: 'Tourist activity created successfully', tourist_activity: savedTouristActivity });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error creating tourist activity', details: error.message });
    }
};

//pay for tourist activity
const payForTouristActivity = async (req, res) => {
    try {
        const { Tourist_Email, Activity_Name } = req.body;

        // Validate input
        if (!Tourist_Email || !Activity_Name) {
            return res.status(400).json({ error: 'Tourist email and activity name are required.' });
        }

        // Check if the tourist exists
        const touristExists = await Tourist.findOne({ Email: Tourist_Email });
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the activity exists
        const activityExists = await activity.findOne({ Name: Activity_Name });
        if (!activityExists) {
            return res.status(409).json({ error: 'Activity not found.' });
        }

        // Check if the tourist activity exists
        const touristActivityExists = await tourist_activities.findOne({ Tourist_Email, Activity_Name });
        if (!touristActivityExists) {
            return res.status(404).json({ error: 'Tourist activity not found.' });
        }

        // Check if the tourist has enough balance in the wallet
        if (touristExists.Wallet < activityExists.Price) {
            return res.status(400).json({ error: 'Insufficient wallet balance.' });
        }

        // Deduct the activity price from the tourist's wallet balance
        touristExists.Wallet -= activityExists.Price;
        await touristExists.save();

        // Calculate points based on the level
        let points = 0;
        switch (touristExists.Badge) {
            case 'Level 1':
                points = activityExists.Price * 0.5;
                break;
            case 'Level 2':
                points = activityExists.Price * 1;
                break;
            case 'Level 3':
                points = activityExists.Price * 1.5;
                break;
            default:
                points = 0;
        }

        // Add points to the tourist's account
        touristExists.Points += points;
        await touristExists.save();

        // Update the tourist's badge based on the new points
        if (touristExists.Points <= 100000) {
            touristExists.Badge = 'Level 1';
        } else if (touristExists.Points <= 500000) {
            touristExists.Badge = 'Level 2';
        } else {
            touristExists.Badge = 'Level 3';
        }

        await touristExists.save();

        // Mark the tourist activity as paid
        touristActivityExists.Paid = true;
        await touristActivityExists.save();

        await sendPaymentReceipt(Tourist_Email, activityExists.Price, Activity_Name); 

        // Send a response
        res.status(200).json({ message: 'Payment successful. Activity booked.', tourist: touristExists });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error processing payment', details: error.message });
    }
};

//delete tourist activity
const deleteTouristActivity = async (req, res) => {
    try {
        const { Tourist_Email, Activity_Name } = req.body;

        // Validate input
        if (!Tourist_Email || !Activity_Name) {
            return res.status(400).json({ error: 'Tourist email and activity name are required.' });
        }

        // Check if the tourist exists
        const touristExists = await Tourist.findOne({ Email: Tourist_Email });
        if (!touristExists) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the activity exists
        const activityExists = await activity.findOne({ Name: Activity_Name });
        if (!activityExists) {
            return res.status(409).json({ error: 'Activity not found.' });
        }

        // Check if the tourist activity exists
        const touristActivityExists = await tourist_activities.findOne({ Tourist_Email, Activity_Name });
        if (!touristActivityExists) {
            return res.status(404).json({ error: 'Tourist activity not found.' });
        }

        // check if it 48 hours before the activity date
        const activityDate = new Date(activityExists.Date);
        const currentDate = new Date();
        const timeDifference = activityDate.getTime() - currentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        if (hoursDifference < 48) {
            return res.status(400).json({ error: 'Cannot cancel booking. Activity date is less than 48 hours away.' });
        }

        // Check if the activity has already been paid for and if yes, refund the tourist
        if (touristActivityExists.Paid) {
            // Refund the tourist
            touristExists.Wallet += activityExists.Price;
            // Calculate points based on the level
            let points = 0;
            switch (touristExists.Badge) {
                case 'Level 1':
                    points = activityExists.Price * 0.5;
                    break;
                case 'Level 2':
                    points = activityExists.Price * 1;
                    break;
                case 'Level 3':
                    points = activityExists.Price * 1.5;
                    break;
                default:
                    points = 0;
            }
            // Deduct points from the tourist's account
            touristExists.Points -= points;

            // Update the tourist's badge based on the new points
            if (touristExists.Points <= 100000) {
                touristExists.Badge = 'Level 1';
            } else if (touristExists.Points <= 500000) {
                touristExists.Badge = 'Level 2';
            } else {
                touristExists.Badge = 'Level 3';
            }
            await touristExists.save();
        }

        //increment the number of available spots for the activity and decrement the number of bookings
        await activity.findOneAndUpdate(
            { Name: Activity_Name },
            { $inc: { Booked_Spots: -1, Available_Spots: 1 } }
        );

        //update Booking_Available field in activity to true if the number of available spots is greater than 0
        await activity.findOneAndUpdate(
            { Name: Activity_Name, Available_Spots: { $gt: 0 } },
            { Booking_Available: true }
        );

        // Delete the tourist activity
        await tourist_activities.deleteOne({ Tourist_Email, Activity_Name });

        // Send a response
        res.status(200).json({ message: 'Tourist activity deleted successfully.' });
    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error deleting tourist activity', details: error.message });
    }
};

//no 6
// Setup Multer for file uploads
const fs = require('fs'); // Include the file system module
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const storage2 = multer.memoryStorage(); // Store file in memory


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Define the directory where files should be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Use a temporary name
    }
});

const fileFilter = (req, file, cb) => {
    // console.log("File MIME type:", file.mimetype); // Log the MIME type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type. Only PDF and image files are supported."), false);
    }
};

const picFilter = (req, file, cb) => {
    const allowedTypes = [ 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPG and PNG files are allowed.'), false); // Reject the file
    }
};

const upload = multer({
    storage: storage2,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

const picture = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: picFilter
});

// Extract text from image files using Tesseract
const extractTextFromImage = async (buffer) => {
    return Tesseract.recognize(buffer, 'eng')
        .then(result => result.data.text)
        .catch(err => { throw new Error('Error extracting text from image'); });
};

// Extract text from PDF files using pdf-parse
const extractTextFromPDF = async (buffer) => {
    return pdfParse(buffer)
        .then(data => data.text)
        .catch(err => { throw new Error('Error extracting text from PDF'); });
};

const uploadGuestDocuments = async (req, res) => {
    upload.array('document', 2)(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }

            // Check if files were uploaded
            if (!req.files || req.files.length < 2) {
                return res.status(400).json({ error: 'Please upload two documents.' });
            }

            const email = req.body.email;
            const type = req.body.type;

            // Validate email and type
            if (!email || !type) {
                return res.status(400).json({ error: 'Missing email or type in request' });
            }
 
            // Process each file
            const fileBuffers = req.files.map(file => file.buffer);
            const base64Strings = await Promise.all(fileBuffers.map(async (fileBuffer, index) => {
                const fileExtension = req.files[index].mimetype;
                try {
                    if (fileExtension === 'application/pdf') {
                        return await extractTextFromPDF(fileBuffer);
                    } else if (['image/jpeg', 'image/png', 'image/jpg'].includes(fileExtension)) {
                        return await extractTextFromImage(fileBuffer);
                    } else {
                        throw new Error('Unsupported file type. Only PDF and image files are supported.');
                    }
                } catch (error) {
                    console.error(`Error extracting text from file ${index + 1}:`, error);
                    return ''; // Return an empty string if extraction fails
                }
            }));

            // Check the type 
            if (type === 'Seller') {
                const seller = new sellerfiles({ Email: email, Files: base64Strings[0], File2: base64Strings[1] });
                const checkSeller = await sellerfiles.findOne({ Email: email });
                if (checkSeller) {
                    return res.status(409).json({ error: 'Seller files already uploaded.' });
                }
                await seller.save();
            } else if (type === 'Tour Guide') {
                const tour_guide = new tourguidefiles({ Email: email, Files: base64Strings[0], File2: base64Strings[1] });
                const checkTourGuide = await tourguidefiles.findOne({ Email: email });
                if (checkTourGuide) {
                    return res.status(409).json({ error: 'Tour guide files already uploaded.' });
                }
                await tour_guide.save();
            } else if (type === 'Advertiser') {
                const advertiser = new advertiserfiles({ Email: email, Files: base64Strings[0], File2: base64Strings[1] });
                const checkAdvertiser = await advertiserfiles.findOne({ Email : email });
                if (checkAdvertiser) {
                    return res.status(409).json({ error: 'Advertiser files already uploaded.' });
                }
                await advertiser.save();
            } else {
                return res.status(400).json({ error: 'Invalid type. Please specify Seller, Tour Guide, or Advertiser.' });
            }

            // Return the response with the extracted text
            res.status(200).json({
                message: 'Documents uploaded and text extracted successfully.',
                extractedText1: base64Strings[0],
                extractedText2: base64Strings[1]
            });

        } catch (error) {
            console.error('Error uploading document:', error);
            res.status(500).json({ error: 'Error uploading document', details: error.message });
        }
    });
};

const gettouristprofilepic = async (req, res) => {
    picture.single('document',2)(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message }); // Handle Multer errors
            } else if (err) {
                return res.status(400).json({ error: err.message }); // Handle other errors
            }

            // Check if a file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload a picture.' });
            }

            const email = req.body.email;

            // Validate email
            if (!email) {
                return res.status(400).json({ error: 'Missing email in request' });
            }

            // Read the file and convert it to base64
            const filePath = req.file.path;
            fs.readFile(filePath, { encoding: 'base64' }, async (err, base64Data) => {
                if (err) {
                    return res.status(500).json({ error: 'Error reading picture', details: err.message });
                }

                // Optionally, you can also delete the file after reading it
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temporary file:', unlinkErr);
                    }
                });

                // Here you can store the base64 string in the database
                const base64String = `data:${req.file.mimetype};base64,${base64Data}`;

                // Save the base64 string to the Tourist document
                const tourist = await Tourist.findOne({ Email: email });

                tourist.Profile_Pic= base64String;
                const updatedTourist = await tourist.save();


                // Respond with a success message
                res.status(200).json({ message: 'Picture uploaded successfully.', document: tourist });
            });

        } catch (error) {
            console.error('Error uploading picture:', error);
            res.status(500).json({ error: 'Error uploading picture', details: error.message });
        }
    });
};
const gettourguideprofilepic = async (req, res) => {
    picture.single('document')(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message }); // Handle Multer errors
            } else if (err) {
                return res.status(400).json({ error: err.message }); // Handle other errors
            }

            // Check if a file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload a picture.' });
            }

            const email = req.body.email;

            // Validate email
            if (!email) {
                return res.status(400).json({ error: 'Missing email in request' });
            }

            // Read the file and convert it to base64
            const filePath = req.file.path;
            fs.readFile(filePath, { encoding: 'base64' }, async (err, base64Data) => {
                if (err) {
                    return res.status(500).json({ error: 'Error reading picture', details: err.message });
                }

                // Optionally, you can also delete the file after reading it
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temporary file:', unlinkErr);
                    }
                });

                // Here you can store the base64 string in the database
                const base64String = `data:${req.file.mimetype};base64,${base64Data}`;

                // Save the base64 string to the Tourist document
                const tour_guide = await tour_guidem.findOne({ Email: email });

                tour_guide.Pic= base64String;
                const updatedTouriguide = await tour_guide.save();


                // Respond with a success message
                res.status(200).json({ message: 'Picture uploaded successfully.', document: tour_guidem });
            });

        } catch (error) {
            console.error('Error uploading picture:', error);
            res.status(500).json({ error: 'Error uploading picture', details: error.message });
        }
    });
};

const getsellerLogo = async (req, res) => {
    picture.single('document')(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message }); // Handle Multer errors
            } else if (err) {
                return res.status(400).json({ error: err.message }); // Handle other errors
            }

            // Check if a file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload a picture.' });
            }

            const email = req.body.email;

            // Validate email
            if (!email) {
                return res.status(400).json({ error: 'Missing email in request' });
            }

            // Read the file and convert it to base64
            const filePath = req.file.path;
            fs.readFile(filePath, { encoding: 'base64' }, async (err, base64Data) => {
                if (err) {
                    return res.status(500).json({ error: 'Error reading picture', details: err.message });
                }

                // Optionally, you can also delete the file after reading it
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temporary file:', unlinkErr);
                    }
                });

                // Here you can store the base64 string in the database
                const base64String = `data:${req.file.mimetype};base64,${base64Data}`;

                // Save the base64 string to the Tourist document
                const seller = await Seller.findOne({ Email: email });

                seller.Logo= base64String;
                const updatedseller = await seller.save();


                // Respond with a success message
                res.status(200).json({ message: 'Picture uploaded successfully.', document: seller });
            });

        } catch (error) {
            console.error('Error uploading picture:', error);
            res.status(500).json({ error: 'Error uploading picture', details: error.message });
        }
    });
};

const getadvertiserLogo = async (req, res) => {
    picture.single('document')(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message }); // Handle Multer errors
            } else if (err) {
                return res.status(400).json({ error: err.message }); // Handle other errors
            }

            // Check if a file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload a picture.' });
            }

            const email = req.body.email;

            // Validate email
            if (!email) {
                return res.status(400).json({ error: 'Missing email in request' });
            }

            // Read the file and convert it to base64
            const filePath = req.file.path;
            fs.readFile(filePath, { encoding: 'base64' }, async (err, base64Data) => {
                if (err) {
                    return res.status(500).json({ error: 'Error reading picture', details: err.message });
                }

                // Optionally, you can also delete the file after reading it
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temporary file:', unlinkErr);
                    }
                });

                // Here you can store the base64 string in the database
                const base64String = `data:${req.file.mimetype};base64,${base64Data}`;

                // Save the base64 string to the Tourist document
                const advertiser = await AdvertisersModel.findOne({ Email: email });

                advertiser.Logo= base64String;
                const updatedadvertiser = await advertiser.save();


                // Respond with a success message
                res.status(200).json({ message: 'Picture uploaded successfully.', document: advertiser });
            });

        } catch (error) {
            console.error('Error uploading picture:', error);
            res.status(500).json({ error: 'Error uploading picture', details: error.message });
        }
    });
};



const getproductpic = async (req, res) => {
    picture.single('document')(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message }); // Handle Multer errors
            } else if (err) {
                return res.status(400).json({ error: err.message }); // Handle other errors
            }

            // Check if a file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload a picture.' });
            }

            const productName = req.body.productname;

            // Validate product name
            if (!productName) {
                return res.status(400).json({ error: 'Missing product name in request' });
            }

            // Read the file and convert it to base64
            const filePath = req.file.path;
            fs.readFile(filePath, { encoding: 'base64' }, async (err, base64Data) => {
                if (err) {
                    return res.status(500).json({ error: 'Error reading picture', details: err.message });
                }

                // Optionally, you can also delete the file after reading it
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temporary file:', unlinkErr);
                    }
                });

                // Here you can store the base64 string in the database
                const base64String = `data:${req.file.mimetype};base64,${base64Data}`;

                const product = await Product.findOne({ Product_Name: productName });

                product.Picture= base64String;
                const updatedProduct = await product.save();


                // Respond with a success message
                res.status(200).json({ message: 'Picture uploaded successfully.', document: product });
            });

        } catch (error) {
            console.error('Error uploading picture:', error);
            res.status(500).json({ error: 'Error uploading picture', details: error.message });
        }
    });
};

//activate/deactivate Accessibility of an itinerary
const Itineraryactivation = async (req, res) => {
    try {
        const { Itinerary_Name, Accessibility } = req.body;

        // Validate input
        if (!Itinerary_Name || Accessibility === undefined) {
            return res.status(400).json({ error: 'Itinerary name and accessibility are required.' });
        }

        // Check if the itinerary exists
        const itinerary = await itinerarym.findOne({ Itinerary_Name });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found.' });
        }

        // Update the itinerary's accessibility
        itinerary.isActive = Accessibility;
        await itinerary.save();

        res.status(200).json({ message: 'Itinerary updated successfully', itinerary });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error updating itinerary', details: error.message });
    }
};

// Function to get attended itineraries by a tourist from req.body
const getAttendedItineraries = async (req, res) => {
    const { Tourist_Email } = req.body; // Extract the email from the request body
    try {
        // Step 1: Find itineraries for the given Tourist_Email
        const attendedItineraries = await touristIteneraries.find({
            Tourist_Email, // Using the email from req.body
        });

        // Check if attended itineraries were found
        if (attendedItineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found for this email.' });
        }

        // Step 2: Extract the itinerary names and their attended status
        const itinerariesData = attendedItineraries.map(itinerary => ({
            Itinerary_Name: itinerary.Itinerary_Name,
            Attended: itinerary.Attended, // Get the Attended status
            //Picture: itinerary.Picture
        }));

        // Step 3: Fetch the corresponding data from the itinerary model
        const itineraryDetails = await itinerarym.find({
            Itinerary_Name: { $in: itinerariesData.map(item => item.Itinerary_Name) } // Use $in to find matching itinerary names
        });

        // Step 4: Combine itinerary details with attended status
        const response = itinerariesData.map(itinerary => {
            const details = itineraryDetails.find(detail => detail.Itinerary_Name === itinerary.Itinerary_Name);
            return {
                Itinerary_Name: itinerary.Itinerary_Name,
                Attended: itinerary.Attended,
                Picture : details.Picture
                //...details // Spread the details of the itinerary
            };
        });

        // Step 5: Return the combined details
        return res.status(200).json({ attendedItineraries: response });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching attended itineraries: ' + error.message });
    }
};

// Function to get attended activities by a tourist from req.body
const getAttendedActivities = async (req, res) => {
    const { Tourist_Email } = req.body; // Extract the email from the request body
    try {
        // Step 1: Find activities for the given Tourist_Email
        const attendedActivities = await tourist_activities.find({
            Tourist_Email, // Using the email from req.body
        });

        // Check if attended activities were found
        if (attendedActivities.length === 0) {
            return res.status(404).json({ message: 'No activities found for this email.' });
        }

        // Step 2: Extract the activity names and their attended status
        const activitiesData = attendedActivities.map(activity => ({
            Activity_Name: activity.Activity_Name,
            Attended: activity.Attended ,// Get the Attended status
            
        }));

        // Step 3: Fetch the corresponding data from the activity model
        const activityDetails = await activity.find({
            Name: { $in: activitiesData.map(item => item.Activity_Name) } // Use $in to find matching activity names
        });

        // Step 4: Combine activity details with attended status
        const response = activitiesData.map(activity => {
            const details = activityDetails.find(detail => detail.Name === activity.Activity_Name);
            return {
                Activity_Name: activity.Activity_Name,
                Attended: activity.Attended,
                Picture : details.Picture
                //...details // Spread the details of the activity
            };
        });

        // Step 5: Return the combined details
        return res.status(200).json({ attendedActivities: response });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching attended activities: ' + error.message });
    }
};

const getPurchasedProducts = async (req, res) => {
    const { Tourist_Email } = req.body; // Extract email from request body

    try {
        // Find products based on the tourist's email
        const purchasedProducts = await tourist_products.find({ Tourist_Email });

        // If no products are found
        if (purchasedProducts.length === 0) {
            return res.status(404).json({ message: 'No purchased products found for this tourist.' });
        }

        // Return the list of purchased products
        res.status(200).json({ purchasedProducts });
    } catch (error) {
        // Handle errors
        console.error('Error fetching purchased products:', error);
        res.status(500).json({ message: 'Server error, unable to fetch purchased products.' });
    }
};

//calculate itinrary rating
const calculateItineraryRating = async (Itinerary_Name) => {
    try {
        // Validate input
        if (!Itinerary_Name) {
            return res.status(400).json({ error: 'Itinerary name is required.' });
        }

        // Check if the itinerary exists
        const itinerary = await itinerarym.findOne({ Itinerary_Name });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found.' });
        }

        //clculate the no. of ratings and the total of the itinerary from table tourist_itineraries
        const ratings = await tourist_itinerariesm.find({ Itinerary_Name });
        let total = 0;
        let count = 0;
        ratings.forEach(rating => {
            if (rating.Rating) {
                total += rating.Rating;
                count++;
            }
        });

        // Calculate the average rating
        const averageRating = count > 0 ? total / count : 0;

        // Update the itinerary with the new rating
        itinerary.Rating = averageRating;
        await itinerary.save();

        res.status(200).json({ message: 'Itinerary rating calculated successfully', itinerary });

    } catch (error) {
        console.error("Error details:", error.message, error.stack); // Log full error details
        res.status(500).json({ error: 'Error calculating itinerary rating', details: error.message });
    }
};

// const acceptTermsTourGuide = async (req,res) => {
//     try {
//         // First, check if the tour guide exists
//         const {email} = req.body;
//         const tourGuide = await tour_guidem.findOne({ Email: email });
//         if (!tourGuide) {
//             return res.status(404).json({message:'Tour guide not found'});
//         }
//         // If found, update the TermsAccepted field
//         tourGuide.TermsAccepted = true;
//         await tourGuide.save(); // Save the updated tour guide
//         return res.status(200).json({ message: 'Terms accepted successfully', data: tourGuide });
//     } catch (error) {
//         console.error("Error accepting",error.message);
//         res.status(500).json({error:'Error accepting',details: error.message});
//     }
// };

// const checkTermsAcceptedTourGuide = async (req,res) => {
//     try {
//         const {email} = req.body;
//         const tourGuide = await tour_guidem.findOne({ Email: email });
//         if (!tourGuide) {
//             return res.status(404).json({message:'Tour guide not found'});
//         }
        
//         return res.status(200).json({ termsAccepted: tourGuide.TermsAccepted });
//     } catch (error) {
//         console.error("Error checking",error.message);
//         res.status(500).json({error:'Error checking',details: error.message});
//     }
// };

// const acceptTermsAdvertiser = async (req,res) => {
//     try {
        
//         const {email} = req.body;
//         const advertiser = await AdvertisersModel.findOne({ Email: email });
//         if (!advertiser) {
//             return res.status(404).json({message:'Advertiser not found'});
//         }
        
//         advertiser.TermsAccepted = true;
//         await advertiser.save(); // Save the updated tour guide
//         return res.status(200).json({ message: 'Terms accepted successfully', data: advertiser });;
//     } catch (error) {
//         console.error("Error accepting",error.message);
//         res.status(500).json({error:'Error accepting',details: error.message});
//     }
// };

// const acceptTermsSeller = async (req,res) => {
//     try {
//         const {email} = req.body;
//         const seller = await Seller.findOne({ Email: email });

//         if (!seller) {
//             return res.status(404).json({message:'Seller not found'});
//         }

//         // If found, update the TermsAccepted field
//         seller.TermsAccepted = true;
//         await seller.save(); // Save the updated 
//         return res.status(200).json({ message: 'Terms accepted successfully', data: seller });;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// const checkTermsAcceptedAdvertiser = async (req,res) => {
//     try {
//         const {email} = req.body;
//         const advertiser = await AdvertisersModel.findOne({ Email: email });
        
//         if (!advertiser) {
//             return res.status(404).json({message:'Advertiser not found'});
//         }
//         return res.status(200).json({ termsAccepted: advertiser.TermsAccepted });
//     } catch (error) {
//         console.error("Error accepting",error.message);
//         res.status(500).json({error:'Error accepting',details: error.message});
//     }
// };

// const checkTermsAcceptedSeller = async (req,res) => {
//     try {
//         const {email} = req.body;
//         const seller = await Seller.findOne({ Email: email });
        
//         if (!seller) {
//             return res.status(404).json({message:'Seller not found'});
//         }
//         return res.status(200).json({ termsAccepted: seller.TermsAccepted });
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
const acceptTerms = async (req, res) => {
    try {
      const { Email } = req.body;
  
      if (!Email) {
        return res.status(400).json({ message: 'Email is required.' });
      }
  
      // Check for the user in the possible collections
      let user;
  
      // Check in tour guides table
      user = await tour_guidem.findOne({ Email });
      if (!user) {
        // Check in advertisers table
        user = await AdvertisersModel.findOne({ Email });
        if (!user) {
          // Check in sellers table
          user = await Seller.findOne({ Email });
          if (!user) {
            return res.status(404).json({ message: 'User not found.' });
          }
        }
      }
  
      // Update TermsAccepted status to true
      user.TermsAccepted = true;
      await user.save();
  
      return res.status(200).json({ message: 'Terms accepted successfully.' });
  
    } catch (error) {
      console.error("Error accepting terms:", error.message);
      return res.status(500).json({ error: 'Error accepting terms', details: error.message });
    }
  };
  
const checkTermsAccepted = async (req, res) => {
    try {
        const { email, type } = req.body;

        if (!email || !type) {
            return res.status(400).json({ message: 'Email and user type are required.' });
        }

        let user;
        switch (type.toLowerCase()) {
            case 'tour_guide':
                user = await tour_guidem.findOne({ Email: email });
                break;
            case 'advertiser':
                user = await AdvertisersModel.findOne({ Email: email });
                break;
            case 'seller':
                user = await Seller.findOne({ Email: email });
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type.' });
        }

        if (!user) {
            return res.status(404).json({ message: `${type} not found` });
        }

        return res.status(200).json({ termsAccepted: user.TermsAccepted });
    } catch (error) {
        console.error("Error checking terms acceptance:", error.message);
        res.status(500).json({ error: 'Error checking terms acceptance', details: error.message });
    }
};


const deactivateItinerary = async (req, res) => {
    try {
        const { itineraryName } = req.body; // Get the itinerary name from the request body

        // Find the itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name: itineraryName });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        if (itinerary.Booked > 0) {
            // If there are bookings, only deactivate the itinerary
            itinerary.isActive = false; // Set status to inactive
            await itinerary.save();
            return res.status(200).json({ message: 'Itinerary deactivated. Existing bookings will proceed as scheduled.' });
        } else {
            return res.status(400).json({ message: 'This itinerary cannot be deactivated because it has no bookings.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deactivating itinerary', error: error.message });
    }
};

const activateItinerary = async (req, res) => {
    try {
        const { itineraryName } = req.body; // Get the itinerary name from the request body

        // Find the itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name: itineraryName });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        if (itinerary.Booked > 0) {
            // If there are bookings, only deactivate the itinerary
            itinerary.isActive = true; // Set status to inactive
            await itinerary.save();
            return res.status(200).json({ message: 'Itinerary activated.' });
        } else {
            return res.status(400).json({ message: 'This itinerary cannot be activated because it has no bookings.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deactivating itinerary', error: error.message });
    }
};

const getActivitiesinItinerary = async (req, res) => {
    const { itineraryName } = req.body;

    if (!itineraryName) {
        return res.status(400).json({ message: 'Itinerary name is required' });
    }

    try {
        const itinerary = await itinerarym.findOne({ Itinerary_Name: itineraryName });
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const itineraryActivities = await itinerary_activitiesm.find({ Itinerary_Name: itineraryName }).populate('Activities');
        console.log('Populated Itinerary Activities:', itineraryActivities); // Debugging line

        //check that the itinerary has activities
        if (itineraryActivities.length === 0) {
            return res.status(404).json({ message: 'No activities found for this itinerary.' });
        }

        //find the itinrary activites in table activities
        const activities = await activity.find({ Name: { $in: itineraryActivities.map(item => item.Activities) } });
        //check that the activities are found
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found for this itinerary.' });
        }

        // Return the activities and its durations in the itinerary
        return res.status(200).json({ itineraryActivities});

    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
    
};

// Function to add activity to an itinerary
const addActivitiesinItinerary = async (req, res) => {
    const { itineraryName, activityName } = req.body;

    // Validate input
    if (!itineraryName || !activityName) {
        return res.status(400).json({ message: 'Itinerary name and activity name are required' });
    }

    try {
        // Find the itinerary by name
        const itinerary = await itinerarym.findOne({ Itinerary_Name: itineraryName });
        // Check if the itinerary exists
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Find the activity by name
        const activityy = await activity.findOne({ Name: activityName });
        // Check if the activity exists
        if (!activityy) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if the activity is already in the itinerary
        const existingActivity = await itinerary_activitiesm.findOne({ Itinerary_Name: itineraryName, Activities: activityName });
        if (existingActivity) {
            return res.status(409).json({ message: 'Activity already exists in the itinerary' });
        }

        // Create a new itinerary activity
        const newItineraryActivity = new itinerary_activitiesm({ Itinerary_Name: itineraryName, Activities: activityName ,Duration:activityy.Duration});
        const savedItineraryActivity = await newItineraryActivity.save();
        //return the saved itinerary activity
        return res.status(201).json({ message: 'Activity added to itinerary successfully', itineraryActivity: savedItineraryActivity });
    } catch (error) {
        console.error('Error adding activity to itinerary:', error);
        return res.status(500).json({ message: 'Error adding activity to itinerary', error: error.message });
    }
};

//apis
const getHotelPrice = async (hotelId, checkInDate, checkOutDate, numberOfGuests, numberOfRooms) => {
    try {
      // Make the Amadeus API call to fetch the price for the specific hotel
      const priceResponse = await amadeus.shopping.hotelOffers.get({
        hotelId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        numberOfRooms
      });
  
      // Extract and return the price
      const priceData = priceResponse.data ? priceResponse.data[0] : null;
      if (priceData) {
        return priceData.price.total;
      } else {
        return 'Price not available';
      }
    } catch (error) {
      // Log more detailed error info to understand the issue
      if (error.response) {
        console.error('Error fetching hotel price:', error.response.data);
        return 'Error fetching price: ' + error.response.data.error;
      } else {
        console.error('Error fetching hotel price:', error.message);
        return 'Error fetching price: ' + error.message;
      }
    }
  };
  

const searchHotel = async (req, res) => {
    try {
      const {
        hotelName, cityCode, checkInDate, checkOutDate, numberOfGuests, numberOfRooms
      } = req.body;
  
      // Validate required input
      if (!hotelName || !cityCode || !checkInDate || !checkOutDate || !numberOfGuests || !numberOfRooms) {
        return res.status(400).json({ error: 'All fields are required (hotel name, city code, check-in date, check-out date, number of guests, and number of rooms).' });
      }
  
      // Call Amadeus Hotel Search API by city
      const response = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode,
      });
  
      // Check if hotels are found
      if (response.data && response.data.length > 0) {
        // Filter hotels by the provided hotel name (case-insensitive)
        const filteredHotels = response.data.filter(hotel =>
          hotel.name.toLowerCase().includes(hotelName.toLowerCase())
        );
  
        // Check if any hotels match the search criteria
        if (filteredHotels.length > 0) {
          const hotelPromises = filteredHotels.map(async (hotel) => {
            // Get the price for each hotel using the separate getHotelPrice function
            const price = await getHotelPrice(
              hotel.hotelId,
              checkInDate,
              checkOutDate,
              numberOfGuests,
              numberOfRooms
            );
  
            return {
              id: hotel.hotelId,
              name: hotel.name,
              address: hotel.address,
              rating: hotel.rating,
              amenities: hotel.amenities,
              checkInDate,
              checkOutDate,
              numberOfGuests,
              numberOfRooms,
              price, // Add price to the hotel details
            };
          });
  
          // Wait for all hotel price fetches to complete
          const hotels = await Promise.all(hotelPromises);
  
          return res.status(200).json({
            success: true,
            message: `${hotels.length} hotels found matching "${hotelName}" in ${cityCode}`,
            hotels,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: `No hotels found matching "${hotelName}" in ${cityCode}`,
          });
        }
      } else {
        return res.status(404).json({ success: false, message: 'No hotels found in the specified city' });
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return res.status(500).json({
        success: false,
        error: 'An error occurred while searching for hotels. Please try again later.',
        details: error.message, // Optional: Include error details for debugging
      });
    }
  };
 
const searchFlights = async (req, res) => {
    try {
      const { origin, destination, departureDate, returnDate, adults } = req.body;
  
      // Ensure required fields are provided
      if (!origin || !destination || !departureDate || !adults) {
        return res.status(400).json({ error: 'Origin, destination, departure date, and number of adults are required.' });
      }
  
      // Call the Amadeus Flight Offers Search API
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        returnDate: returnDate, // Optional if it’s a one-way trip
        adults: adults,
        max: 5 // Limits the number of offers returned for simplicity
      });
  
      // Check if flights are found
      if (response.data && response.data.length > 0) {
        res.status(200).json({
          success: true,
          flights: response.data
        });
      } else {
        res.status(404).json({ message: 'No flights found' });
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ error: error.message });
    }
};

// Checkout Order for a Tourist
const checkoutOrder = async (req, res) => {
    try {
        const { Tourist_Email, Product_Name } = req.body;

        // Validate input
        if (!Tourist_Email || !Product_Name) {
            return res.status(400).json({ message: "Tourist_Email and Product_Name are required." });
        }

        // Find the product matching both email and product name
        const product = await tourist_products.findOne({ 
            Tourist_Email, 
            Product_Name 
        });

        if (!product) {
            return res.status(404).json({ 
                message: 'No product found for the provided email and product name.' 
            });
        }

        // Process the checkout (e.g., log data, prepare response, etc.)
        const checkedOutProduct = {
            Product_Name: product.Product_Name,
            Review: product.Review,
            Rating: product.Rating || 'No rating',
        };

        res.status(200).json({
            message: 'Order checked out successfully.',
            data: checkedOutProduct,
        });
    } catch (error) {
        console.error('Error checking out order:', error.message);
        res.status(500).json({ 
            error: 'Error checking out order', 
            details: error.message 
        });
    }
};


// view my purchased products
const viewMyPurchasedProducts = async (req, res) => {
    try {
        const { Tourist_Email } = req.body;

        // Validate input
        if (!Tourist_Email) {
            return res.status(400).json({ error: 'Tourist email is required.' });
        }
        // existing tourist
        const tourist = await Tourist.findOne({ Email: Tourist_Email });
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Find the purchased products
        const purchasedProducts = await tourist_products.find({ Tourist_Email });

        // Check if purchased products were found
        if (purchasedProducts.length === 0) {
            return res.status(404).json({ message: 'No purchased products found for this tourist.' });
        }

        // Return the purchased products
        res.status(200).json({ purchasedProducts });
    } catch (error) {
        console.error('Error fetching purchased products:', error);
        res.status(500).json({ error: 'Error fetching purchased products', details: error.message });
    }
};


// Function to retrieve all delete requests
const viewAllDeleteRequests = async (req, res) => {
    try {
        // Fetch all delete requests from the database
        const deleteRequests = await DeleteRequestsm.find();
        
        // Send the list of delete requests as a response
        return res.status(200).json({
            message: "All delete requests fetched successfully",
            deleteRequests,
        });
    } catch (error) {
        console.error('Error fetching delete requests:', error);
        return res.status(500).json({ error: 'Failed to retrieve delete requests' });
    }
};

// Function to delete a delete request by email
const deleteRequest = async (req, res) => {
    try {
        const { Email } = req.body;

        // Validate input
        if (!Email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Find the delete request by email
        const deleteRequest = await Guest.findOne({ Email });

        // Check if the delete request exists
        if (!deleteRequest) {
            return res.status(404).json({ error: 'Delete request not found.' });
        }

        // Delete the delete request
        await deleteRequest.deleteOne();

        // Send a success response
        return res.status(200).json({ message: 'Delete request deleted successfully.' });
    } catch (error) {
        console.error('Error deleting delete request:', error);
        return res.status(500).json({ error: 'Failed to delete delete request' });
    }
};

// Tourist View Order Details and Status
const viewOrderDetails = async (req, res) => {
    try {
        // Extract Email and Cart_Num from the request body
        const { Email, Cart_Num } = req.body;

        // Validate input: Check if Email and Cart_Num are provided
        if (!Email || !Cart_Num) {
            return res.status(400).json({ message: "Email and Cart_Num are required." });
        }

        // Fetch the order using Email and Cart_Num
        const orderm = await order.findOne({ Email, Cart_Num });

        // If no order is found for the provided Email and Cart_Num
        if (!orderm) {
            return res.status(404).json({
                message: "No order found for the provided Email and Cart_Num."
            });
        }

        // Respond with the order details
        res.status(200).json({
            message: "Order details fetched successfully.",
            orderDetails: {
                Email: orderm.Email,
                Cart_Num: orderm.Cart_Num,
                Status: orderm.Status,
                Address: orderm.Address,
                Payment_Method: orderm.Payment_Method,
            }
        });
    } catch (error) {
        console.error('Error fetching order details:', error.message);
        res.status(500).json({
            error: "Error fetching order details",
            details: error.message
        });
    }
};




// Function to create new transportation
const createTransportation = async (req, res) => {
    try {
        const { 
            Route_Number, 
            Advertiser_Name , 
            Advertiser_Email, 
            Advertiser_Phone ,
            Pickup_Location ,
            Dropoff_Location, 
            Pickup_Date, 
            Pickup_Time, 
            Droppff_Time, 
            Avilable_Seats, 
            Price } = req.body;
        
        // Validate input
        if (!Route_Number || !Advertiser_Name || !Advertiser_Email || !Advertiser_Phone || !Pickup_Location || !Dropoff_Location || !Pickup_Date || !Pickup_Time || !Droppff_Time || !Avilable_Seats || !Price) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the transportation already exists
        const existingTransportation = await transportationm.findOne({ Route_Number });
        if (existingTransportation) {
            return res.status(409).json({ error: 'Transportation already exists.' });
        }

        // Create a new transportation
        const newTransportation = new transportationm({
            Route_Number,
            Advertiser_Name,
            Advertiser_Email,
            Advertiser_Phone,
            Pickup_Location,
            Dropoff_Location,
            Pickup_Date,
            Pickup_Time,
            Droppff_Time,
            Avilable_Seats,
            Price
        });
        
        // Save the transportation to the database
        await newTransportation.save();

        // Send a success response
        return res.status(201).json({ message: 'Transportation created successfully.', transportation: newTransportation });
    }catch (error) {
        console.error('Error creating transportation:', error);
        return res.status(500).json({ error: 'Failed to create transportation.' });
    }
}

// function to book a tourist transportation
const bookTransportation = async (req, res) => {
    try {
        const {Tourist_Email,Route_Number} = req.body;

        // Validate input
        if (!Tourist_Email || !Route_Number) {
            return res.status(400).json({ error: 'Tourist email and Route number are required.' });
        }

        // Check if the transportation exists
        const transportation = await transportationm.findOne({ Route_Number });
        if (!transportation) {
            return res.status(404).json({ error: 'Transportation not found.' });
        }

        // Check if the tourist exists
        const tourist = await Tourist.findOne({ Email: Tourist_Email });
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the transportation has available seats using avilable falg 
        if (!transportation.Avilable) {
            return res.status(400).json({ error: 'No available seats for this transportation.' });
        }

        // check that this tourist has not booked this transportation before
        const existingBooking = await tourist_transportationsm.findOne({ Tourist_Email, Route_Number });
        if (existingBooking) {
            return res.status(409).json({ error: 'You have already booked this transportation.' });
        }

        // Create a new booking
        const newBooking = new tourist_transportationsm({
            Tourist_Email,
            Route_Number,
        });

        // Save the booking to the database
        await newBooking.save();

        // Decrease the available seats by 1 and increase the booked seats by 1
        transportation.Avilable_Seats -= 1;
        await transportation.save();
        transportation.Booked_Seats += 1;
        await transportation.save();

        //update avilable flag
        if (transportation.Avilable_Seats === 0) {
            transportation.Avilable = false;
            await transportation.save();
        }

        // Send a success response
        return res.status(201).json({ message: 'Transportation booked successfully.', booking: newBooking });
    }catch (error) {
        console.error('Error booking transportation:', error);
        return res.status(500).json({ error: 'Failed to book transportation.' });
    }
}

//function to view all transportation
const viewAllTransportation = async (req, res) => {
    try {
        // Fetch all transportation from the database
        const transportation = await transportationm.find();

        // Send the list of transportation as a response
        return res.status(200).json({ message: "All transportation fetched successfully", transportation });
    } catch (error) {
        console.error('Error fetching transportation:', error);
        return res.status(500).json({ error: 'Failed to retrieve transportation' });
    }
}

const getAllUnarchivedProducts = async (req, res) => {
    try {
      // Fetch all  products from the database
      const products = await Product.find({ Archived: false });

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

// Function to get all rows from the files collections
const getAllFiles = async (req, res) => {
    try {
        // Fetch all documents from each collection
        const tourGuideFiles = await tourguidefiles.find({});
        const sellerFiles = await sellerfiles.find({});
        const advertiserFiles = await advertiserfiles.find({});

        // Combine all the results into one object
        const allFiles = {
            tourGuideFiles,
            sellerFiles,
            advertiserFiles
        };

        // Return the combined result as JSON
        res.status(200).json({
            message: 'Files retrieved successfully',
            allFiles
        });
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Error retrieving files', details: error.message });
    }
};

const getSalesReport = async (req, res) => {
    try {
        const { sellerName } = req.params;

        // Validate the seller name
        if (!sellerName) {
            return res.status(400).json({ message: "Seller name is required." });
        }

        // Fetch products by the seller
        const products = await Product.find({ Seller_Name: sellerName });
        const seller = await Seller.findOne({ Username: sellerName });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this seller." });
        }

        if (!seller) {
            return res.status(404).json({ message: "Seller not found." });
        }

        // Loop through all products to calculate revenue and add to seller_salesreport
        const reports = [];
        for (const product of products) {
            // Calculate revenue for each product
            const revenue = (product.Saled * product.Price) * 0.9;

            // Create the sales report for the product
            const report = await seller_salesreport.create({
                Email: seller.Email,
                Product: product.Product_Name,
                Revenue: revenue,
                Sales: product.Saled,
                Price: product.Price,
                Report_no: Math.floor(Math.random() * 1000000), // Generate a random report number
            });

            // Push the report to the array
            reports.push(report);
        }

        // Return the results
        return res.status(200).json({
            message: "All products processed and reports added.",
            reports,
        });
    } catch (error) {
        console.error("Error fetching sales report:", error);
        return res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
};

const getAllSalesReportsseller = async (req, res) => {
    try {
        // Fetch all the sales reports from the database
        const salesReports = await seller_salesreport.find();

        // If no reports are found, return a 404 status
        if (!salesReports || salesReports.length === 0) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }

        // Return the list of sales reports with a 200 status
        return res.status(200).json(salesReports);
    } catch (error) {
        // If an error occurs, catch it and return a 500 status with the error message
        console.error('Error fetching sales reports:', error.message);
        return res.status(500).json({
            error: 'Error fetching sales reports',
            details: error.message,
        });
    }
};

//make function to update cart
const updateCartItem = async (req, res) => {
    try {
        const { Email, Productname, action } = req.body;

        // Validate input
        if (!Email || !Productname || !action) {
            return res.status(400).json({ error: 'Email, product name, and action are required.' });
        }

        // Find tourist by email
        const tourist = await Tourist.findOne({ Email: Email });
        if (!tourist || !tourist.Cart_Num) {
            return res.status(404).json({ error: 'Tourist or current cart number not found.' });
        }

        // Log debug information
       
        

        // Find cart item
        const cartItem = await cartm.findOne({
            Cart_Num: tourist.Cart_Num,
            Email,
            Productname
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        // Action handling
        if (action === 'increment') {
            cartItem.Quantity += 1;
            await cartItem.save();
            return res.status(200).json({
                message: 'Product quantity incremented successfully.',
                cartItem
            });

        } else if (action === 'decrement') {
            if (cartItem.Quantity > 1) {
                cartItem.Quantity -= 1;
                await cartItem.save();
                return res.status(200).json({
                    message: 'Product quantity decremented successfully.',
                    cartItem
                });
            } else {
                return res.status(400).json({ error: 'Product quantity cannot be less than 1.' });
            }

        } else if (action === 'delete') {
            await cartItem.deleteOne();
            return res.status(200).json({ message: 'Product removed from cart successfully.' });
        } else {
            return res.status(400).json({ error: 'Invalid action. Allowed actions are increment, decrement, or delete.' });
        }
    } catch (error) {
        console.error('Error updating cart item:', error.message);
        return res.status(500).json({
            error: 'Failed to update cart item.',
            details: error.message
        });
    }
};


//cadd a product to my cart
const addToCart = async (req, res) => {
    try {
        const { email, productName } = req.body;

        // Validate input
        if (!email || !productName) {
            return res.status(400).json({ message: "Email and Product Name are required." });
        }

        // Check if the tourist email exists
        const tourist = await Tourist.findOne({ Email: email });
        if (!tourist) {
            return res.status(404).json({ message: "Tourist email not found." });
        }

        // Retrieve the current Cart_Num from the tourist
        const currentCartNum = tourist.Cart_Num;

        // Check if the product exists
        const product = await Product.findOne({ Product_Name: productName });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Search for the cart item with the given Cart_Num, email, and product name
        const cartItem = await cartm.findOne({ 
            Email: email, 
            Productname: productName, 
            Cart_Num: currentCartNum 
        });

        if (cartItem) {
            // If the product exists in the cart, increment the quantity
            cartItem.Quantity += 1;
            await cartItem.save();

            return res.status(200).json({ 
                message: "Product quantity updated in cart.", 
                cartItem, 
                cartNumber: cartItem.Cart_Num 
            });
        } else {
            // Create a new cart item using the current Cart_Num
            const newCartItem = new cartm({
                Cart_Num: currentCartNum, // Use the tourist's current Cart_Num
                Email: email,
                Productname: productName,
                Quantity: 1
            });

            await newCartItem.save();

            return res.status(201).json({ 
                message: "Product added to cart successfully.", 
                cartItem: newCartItem, 
                cartNumber: newCartItem.Cart_Num 
            });
        }
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        res.status(500).json({ 
            error: "Error adding product to cart", 
            details: error.message 
        });
    }
};




//create a wish list for the tourist
const createwishlistItem = async (req, res) => {
    try{
        const {Email, Productname } = req.body;

        // Validate input
        if (!Email || !Productname ) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the tourist exists
        const tourist = await Tourist.findOne({ Email });
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Check if the product exists
        const product = await Product.findOne({ Product_Name : Productname });
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Check if the product is already in the wish list
        const existingwishlistItem = await wishlist.findOne({ Email, Productname });
        if (existingwishlistItem) {
            return res.status(409).json({ error: 'Product already in wish list.' });
        }

        // Create a new cart item
        const newwishlistItem = new wishlist({
            Email,
            Productname
        });

        // Save the cart item to the database
        await newwishlistItem.save();

        // Send a success response
        return res.status(201).json({ message: 'Wish List item created successfully.', newwishlistItem });
    } catch (error) {
        console.error('Error creating wish list item:', error);
        return res.status(500).json({ error: 'Failed to create wish list item.' });
    }
};

//view my wish list of product
const viewMyWishlist = async (req, res) =>{
    try {
        const { mail } = req.params;

        // Validate request
        if (!mail) {
            return res.status(400).json({ message: "Email is required." });
        }
 
        // Retrieve all products in the wishlist for the given email
        const wishlistProducts = await wishlist.find({ Email: mail });

        if (wishlistProducts.length === 0) {
            return res.status(404).json({ message: "No products found for this tourist." });
        }

        res.status(200).json({
            message: "Products retrieved successfully.",
            wishlistProducts
        });
    } catch (error) {
        console.error('Error retrieving wish list:', error.message);
        res.status(500).json({ error: "Error retrieving wish list", details: error.message });
    }
};

// remove a product from my wish list
const deleteProductFromMyWishList = async (req, res) => {
    try{
        const { mail, productname } = req.params;

        // Validate request
        if (!mail || !productname) {
            return res.status(400).json({ message: "Email and Product Name are required." });
        }

        // Delete the product from the wishlist
        const result = await wishlist.deleteOne({ Email: mail, Productname: productname });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found in wishlist." });
        }

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error('Error deleting product from wishlist:', error.message);
        res.status(500).json({ error: "Error deleting product from wishlist", details: error.message });
    }
};

// add an item from my wish list to my cart
const addProductFromWishListToCart = async (req, res) => {
    try{
        const { mail, productName } = req.params;

        // Validate request
        if (!mail || !productName) {
            return res.status(400).json({ message: "Email and Product Name are required." });
        }

        // Find the product in the wishlist
        const wishlistItem = await wishlist.findOne({ Email: mail, Productname: productName });

        if (!wishlistItem) {
            return res.status(404).json({ message: "Product not found in wishlist." });
        }
        // Check if the product already exists in the cart
        const existingCartItem = await cartm.findOne({ Email: mail, Productname: productName });

        if (existingCartItem) {
            // If it exists, update the quantity
            existingCartItem.Quantity += 1; // Increase quantity by 1
            await existingCartItem.save();
            return res.status(200).json({ message: "Product quantity updated in cart.", cartItem: existingCartItem });
        } else {
            // If it doesn't exist, create a new cart item
            const newCartItem = new cartm({
                Email: mail,
                Productname: productName,
                Quantity: 1 // Default quantity
            });

            await newCartItem.save();
            return res.status(201).json({ message: "Product added to cart successfully.", cartItem: newCartItem });
        }

    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).json({ error: "Error adding product to cart", details: error.message });
    }
};

const viewTouristOrders = async (req, res) => {
    try {
        const { Tourist_Email } = req.params;

        // Validate request
        if (!Tourist_Email) {
            return res.status(400).json({ message: "Tourist email is required." });
        }

        // Find orders for the tourist
        const orders = await Tourist_Products.find({ Tourist_Email });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this tourist." });
        }

        // Group orders into current and past
        const currentOrders = orders.filter(order => !order.Review && !order.Rating);
        const pastOrders = orders.filter(order => order.Review || order.Rating);

        res.status(200).json({
            message: "Orders retrieved successfully.",
            currentOrders,
            pastOrders
        });
    } catch (error) {
        console.error('Error retrieving tourist orders:', error.message);
        res.status(500).json({ error: "Error retrieving orders", details: error.message });
    }
};


const calculateActivityRevenue = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Retrieve all activities for the given email
        const activities = await activity.find({ Created_By: email });

        if (activities.length === 0) {
            return res.status(404).json({ message: `No activities found for email '${email}'` });
        }

        // Loop through all activities to calculate revenue and add to advertiser_salesreport
        const reports = [];
        for (const activitym of activities) {
            // Count the number of paid records for this activity
            const paidCount = await tourist_activities.countDocuments({
                Activity_Name: activitym.Name,
                Paid: true,
            });

            // Calculate revenue for the activity
            const revenue =
                paidCount > 0
                    ? (paidCount * (activitym.Price - (activitym.Discount_Percent / 100 * activitym.Price))) * 0.9
                    : 0;

            

            // Create the sales report for the activity
            const report = await advertiser_salesreport.create({
                Email: email,
                Activity: activitym.Name,
                Revenue: revenue,
                Sales: paidCount,
                Price: activitym.Price,
                Report_no: Math.floor(Math.random() * 1000000), // Generate a random report number
            });

            // Push the report to the array
            reports.push(report);
        }

        // Return the results
        return res.status(200).json({
            message: 'All activities processed and reports added.',
            reports,
        });
    } catch (error) {
        console.error('Error calculating activity revenue:', error.message);
        return res.status(500).json({
            error: 'Error calculating activity revenue',
            details: error.message,
        });
    }
};



const getAllSalesReports = async (req, res) => {
    try {
        // Fetch all the sales reports from the database
        const salesReports = await advertiser_salesreport.find();

        // If no reports are found, return a 404 status
        if (!salesReports || salesReports.length === 0) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }

        // Return the list of sales reports with a 200 status
        return res.status(200).json(salesReports);
    } catch (error) {
        // If an error occurs, catch it and return a 500 status with the error message
        console.error('Error fetching sales reports:', error.message);
        return res.status(500).json({
            error: 'Error fetching sales reports',
            details: error.message,
        });
    }
};



const calculateItineraryRevenue = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Retrieve all itineraries for the given email
        const itineraries = await itinerarym.find({ Created_By: email });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: `No itineraries found for email '${email}'` });
        }

        // Loop through all itineraries to calculate revenue and add to advertiser_salesreport
        const reports = [];
        for (const itinerarym of itineraries) {
            // Count the number of paid records for this itinerary
            const paidCount = await touristIteneraries.countDocuments({
                Itinerary_Name: itinerarym.Itinerary_Name,
                Paid: true,
            });

            // Calculate revenue for the itinerary
            const revenue =
                paidCount > 0
                    ? (paidCount * itinerarym.Tour_Price * 0.9)
                    : 0;

            

            // Create the sales report for the itinerary
            const report = await tourguide_salesreport.create({
                Email: email,
                Itinerary: itinerarym.Itinerary_Name, // Store as "Activity" to align with the schema
                Revenue: revenue,
                Sales: paidCount,
                Price: itinerarym.Tour_Price,
                Report_no: Math.floor(Math.random() * 1000000), // Generate a random report number
            });

            // Push the report to the array
            reports.push(report);
        }

        // Return the results
        return res.status(200).json({
            message: 'All itineraries processed and reports added.',
            reports,
        });
    } catch (error) {
        console.error('Error calculating itinerary revenue:', error.message);
        return res.status(500).json({
            error: 'Error calculating itinerary revenue',
            details: error.message,
        });
    }
};

const getAllSalesReportsitin = async (req, res) => {
    try {
        // Fetch all the sales reports from the database
        const salesReports = await tourguide_salesreport.find();

        // If no reports are found, return a 404 status
        if (!salesReports || salesReports.length === 0) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }

        // Return the list of sales reports with a 200 status
        return res.status(200).json(salesReports);
    } catch (error) {
        // If an error occurs, catch it and return a 500 status with the error message
        console.error('Error fetching sales reports:', error.message);
        return res.status(500).json({
            error: 'Error fetching sales reports',
            details: error.message,
        });
    }
};



//function to create new promocode
const createPromoCode = async (req, res) => {
    try {
        const { Code, Discount, Expiry,CreatedBy ,type} = req.body;
        // Validate input
        if (!Code || !Discount || !Expiry || !type || !CreatedBy) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        // Check if the promo code already exists
        const existingPromoCode = await promocodem.findOne({ Code });
        if (existingPromoCode) {
            return res.status(409).json({ error: 'Promo code already exists.' });
        }

        //check that the date is valid
        const expiryDate = new Date(Expiry);
        if (expiryDate < new Date()) {
            return res.status(400).json({ error: 'Expiry date must be in the future.' });
        }

        // check CreatedBy table admin
        const admin = await Admin.findOne({Email : CreatedBy  });
        if(!admin){
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Create a new promo code
        const newPromoCode = new promocodem({ Code, Discount, Expiry,CreatedBy,type});
        // Save the promo code to the database
        await newPromoCode.save();
        // Send a success response
        return res.status(201).json({ message: 'Promo code created successfully.', promoCode: newPromoCode });
    } catch (error) {
        console.error('Error creating promo code:', error);
        return res.status(500).json({ error: 'Failed to create promo code.' });
    }
}
const cancelOrder = async (req, res) => {
    try {
        const { email, cartNum } = req.body;  // Destructure email and cartNum from the request body
        // Log the incoming data for debugging
        console.log('Received email:', email);
        console.log('Received cartNum:', cartNum);
        // Validate inputs
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!cartNum) {
            return res.status(400).json({ message: "Cart number is required" });
        }
        // Check if the order exists in the database
        const existingOrder = await order.findOne({ Email: email, Cart_Num: cartNum });
        // Log the result of the database query for debugging
        console.log('Found Order:', existingOrder);
        if (!existingOrder) {
            // Return 404 if the order doesn't exist
            return res.status(404).json({ message: "Order not found" });
        }
        // Delete the order from the database
        await order.deleteOne({ Email: email, Cart_Num: cartNum });
        // Return a success response with the deleted order details
        return res.status(200).json({
            message: "Order deleted successfully",
            deletedOrder: existingOrder
        });
    } catch (error) {
        // Log the error and return a 500 response if something goes wrong
        console.error(`Error canceling order:`, error);
        return res.status(500).json({ message: "Server error" });
    }
};

const addTouristAddress = async (req, res) => {
    try {
        const { email, address } = req.body;
        // Validate inputs
        if (!email || !address) {
            return res.status(400).json({
            message: "Email and at least one address are required.",
            });
        }
        
        const addressDocument = {
            Email: email,
            Address: address.trim(),
          };
        const addedAddresses = await tourist_addreessiesm.create(addressDocument);
        return res.status(201).json({
            message: "Address(es) added successfully.",
            addresses: addedAddresses,
        });
    } 
    catch (error) {
        console.error("Error adding tourist address(es):", error);
        return res.status(500).json({
            message: "An error occurred while adding address(es).",
        });
    }
};
const saveEvent = async (req, res) => {
    try {
        const { email, type, name } = req.body;
        // Validate inputs
        if (!email || !type || !name) {
            return res.status(400).json({
            message: "Tourist'email, Type, and Name are required.",
            });
        }
        const newSavedEvent = new saved_eventm({
            Tourist_Email: email,
            TYPE: type,            
            Name: name,
        });
        await newSavedEvent.save();
        return res.status(201).json({
            message: "Event saved successfully.",
            saved_event: newSavedEvent,
        });
    } 
    catch (error) {
        // Handle duplicate errors
        if (error.code === 11000) {
            return res.status(409).json({
            message: "Event already saved for this tourist.",
            });
        }
        console.error("Error saving event:", error);
        return res.status(500).json({
            message: "An error occurred while saving the event.",
        });
    }
};

// const viewSavedEvents = async (req, res) => {
//     try {
//         const { email } = req.body;
//         // Validate input
//         if (!email) {
//             return res.status(400).json({
//                 message: "Tourist email is required to view saved events.",
//             });
//         }

//         // Find saved events for the given email
//         const savedEvents = await saved_eventm.find({ Tourist_Email: email });
//         if (savedEvents.length === 0) {
//             return res.status(404).json({
//                 message: "No saved events found for this tourist.",
//             });
//         }

//         // Extract event names from the saved events
//         const eventNames = savedEvents.map(event => event.Name);

//         // Retrieve event data from both activities and itineraries collections
//         const activities = await activity.find({ Name: { $in: eventNames } });
//         const itineraries = await itinerarym.find({ Name: { $in: eventNames } });

//         // Combine the results from both collections
//         const eventData = [...activities, ...itineraries];

//         if (eventData.length === 0) {
//             return res.status(404).json({
//                 message: "No matching events found in activities or itineraries.",
//             });
//         }

//         return res.status(200).json({
//             message: "Saved events retrieved successfully.",
//             savedEvents: eventData,  // Sending back the combined event data
//         });
//     } 
//     catch (error) {
//         console.error("Error retrieving saved events:", error);
//         return res.status(500).json({
//             message: "An error occurred while retrieving saved events.",
//         });
//     }
// };


const viewSavedActivities = async (req, res) => {
    try {
        const { touristEmail } = req.body;

        // Validate input
        if (!touristEmail) {
            return res.status(400).json({
                message: "Tourist email is required to view saved activities.",
            });
        }

        // Find saved events for the given email
        const savedEvents = await saved_eventm.find({ Tourist_Email: touristEmail, TYPE: 'Activity' });

        if (savedEvents.length === 0) {
            return res.status(404).json({
                message: "No saved activities found for this tourist.",
            });
        }

        // Extract activity names from the saved events
        const activityNames = savedEvents.map(event => event.Name);

        // Retrieve activity data from the activitiesamodel
        const activityDetails = await activity.find({ Name: { $in: activityNames } });

        if (activityDetails.length === 0) {
            return res.status(404).json({
                message: "No matching activities found in the database.",
            });
        }

        // Return the retrieved activity details
        return res.status(200).json({
            message: "Saved activities retrieved successfully.",
            activities: activityDetails,
        });
    } catch (error) {
        console.error("Error retrieving saved activities:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving saved activities.",
        });
    }
};



const viewSavedItineraries = async (req, res) => {
    try {
        const { touristEmail } = req.body;

        // Validate input
        if (!touristEmail) {
            return res.status(400).json({
                message: "Tourist email is required to view saved itineraries.",
            });
        }

        // Find saved events for the given email where TYPE is 'Itinerary'
        const savedEvents = await saved_eventm.find({ Tourist_Email: touristEmail, TYPE: 'Itinerary' });

        if (savedEvents.length === 0) {
            return res.status(404).json({
                message: "No saved itineraries found for this tourist.",
            });
        }

        // Extract itinerary names from the saved events
        const itineraryNames = savedEvents.map(event => event.Name); // Use 'Name' field as itinerary names

        // Retrieve itinerary data from the itinerarym collection
        const itineraryDetails = await itinerarym.find({ Itinerary_Name: { $in: itineraryNames } });

        if (itineraryDetails.length === 0) {
            return res.status(404).json({
                message: "No matching itineraries found in the database.",
            });
        }

        // Return the retrieved itinerary details
        return res.status(200).json({
            message: "Saved itineraries retrieved successfully.",
            itineraries: itineraryDetails,
        });
    } catch (error) {
        console.error("Error retrieving saved itineraries:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving saved itineraries.",
        });
    }
};



const viewUserStats = async (req, res) => {
    try {
        // Schemas for all user types
        const schemas = [Admin, AdvertisersModel, Seller, Tourist, tour_guidem];
        // Helper function to get user statistics for each schema
        const getUserStats = async (Model) => {
            const total = await Model.countDocuments(); // Total count of users in the schema
            const byMonth = await Model.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
            ]);
            return { total, byMonth };
        };

        let totalUsers = 0;
        const monthlyStats = {};

        // Loop through schemas to calculate stats
        for (const schema of schemas) {
            const { total, byMonth } = await getUserStats(schema);
            totalUsers += total; // Aggregate total users

            // Aggregate monthly stats
            byMonth.forEach((entry) => {
                const key = `${entry._id.year}-${entry._id.month}`;
                if (!monthlyStats[key]) {
                    monthlyStats[key] = 0;
                }
                monthlyStats[key] += entry.count;
            });
        }

        // Format monthly stats for output
        const formattedMonthlyStats = Object.entries(monthlyStats).map(([key, count]) => {
            const [year, month] = key.split("-");
            return {
                year: parseInt(year),
                month: parseInt(month),
                userCount: count,
            };
        });

        // Respond with stats
        return res.status(200).json({
            message: "User statistics retrieved successfully",
            totalUsers,
            monthlyStats: formattedMonthlyStats,
        });
    } catch (error) {
        console.error("Error retrieving user statistics:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Function to send an event reminder email
const sendEventReminder = async (to, eventName, eventDate) => {
    const mailOptions = {
        from: 'rehlanotification@gmail.com', // Sender address
        to: to,                       // List of receivers
        subject: `Reminder: Upcoming Event - ${eventName}`,   // Subject line
        text: `This is a reminder for your upcoming event: ${eventName} scheduled on ${eventDate}.` // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Event reminder email sent successfully');
    } catch (error) {
        console.error('Error sending event reminder email:', error);
        throw error; // Rethrow the error to handle it in the route
    }
};

const checkAndSendRemindersforEvents = async () => {
    try {
        const now = new Date();
        const upcomingActivities = await activity.find({
            Date: {
                $gte: now,
                // Activities within the next 24 hours
                $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        for (const activity of upcomingActivities) {
            const bookedTourists = await tourist_activities.find({ Activity_Name: activity.Name });

            for (const tourist of bookedTourists) {
                await sendEventReminder(tourist.Tourist_Email, activity.Name, activity.Date);
            }
        }
    
    } catch (error) {
        console.error('Error checking and sending reminders:', error);
    }
};

const checkAndSendRemindersforItinerary = async () => {
    try {
        const now = new Date();
        const upcomingItineraries = await itinerarym.find({
            Available_Date_Time: {
                $gte: now,
                // Activities within the next 24 hours
                $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        console.log('upcomingItineraries:', upcomingItineraries);

        for (const itinerary of upcomingItineraries) {

            //console.log('itinerary:', itinerary.Itinerary_Name);
            const bookedTourists = await touristIteneraries.find({ Itinerary_Name: itinerary.Itinerary_Name });

           // console.log('bookedTourists:', bookedTourists);

            for (const tourist of bookedTourists) {
                await sendEventReminder(tourist.Tourist_Email, itinerary.Itinerary_Name, itinerary.Available_Date_Time);
            }
        }
    
    } catch (error) {
        console.error('Error checking and sending reminders:', error);
    }
};

const createBirthdayPromoCode = async (Tourist_Email) => {
    try {
        // Check if the tourist exists
        const tourist = await Tourist.findOne({ Email: Tourist_Email });
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // create a promo code for the tourist's birthday cotains tourist Username and 50% discount
        const promoCode = `${tourist.Username}HappyBirthday`;

        // Calculate the expiration date (valid for one month)
        const now = new Date();
        const expiryDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

        const newPromoCode = new promocodem({
            Code: promoCode,
            Discount: 50,
            Expiry: expiryDate,
            CreatedBy: 'System',
            type: 'Birthday',
            Tourist_Email: Tourist_Email
        });

        await newPromoCode.save();

        return promoCode;
    }catch (error) {
        console.error('Error creating birthday promo code:', error);
        return null;
    }
};

const checkandsendBirthdayPromoCode = async () => {
    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1; // Months are 0-based in JavaScript
        const todayDay = today.getDate();
        const tourists = await Tourist.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$DOB" }, todayMonth] },
                    { $eq: [{ $dayOfMonth: "$DOB" }, todayDay] }
                ]
            }
        });        console.log('tourists:', tourists);

        for (const tourist of tourists) {
            const promoCode = await createBirthdayPromoCode(tourist.Email);
            if (promoCode) {
                const mailOptions = {
                    from: 'rehlanotification@gmail.com', // Sender address
                    to: tourist.Email,                       // List of receivers
                    subject: `Happy Birthday, ${tourist.Username}!`,   // Subject line
                    text: `Happy Birthday, ${tourist.Username}! Use the promo code ${promoCode} to get 50% off on your next purchase.` // Plain text body
                };
                await transporter.sendMail(mailOptions);
            }
        }
    }catch (error) {
        console.error('Error checking and sending birthday promo codes:', error);
    }
};


const getAllSalesReportsemail = async (req, res) => {
    try {
        const { email } = req.query;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Fetch sales reports for the given email
        const salesReports = await advertiser_salesreport.find({ Email: email });

        // If no reports are found, return a 404 status
        if (!salesReports || salesReports.length === 0) {
            return res.status(404).json({ message: `No sales reports found for email '${email}'.` });
        }

        // Return the list of sales reports with a 200 status
        return res.status(200).json(salesReports);
    } catch (error) {
        // If an error occurs, catch it and return a 500 status with the error message
        console.error('Error fetching sales reports:', error.message);
        return res.status(500).json({
            error: 'Error fetching sales reports',
            details: error.message,
        });
    }
};

const getAllSalesReportsitinemail = async (req, res) => {
    try {
        const { email } = req.query;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Fetch sales reports for the given email
        const salesReports = await tourguide_salesreport.find({ Email: email });

        // If no reports are found, return a 404 status
        if (!salesReports || salesReports.length === 0) {
            return res.status(404).json({ message: `No sales reports found for email '${email}'.` });
        }

        // Return the list of sales reports with a 200 status
        return res.status(200).json(salesReports);
    } catch (error) {
        // If an error occurs, catch it and return a 500 status with the error message
        console.error('Error fetching sales reports:', error.message);
        return res.status(500).json({
            error: 'Error fetching sales reports',
            details: error.message,
        });
    }
};

const getAllSalesReportsselleremail = async (req, res) => {
    try {
        const { email } = req.query;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Fetch sales reports for the given email
        const salesReports = await seller_salesreport.find({ Email: email });

        // If no reports are found, return a 404 status
        if (!salesReports || salesReports.length === 0) {
            return res.status(404).json({ message: `No sales reports found for email '${email}'.` });
        }

        // Return the list of sales reports with a 200 status
        return res.status(200).json(salesReports);
    } catch (error) {
        // If an error occurs, catch it and return a 500 status with the error message
        console.error('Error fetching sales reports:', error.message);
        return res.status(500).json({
            error: 'Error fetching sales reports',
            details: error.message,
        });
    }
};

// Filter Advertiser Sales Report
const filterAdvertiserSalesReport = async (req, res) => {
    try {
        const { email, activity, startDate, endDate, month } = req.query;

        // Build the filter object
        let filter = { Email: email };

        if (activity) filter.Activity = activity;
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (month) {
            const startOfMonth = new Date(`${month}-01`);
            const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
            filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
        }

        // Fetch filtered sales reports
        const reports = await advertiser_salesreport.find(filter);

        // If no reports are found, return a 404 status
        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }

        // Return the filtered sales reports
        return res.status(200).json(reports);
    } catch (error) {
        console.error('Error filtering Advertiser sales reports:', error.message);
        return res.status(500).json({
            error: 'Error filtering Advertiser sales reports',
            details: error.message,
        });
    }
};


// Filter Tour Guide Sales Report
const filterTourGuideSalesReport = async (req, res) => {
    try {
        const { email, itinerary, startDate, endDate, month } = req.query;

        // Build the filter object
        let filter = { Email: email };

        if (itinerary) filter.Itinerary = itinerary;
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (month) {
            const startOfMonth = new Date(`${month}-01`);
            const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
            filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
        }

        // Fetch filtered sales reports
        const reports = await tourguide_salesreport.find(filter);

        // If no reports are found, return a 404 status
        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }

        // Return the filtered sales reports
        return res.status(200).json(reports);
    } catch (error) {
        console.error('Error filtering Tour Guide sales reports:', error.message);
        return res.status(500).json({
            error: 'Error filtering Tour Guide sales reports',
            details: error.message,
        });
    }
};

const filterSellerSalesReport = async (req, res) => {
    try {
        const { email, product, startDate, endDate, month } = req.query;

        // Build the filter object
        let filter = { Email: email };

        if (product) filter.Product = product;
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (month) {
            const startOfMonth = new Date(`${month}-01`);
            const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
            filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
        }

        // Fetch filtered sales reports
        const reports = await seller_salesreport.find(filter);

        // If no reports are found, return a 404 status
        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }

        // Return the filtered sales reports
        return res.status(200).json(reports);
    } catch (error) {
        console.error('Error filtering Seller sales reports:', error.message);
        return res.status(500).json({
            error: 'Error filtering Seller sales reports',
            details: error.message,
        });
    }
};


// ----------------- Activity Category CRUD -------------------

module.exports = { getPurchasedProducts,
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
    createPreference,
    updatePreference,
    readPreferences,
    viewAllComplaints,
    viewComplaintByEmail,
    viewAllComplaintsSortedByDate,
    filterComplaintsByStatus,
    flagActivity,
    flagItinerary,
    replyToComplaint,
    ComplaintStatus,
    ProductArchiveStatus,
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
    getPaidActivities,
    getPastPaidActivities,
    getPaidItineraries,
    getPastPaidItineraries,
    getTouristAddresses,
    viewMyCreatedMuseumsAndHistoricalPlaces,
    signIn,
    getAllCreatedByEmail,
    updateAdmin,
    updateTourism_Governer,
    redeemPoints,
    requestDeleteProfile,
    rateTourGuide,
    commentTourGuide,
    rateItinerary,
    commentOnItinerary,
    rateActivity,
    commentOnEvent,
    productRateReview,
    getMyComplaints,
    createComplaint,
    payForItinerary,
    createTouristActivity,
    payForTouristActivity,
    deleteTouristActivity,
    uploadGuestDocuments,
    gettouristprofilepic,
    gettourguideprofilepic,
    getsellerLogo,
    getadvertiserLogo,
    getproductpic,
    Itineraryactivation,
    getAttendedItineraries,
    getAttendedActivities,
    // acceptTermsTourGuide,
    // checkTermsAcceptedTourGuide,
    // acceptTermsAdvertiser,
    // checkTermsAcceptedAdvertiser,
    // acceptTermsSeller,
    // checkTermsAcceptedSeller,
    deactivateItinerary,
    activateItinerary,
    getActivitiesinItinerary,
    addActivitiesinItinerary,
    searchHotel ,
    searchFlights,
    getHotelPrice, 
    acceptTerms,
    checkTermsAccepted,
    viewMyPurchasedProducts,
    viewAllDeleteRequests,
    deleteRequest,
    createTransportation,
    bookTransportation,
    viewAllTransportation,
    getAllUnarchivedProducts,
    getAllFiles,
    getSalesReport,
    updateCartItem,
   // createCartItem,
    addToCart,
    calculateActivityRevenue,
    calculateItineraryRevenue,
    viewTouristOrders,
    checkoutOrder,
    createPromoCode,
    createwishlistItem,
    sendEmail,
    viewOrderDetails,
    cancelOrder,
    addTouristAddress,
    saveEvent,
    // viewSavedEvents,
    viewSavedActivities,
    viewSavedItineraries,
    viewMyWishlist,
    deleteProductFromMyWishList,
    addProductFromWishListToCart,
    sendPaymentReceipt,
    viewUserStats,
    sendEventReminder, 
    checkAndSendRemindersforEvents,
    checkAndSendRemindersforItinerary,
    checkandsendBirthdayPromoCode,
    getAllSalesReports,
    getAllSalesReportsitin,
    getAllSalesReportsseller,
    getAllSalesReportsemail,getAllSalesReportsitinemail,getAllSalesReportsselleremail,
    filterAdvertiserSalesReport, filterTourGuideSalesReport ,filterSellerSalesReport
};