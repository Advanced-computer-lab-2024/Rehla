const Admin = require('../Models/Admin');
const Product = require('../Models/Product');
const activity = require('../Models/activitys'); 
// Creating a new Admin user or Tourism Governor
const createUserAdmin = async (req, res) => {
    try {
        const { Username, Password, Email, Type } = req.body;

        if (!Username || !Password || !Email || !Type) {
            return res.status(400).json({ error: 'All fields are required.' });
          }

        const admin = new Admin({
            Username,
            Email,
            Password, 
            Type
        });

        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        console.error(error); // Log the error for more details
        res.status(500).json({ error: 'Error creating user', details: error });
    }
};


// Deleting an Admin user
const deleteUserAdmin = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the user by ID and delete it
        const deletedUser = await Admin.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user', details: error });
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
  


  const getProductsSortedByRating = async (req, res) => {
    try {
      // Fetch all products and sort by Rating in descending order (-1)
      const products = await products.find().sort({ Rating: -1 });
  
      // Return the sorted list of products
      res.status(200).json({ message: 'Products sorted by rating', products: products });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
  };

  const addProduct = async (req, res) => {
    try {
      // Destructure product attributes from the request body
      const { Product_Name, Picture, Price, Quantity, Seller_Name, Description, Rating, Reviews } = req.body;
  
      // Check if the Picture is provided in the request body
      if (!Picture) {
        return res.status(400).json({ message: "Error: 'Picture' field is required." });
      }
  
      // Create a new product instance using the product model
      const newProduct = new product({
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

  const updateProduct = async (req, res) => {
    try {
      // Destructure Product_Name from the request body
      const { Product_Name, picture, Price, Description, Seller_Name, Rating, Reviews, Quantity } = req.body;
  
      // Create an object to hold only the fields that are provided (not undefined)
      const updateFields = {};
      if (picture) updateFields.picture = picture;
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
      const updatedProduct = await product.findOneAndUpdate(
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

  const filterByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.params;

        // Ensure minPrice and maxPrice are valid numbers
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        // Check if either min or max is NaN
        if ((minPrice && isNaN(min)) || (maxPrice && isNaN(max))) {
            return res.status(400).json({ message: 'Invalid price parameters' });
        }

        // Create a price filter object
        const priceFilter = {};
        if (minPrice) priceFilter.$gte = min; // Greater than or equal to minPrice
        if (maxPrice) priceFilter.$lte = max; // Less than or equal to maxPrice

        // Construct the filter only if priceFilter is not empty
        const filter = Object.keys(priceFilter).length ? { Price: priceFilter } : {};

        // Find and return activities based on price filter
        const activities = await activity.find(filter).sort({ Date: 1, Rating: -1 });
        res.status(200).json({
            message: 'Filtered activities by price',
            activities
        });
    } catch (error) {
        res.status(500).json({ message: 'Error filtering activities by price', error: error.message });
    }
};

const filterByDate = async (req, res) => {
  try {
      const { startDate, endDate } = req.params;

      // Convert startDate and endDate strings into JavaScript Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate that the dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({ message: 'Invalid date format' });
      }

      // Set the end date to the end of the day if you want to include activities from the whole endDate
      end.setHours(23, 59, 59, 999);

      // Define the filter to match the date range
      const dateFilter = {
          Date: {
              $gte: start, // Greater than or equal to the start date
              $lte: end    // Less than or equal to the end date
          }
      };

      // Find the activities that match the date range
      const activities = await activity.find(dateFilter).sort({ Date: 1 });

      // Return the filtered activities
      res.status(200).json({
          message: 'Filtered activities by date',
          activities
      });
  } catch (error) {
      res.status(500).json({ message: 'Error filtering activities by date', error: error.message });
  }
};

// ----------------- Activity Category CRUD ------------------


module.exports = { 
    createUserAdmin, 
    deleteUserAdmin,
    getAllProducts ,
    getProductsSortedByRating, 
    addProduct,
    updateProduct,
    filterByPrice,
    filterByDate, 
};
