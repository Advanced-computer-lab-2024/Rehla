// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
require("dotenv").config();

const {createUserAdmin,
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
  updateItinerary,
  deleteItinerary,getAllUpcomingEventsAndPlaces,
  creatTouristItenrary,
  filterActivities,
  deleteTouristItenrary,
  updateTouristItenrary,
  getBookedItineraries,
  viewMyCreatedActivities,
  createHistoricalTag,
  viewMyCreatedItenrary,
  viewMyCreatedMuseumsAndHistoricalPlaces, signIn,
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
  Itineraryactivation,
  getAttendedItineraries,
  getAttendedActivities,
  getPurchasedProducts,
  acceptTermsTourGuide,
  checkTermsAcceptedTourGuide,
  acceptTermsAdvertiser, 
  checkTermsAcceptedAdvertiser,
  acceptTermsSeller,
  checkTermsAcceptedSeller,
  deactivateItinerary,
  activateItinerary,
  getActivitiesinItinerary,
  addActivitiesinItinerary,
  searchHotel,searchFlights,
  getHotelPrice,acceptTerms,
  checkTermsAccepted,
  viewMyPurchasedProducts,
  viewAllDeleteRequests,
  deleteRequest,
} = require("./Routes/Controller");

const MongoURI = process.env.MONGO_URI;

// App variables
const app = express();
const port = process.env.PORT || "8000";
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect("mongodb+srv://Rehla:Rehla2024@rehla.35b5h.mongodb.net/REHLA?retryWrites=true&w=majority&appName=Rehla")
.then(() => {
  console.log("MongoDB is now connected!");
  // Starting server
  app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });
})
.catch(err => console.log(err));

// Routes
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

//testtttttt

// Use JSON middleware
app.use(express.json());

// Routes for Admin actions with admin access control
app.post("/addUser", createUserAdmin);  // Admins can add a user
app.delete("/deleteUser/:email", deleteUserAdmin);  // Admins can delete users
app.get("/getProducts", getAllProducts); //
app.get("/getProductByName/:productName", searchProductByName);
app.get("/filterProductsByPrice/:minPrice/:maxPrice", filterProductByPrice); // Filter products based on price range
app.get("/sortActivities", sortActivities); // Route for sorting activities
app.get("/sortItineraries", sortItineraries);
app.get('/filter/:category/:value', filterPlacesAndMuseums);
app.get("/filterItineraries", filterItineraries);
app.get('/requests', viewAllRequests);
app.post('/processRequest/:email', processRequestByEmail);
app.post("/registerTourist",registerTourist);
app.post("/registerRequest",registerRequest);
app.post("/addCategory",createActivityCategory);
app.get("/getCategory",readActivityCategories);
app.put("/updateCategory/:currentName",updateActivityCategory);
app.delete("/deleteCategory",deleteActivityCategory);
app.post("/addTag",createPreferenceTag);
app.get("/getTag",readPreferenceTag);
app.put("/updateTag/:currentName",updatePreferenceTag);
app.delete("/deleteTag",deletePreferenceTag);
app.get("/searchByNameCategoryTag",searchByNameCategoryTag);
app.post("/createPreference", createPreference); // Create a new preference
app.get("/readPreferences/:email", readPreferences); // Get preferences by email
app.put("/updatePreference/:email", updatePreference); // Update a preference by email
app.get("/viewComplaints", viewAllComplaints);
app.get("/viewComplaint/:email", viewComplaintByEmail);
app.get("/viewAllComplaintsSortedByDate", viewAllComplaintsSortedByDate);
app.get("/filterComplaintsByStatus/:status", filterComplaintsByStatus);
app.put("/flagActivity/:name", flagActivity);      
app.put("/flagItinerary/:name", flagItinerary); 
app.put("/replyComplaint/:email", replyToComplaint);
app.put("/ComplaintStatus/:email",ComplaintStatus);
app.put("/ArchiveProduct/:productName", ProductArchiveStatus);
app.get("/getProductsSortedByRating" , getProductsSortedByRating); //Tourist-Admin-Seller :sort products by rating 
app.post("/addProduct" ,addProduct); //Admin - Seller : add a new product
app.put("/updateProduct" , updateProduct);//Admin - Seller : edit products 
app.post("/getTouristProfile", getTouristProfile); //Tourist : view my profile 
app.put("/updateTouristProfile" , updateTouristProfile); //Tourist : update my profile 
app.post("/createSellerProfile", createSellerProfile); //Seller : createSellerProfile 
app.post("/getSellerProfile", getSellerProfile);//Seller : get seller profile 
app.put("/updateSellerProfile" , updateSellerProfile);//Seller : update seller profile 
app.post("/createTourGuideProfile",createTourGuideProfile);//Tour Guide: createTourGuideProfile
app.put("/updateTourGuideProfile" , updateTourGuideProfile );//Tour Guide: updateTourGuideProfile 
app.post("/getTourGuideProfile", getTourGuideProfile);//Tour Guide: getTourGuideProfile
app.post("/createItinerary" , createItinerary);//tour Guide : Create itinerary 
app.get("/getItineraryByName/:itineraryName", getItineraryByName);//getItineraryByName
app.put("/updateItinerary" , updateItinerary);//updateItinerary
app.delete("/deleteItinerary", deleteItinerary);//deleteItinerary
app.get("/getAllUpcomingEventsAndPlaces", getAllUpcomingEventsAndPlaces);

