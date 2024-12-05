// External variables
const express = require("express");
const cron = require('node-cron');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
require("dotenv").config();

const {createUserAdmin,
  deleteUserAdmin,
  getAllProducts , 
  getAllProductstourist,
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
  checkoutOrder,
  viewOrders,
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
  getPaidActivities,
  getPastPaidActivities,
  getPaidItineraries,
  getPastPaidItineraries,
  getTotalTouristsReport,
  getTotalTouristsReportTourGuide,
  getTouristAddresses,
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
  gettourguideprofilepic,
  getsellerLogo,
  getadvertiserLogo,
  getproductpic,
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
  createTransportation,
  bookTransportation,
  viewAllTransportation,
  getAllUnarchivedProducts,
  getAllFiles,
  getSalesReport,
  getAllSalesReportsseller,
  updateCartItem,
 // createCartItem,
  addToCart,
  calculateActivityRevenue,
  getAllSalesReports,
  calculateItineraryRevenue,
  getAllSalesReportsitin,
  viewOrderDetails,
  createPromoCode,
  createwishlistItem,
  sendEmail,
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
  checkAndSendRemindersforEvents,
  checkAndSendRemindersforItinerary,
  checkandsendBirthdayPromoCode,
  getAllSalesReportsemail,getAllSalesReportsitinemail,getAllSalesReportsselleremail,
  filterAdvertiserSalesReport,filterTourGuideSalesReport,filterSellerSalesReport,
  filterSellerSalesReportad,
  viewmyproducts,
  generateOTP,
  getNotifications,
  markAsSeen,
  createNotification,
  getAllNotifications,
  testNotification,
  requestNotificationForEvent,
  notifyForAvailableBookings,
  viewTotalAttendees,
  notifyForFlaggedActivities,
  getNotificationsForTourGuide,
  markAsSeenn,
  markAsSeennt,
  notifyForFlaggedItins,
  getNotificationsForTourGuidet,
  remindUpcomingPaidActivities
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
app.get("/getAllProductstourist", getAllProductstourist); //
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
app.put("/ComplaintStatus/:email/:title",ComplaintStatus);
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

app.post("/createActivityByAdvert", createActivityByAdvertiser);
app.get("/readActivity/:name", readActivity);
app.put("/updateActivity", updateActivityByAdvertiser);
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
app.get('/getPaidActivities/:email', getPaidActivities);
app.get('/getPastPaidActivities/:email', getPastPaidActivities);
app.get("/getPaidItineraries/:email", getPaidItineraries);
app.get('/getPastPaidItineraries/:email', getPastPaidItineraries);
app.get('/getTotalTouristsReport/:email',getTotalTouristsReport);
app.get('/getTotalTouristsReportTourGuide/:email',getTotalTouristsReportTourGuide);
app.get('/getTouristAddresses/:email', getTouristAddresses);
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
app.post("/getproductpic", getproductpic);
app.post("/gettourguideprofilepic", gettourguideprofilepic);
app.post("/getsellerLogo", getsellerLogo);
app.post("/getadvertiserLogo", getadvertiserLogo);



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
app.post("/createTransportation", createTransportation);
app.post("/bookTransportation", bookTransportation);
app.get("/viewAllTransportation", viewAllTransportation);
app.get("/getAllUnarchivedProducts", getAllUnarchivedProducts);
app.get('/getAllFiles', getAllFiles);
app.post('/salesReport/:sellerName', getSalesReport);
app.get('/getAllSalesReportsseller', getAllSalesReportsseller)
app.put('/updateCartItem', updateCartItem);
//app.post('/createCartItem', createCartItem);
app.post('/addToCart', addToCart);
app.post('/calculateActivityRevenue', calculateActivityRevenue);
app.get('/advertiser_salesreport', getAllSalesReports);
app.post('/calculateItineraryRevenue', calculateItineraryRevenue);
app.get('/getAllSalesReportsitin', getAllSalesReportsitin);
app.post('/checkout-order', checkoutOrder);
app.post('/view-orders', viewOrders);
app.post('/createPromoCode', createPromoCode);
app.post('/createwishlistItem', createwishlistItem);
app.post('/view-order-details', viewOrderDetails);

app.get('/advertiser_salesreportemail', getAllSalesReportsemail); // Takes ?email=<email>
app.get('/getAllSalesReportsitinemail', getAllSalesReportsitinemail); // Takes ?email=<email>
app.get('/getAllSalesReportsselleremail', getAllSalesReportsselleremail); // Takes ?email=<email>
app.get('/filterAdvertiserSalesReport', filterAdvertiserSalesReport);
app.get('/filterTourGuideSalesReport', filterTourGuideSalesReport);
app.get('/filterSellerSalesReport', filterSellerSalesReport);
app.get('/filterSellerSalesReportad', filterSellerSalesReportad);
app.post('/viewmyproducts', viewmyproducts);
app.get('/generate-otp', generateOTP);

app.get('/getNotifications',getNotifications);
app.post('/markAsSeen',markAsSeen);
app.post('/markAsSeenn',markAsSeenn);
app.post('/markAsSeennt',markAsSeennt);


app.post('/createNotification',createNotification);
app.get('/getAllNotifications',getAllNotifications);
app.post('/testNotification',testNotification);

app.post('/requestNotificationForEvent', requestNotificationForEvent);

app.post('/notifyForAvailableBookings',notifyForAvailableBookings);
app.get('/view-report', viewTotalAttendees);

app.post('/notifyForFlaggedActivities',notifyForFlaggedActivities)
app.get('/getNotificationsForTourGuide/:email', getNotificationsForTourGuide);

app.post('/notifyForFlaggedItins',notifyForFlaggedItins)
app.get('/getNotificationsForTourGuidet/:email', getNotificationsForTourGuidet);

app.post('/remindUpcomingPaidActivities', remindUpcomingPaidActivities);




app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to) {
      return res.status(400).json({ error: 'Recipient email address is required' });
  }
  try {
      await sendEmail(to, subject, text);
      res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error sending email', details: error.message });
  }
});

app.delete('/cancelOrder',cancelOrder);
app.post('/addTouristAddress',addTouristAddress);
app.post('/saveEvent', saveEvent);
// app.post('/viewSavedEvents', viewSavedEvents);
app.post('/viewSavedActivities', viewSavedActivities);
app.post('/viewSavedItineraries', viewSavedItineraries);
app.get('/viewMyWishlist/:mail', viewMyWishlist);
app.delete('/deleteProductFromMyWishList/:mail/:productname', deleteProductFromMyWishList);
// Endpoint to handle payment and send receipt
app.post('/send-payment-receipt', async (req, res) => {
  const { to, amount, eventName } = req.body;
  if (!to || !amount || !eventName) {
      return res.status(400).json({ error: 'Recipient email address, payment amount, and event/itinerary name are required' });
  }
  try {
      await sendPaymentReceipt(to, amount, eventName);
      res.status(200).json({ message: 'Payment receipt email sent successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error sending payment receipt email', details: error.message });
  }
});
app.post('/addProductFromWishListToCart/:mail/:productName', addProductFromWishListToCart); // Route for adding an item to the cart
app.get ('/viewUserStats',viewUserStats);

// Schedule the checkAndSendReminders function to run every 30 seconds

cron.schedule('*/30 * * * * *', async () => {
  console.log('Running scheduled task to check and send reminders');
  //await checkAndSendRemindersforEvents();
  //await checkAndSendRemindersforItinerary();
  await checkandsendBirthdayPromoCode();
});
