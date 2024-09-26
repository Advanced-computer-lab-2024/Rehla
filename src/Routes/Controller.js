const Admin = require('C:/Users/abdul/OneDrive/Documents/GitHub/Rehla/src/Models/Admin.js');
const Product = require('C:/Users/abdul/OneDrive/Documents/GitHub/Rehla/src/Models/Product.js');

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
  


// ----------------- Activity Category CRUD ------------------


module.exports = { 
    createUserAdmin, 
    deleteUserAdmin,
    getAllProducts  
};