app.post("/addUserAdvertisers", createUserAdvertiser);  // Advertiser request
app.post("/readAdvertisers", readAdvertiser); // Route for reading an advertiser by email
app.put("/updateUserAdvertisers", updateUserAdvertiser); //updating advertiser

app.post("/api/createActivityByAdvert", createActivityByAdvertiser);
app.get("/readActivity/:name", readActivity);
app.put("/api/updateActivity", updateActivityByAdvertiser);
app.delete("/deleteActivityByAdvert", deleteActivityByAdvertiser);

app.post("/createUserTourism_Governer", createUserTourism_Governer);
app.delete("/deleteUserTourism_Governer", deleteUserTourism_Governer);

app.post("/creatingMuseum",createMuseum);
app.post("/readMuseum",readMuseum);
app.post("/createHistoricalPlace",createHistoricalPlace);
app.post("/readHistoricalPlace",readHistoricalPlace);
app.put("/updateMuseum",updateMuseum);
app.put("/updateHistoricalPlace",updateHistoricalPlace);
app.delete("/deleteMuseum",deleteMuseum);
app.delete("/deleteHistoricalPlace",deleteHistoricalPlace);
app.post("/creatTouristItenrary",creatTouristItenrary);
app.get("/filterActivities",filterActivities);
app.delete("/deleteTouristItenrary",deleteTouristItenrary);
app.put("/updateTouristItenrary",updateTouristItenrary);
app.get("/getBookedItineraries",getBookedItineraries);
app.get("/viewMyCreatedActivities", viewMyCreatedActivities);
app.post("/createHistoricalTag", createHistoricalTag);
app.get("/viewMyCreatedItenrary", viewMyCreatedItenrary);
app.get("/viewMyCreatedMuseumsAndHistoricalPlaces", viewMyCreatedMuseumsAndHistoricalPlaces);
app.post("/signIn" , signIn)
app.get('/getAllCreatedByEmail/:email', getAllCreatedByEmail);
app.put("/updateAdmin", updateAdmin);
app.put("/updateTourism_Governer", updateTourism_Governer);
app.put("/redeemPoints", redeemPoints);
app.post("/requestDeleteProfile", requestDeleteProfile);
app.post("/rateTourGuide", rateTourGuide);
app.post("/commentTourGuide", commentTourGuide);
app.post('/rateItinerary', rateItinerary);
app.post("/commentOnItinerary", commentOnItinerary);
app.post("/rateActivity", rateActivity);
app.post("/commentOnEvent", commentOnEvent);
app.put("/productRateReview" , productRateReview);

app.post("/getMyComplaints" ,getMyComplaints);
app.post("/createComplaint", createComplaint);
app.put("/payForItinerary",payForItinerary);
app.post("/createTouristActivity",createTouristActivity);
app.put("/payForTouristActivity",payForTouristActivity);
app.delete("/deleteTouristActivity",deleteTouristActivity);
app.post("/uploadGuestDocuments", uploadGuestDocuments);
app.post("/gettouristprofilepic", gettouristprofilepic);
app.put("/Itineraryactivation", Itineraryactivation);
app.post("/getAttendedItineraries",getAttendedItineraries);
app.post("/getAttendedActivities" ,getAttendedActivities);
app.get("/getPurchasedProducts" , getPurchasedProducts);

// app.put("/acceptTermsTourGuide", acceptTermsTourGuide);
// app.get("/checkTermsAcceptedTourGuide" , checkTermsAcceptedTourGuide);
// app.put("/acceptTermsAdvertiser", acceptTermsAdvertiser);
// app.get("/checkTermsAcceptedAdvertiser" ,checkTermsAcceptedAdvertiser);
// app.put("/acceptTermsSeller", acceptTermsSeller);
// app.get("/checkTermsAcceptedSeller" ,checkTermsAcceptedSeller);
app.put("/acceptTerms", acceptTerms);
app.get("/checkTermsAccepted" , checkTermsAccepted);
app.put("/deactivateItinerary",deactivateItinerary);
app.put("/activateItinerary",activateItinerary);
app.get("/getActivitiesinItinerary",getActivitiesinItinerary);
app.post("/addActivitiesinItinerary",addActivitiesinItinerary);
app.post("/searchHotel" ,searchHotel);
app.post("/searchFlights" , searchFlights);
app.get("/getHotelPrice" , getHotelPrice);
// app.post("/bookFlight" ,bookFlight);
app.post("/viewMyPurchasedProducts", viewMyPurchasedProducts);
app.get("/viewDeleteRequests", viewAllDeleteRequests);
app.delete("/deleteRequest", deleteRequest);
