// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {createUserAdmin,deleteUserAdmin} = require("C:/Users/abdul/OneDrive/Desktop/Rehla/src/Routes/Controller.js");

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



console.log("Amr hena ");
