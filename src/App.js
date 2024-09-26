// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {createUserAdmin,deleteUserAdmin,getAllProducts , getProductsSortedByRating, 
  addProduct,
  updateProduct,
  filterByPrice,
  filterByDate,} = require("./Routes/Controller");

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

// Use JSON middleware
app.use(express.json());

// Routes for Admin actions with admin access control
app.post("/addUser", createUserAdmin);  // Admins can add a user
app.delete("/deleteUser/:id", deleteUserAdmin);  // Admins can delete users
app.get("/getProducts", getAllProducts);
app.get("/getProductsSortedByRating" , getProductsSortedByRating);
app.post("/addProduct" ,addProduct);
app.put("/updateProduct" , updateProduct);
app.get("/filterByPrice/:minPrice/:maxPrice", filterByPrice);
app.get("/filterByDate/:startDate/:endDate", filterByDate);

