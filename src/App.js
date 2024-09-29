// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
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
  createActivityCategory,
  registerTourist,
  registerRequest,
  searchByNameCategoryTag,
  getProductsSortedByRating, 
  addProduct,
  updateProduct,
  filterByPrice,
  filterByDate,filterByRating,
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
  filterByCategory,
  getItineraryByName,
  createMuseum,
  readMuseum,
  updateItinerary,
  deleteItinerary

} = require("./Routes/Controller");

const MongoURI = process.env.MONGO_URI;

// App variables
const app = express();
const port = process.env.PORT || "8000";

// MongoDB connection
mongoose.connect(MongoURI)
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
app.post("/addCategory",createActivityCategory);
app.post("/registerTourist",registerTourist);
app.post("/registerRequest",registerRequest);
app.get("/searchByNameCategoryTag",searchByNameCategoryTag);
app.get("/getProductsSortedByRating" , getProductsSortedByRating); //Tourist-Admin-Seller :sort products by rating 
app.post("/addProduct" ,addProduct); //Admin - Seller : add a new product
app.put("/updateProduct" , updateProduct);//Admin - Seller : edit products 
app.get("/filterByPrice/:minPrice/:maxPrice", filterByPrice); //Tourist - Guest : Filter activities 
app.get("/filterByDate/:startDate/:endDate", filterByDate);//Tourist - Guest : Filter activities 
app.get("/filterByRating/:rating", filterByRating);//Tourist - Guest : Filter activities 
app.get("/getTouristProfile", getTouristProfile); //Tourist : view my profile 
app.put("/updateTouristProfile" , updateTouristProfile); //Tourist : update my profile 
app.post("/createSellerProfile", createSellerProfile); //Seller : createSellerProfile 
app.get("/getSellerProfile", getSellerProfile);//Seller : get seller profile 
app.put("/updateSellerProfile" , updateSellerProfile);//Seller : update seller profile 
app.post("/createTourGuideProfile",createTourGuideProfile);//Tour Guide: createTourGuideProfile
app.put("/updateTourGuideProfile" , updateTourGuideProfile );//Tour Guide: updateTourGuideProfile 
app.get("/getTourGuideProfile", getTourGuideProfile);//Tour Guide: getTourGuideProfile
app.post("/createItinerary" , createItinerary);//tour Guide : Create itinerary 
app.get("/getItineraryByName", getItineraryByName);//getItineraryByName
app.put("/updateItinerary" , updateItinerary);//updateItinerary
app.delete("/deleteItinerary", deleteItinerary);//deleteItinerary


app.post("/addUserAdvertisers", createUserAdvertiser);  // Advertiser request
app.post("/readAdvertisers", readAdvertiser); // Route for reading an advertiser by email
app.put("/updateUserAdvertisers", updateUserAdvertiser); //updating advertiser

app.post("/createActivityByAdvert", createActivityByAdvertiser);
app.post("/readActivity", readActivity);
app.put("/updateActivity", updateActivityByAdvertiser);
app.delete("/deleteActivityByAdvert", deleteActivityByAdvertiser);



app.post("/createUserTourism_Governer", createUserTourism_Governer);
app.delete("/deleteUserTourism_Governer", deleteUserTourism_Governer);
app.get("/filterByCategory", filterByCategory);

app.post("/creatingMuseum",createMuseum);
app.post("/readMuseum",readMuseum);