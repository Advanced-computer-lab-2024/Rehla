import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    deleteUserAdmin, 
    createUserAdmin, 
    createActivityCategory, 
    readActivityCategories, 
    updateActivityCategory, 
    deleteActivityCategory, 
    createPreferenceTag, 
    readPreferenceTags, 
    updatePreferenceTag, 
    deletePreferenceTag,
    updateProduct,
    viewAllRequests, 
    processRequestByEmail,
    fetchComplaints, processComplaintByEmail,
    viewAllComplaints ,
    viewComplaintByEmail
    
} from '../services/api'; // Import all API functions
import '../css/Home.css';
import logo from '../images/logo.png';

const AdminHome = () => {
    const [email, setEmail] = useState(''); // For deleting user
    const [username, setUsername] = useState(''); // For creating user
    const [newEmail, setNewEmail] = useState(''); // For creating user
    const [password, setPassword] = useState(''); // For creating user
    const [type, setType] = useState(''); // For creating user
    const [message, setMessage] = useState(''); // For success/error messages

    const [categories, setCategories] = useState([]); // To store fetched categories
    const [categoryName, setCategoryName] = useState(''); // For adding new category
    const [newCategoryName, setNewCategoryName] = useState(''); // For updating category
    const [currentCategory, setCurrentCategory] = useState(''); // To track which category to update/delete

    const [tags, setTags] = useState([]); // To store fetched preference tags
    const [tagName, setTagName] = useState(''); // For adding new tag
    const [newTagName, setNewTagName] = useState(''); // For updating tag
    const [currentTagName, setCurrentTagName] = useState(''); // To track which tag to update/delete

    const [productName, setProductName] = useState(''); // For the product name
    const [picture, setPicture] = useState(''); // For product picture
    const [price, setPrice] = useState(''); // For product price
    const [description, setDescription] = useState(''); // For product description
    const [sellerName, setSellerName] = useState(''); // For seller name
    const [rating, setRating] = useState(''); // For product rating
    const [reviews, setReviews] = useState(''); // For product reviews
    const [quantity, setQuantity] = useState(''); // For product quantity
    const [updateMessage, setUpdateMessage] = useState(''); // For update success/error messages

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequests, setShowRequests] = useState(false); // To toggle requests visibility


    const [loadingg, setLoadingg] = useState(false); // Renamed loading state
    const [errorr, setErrorr] = useState(null); // Renamed error state
    const [complaints, setComplaints] = useState([]);
    const [showComplaints, setShowComplaints] = useState(false); // State to control showing complaints


    const [complaintsList, setComplaintsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showComplaintss, setShowComplaintss] = useState(false);
    const [emailInput, setEmailInput] = useState('');


    // Fetch activity categories and preference tags on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await readActivityCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchTags = async () => {
            try {
                const data = await readPreferenceTags();
                setTags(data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchCategories();
        fetchTags(); // Fetch preference tags on component mount
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
          const data = await viewAllRequests();
          setRequests(data);
          setShowRequests(true); // Show requests when fetched
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      const handleProcessRequest = async (email) => {
        try {
          const processedRequest = await processRequestByEmail(email);
          alert('Request processed successfully: ' + processedRequest.Username);
          // Optionally, refresh the list of requests after processing
          setRequests(requests.filter((req) => req.Email !== email));
        } catch (error) {
          console.error('Error processing request:', error);
          alert('Failed to process the request.');
        }
      };  

    // Handle delete user request
    const handleDeleteUser = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const data = await deleteUserAdmin(email);
            setMessage(data.message);
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle create user request
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage('');
        const userData = {
            Username: username,
            Email: newEmail,
            Password: password,
            Type: type,
        };

        try {
            const response = await createUserAdmin(userData);
            setMessage(`User ${response.Username} created successfully!`);
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle create category request
    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await createActivityCategory({ Name: categoryName });
            setMessage(`Category ${response.Name} created successfully!`);
            setCategories([...categories, response]); // Add the new category to the list
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle update category request
    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await updateActivityCategory(currentCategory, { newName: newCategoryName });
            setMessage(`Category ${response.data.Name} updated successfully!`);
            setCategories(categories.map(cat => cat.Name === currentCategory ? response.data : cat)); // Update the category in the list
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle delete category request
    const handleDeleteCategory = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await deleteActivityCategory({ Name: currentCategory });
            setMessage(response.message);
            setCategories(categories.filter(cat => cat.Name !== currentCategory)); // Remove the deleted category from the list
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle create preference tag request
    const handleCreateTag = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await createPreferenceTag({ Name: tagName });
            setMessage(`Tag ${response.Name} created successfully!`);
            setTags([...tags, response]); // Add the new tag to the list
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle update preference tag request
    const handleUpdateTag = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await updatePreferenceTag(currentTagName, { newName: newTagName });
            setMessage(`Tag ${response.data.Name} updated successfully!`);
            setTags(tags.map(tag => tag.Name === currentTagName ? response.data : tag)); // Update the tag in the list
        } catch (error) {
            setMessage(error);
        }
    };

    // Handle delete preference tag request
    const handleDeleteTag = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await deletePreferenceTag({ Name: currentTagName });
            setMessage(response.message);
            setTags(tags.filter(tag => tag.Name !== currentTagName)); // Remove the deleted tag from the list
        } catch (error) {
            setMessage(error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setUpdateMessage(''); // Reset message
    
        const productData = {
            Product_Name: productName,
            Picture: picture,
            Price: price,
            Description: description,
            Seller_Name: sellerName,
            Rating: rating,
            Reviews: reviews,
            Quantity: quantity,
        };
    
        try {
            const response = await updateProduct(productData); // Call your update product function
            setUpdateMessage(`Product ${response.product.Product_Name} updated successfully!`);
        } catch (error) {
            setUpdateMessage(error.message);
        }
    };

    const fetchComplaints = async () => {
        setLoading(true); // Set loading state to true
        try {
            const complaintsData = await viewAllComplaints(); // Use viewAllComplaints
            setComplaints(complaintsData); // Set the fetched complaints to state
            setShowComplaints(true); // Show the complaints list
        } catch (error) {
            setError('Error fetching complaints.'); // Set error state
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false); // Set loading state to false after fetch
        }
    };
    
    
    // const handleProcessComplaint = async (email) => {
    //     try {
    //         const processedComplaint = await processComplaintByEmail(email);
    //         alert('Complaint processed successfully: ' + processedComplaint.Title); // Assuming it has a Title
    //         // Optionally refresh the list
    //         setComplaints(complaints.filter((complaint) => complaint.Tourist_Email !== email));
    //     } catch (error) {
    //         console.error('Error processing complaint:', error);
    //         alert('Failed to process the complaint.');
    //     }
    // };

    
    // Function to fetch a specific complaint by email
    const handleFetchComplaintByEmail = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const complaintData = await viewComplaintByEmail(emailInput);
            if (complaintData.length === 0) {
                alert('No complaints found for this email.');
            } else {
                alert('Complaint fetched successfully: ' + JSON.stringify(complaintData));
                // Optionally update state to display the fetched complaint
            }
        } catch (err) {
            setErrorMessage('Error fetching complaint by email.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to process a complaint by email
    const handleProcessComplaint = async (email) => {
        try {
            const processedComplaint = await processComplaintByEmail(email);
            alert('Complaint processed successfully: ' + processedComplaint.Title);
            // Optionally, refresh the list of complaints after processing
            setComplaintsList(complaintsList.filter((complaint) => complaint.Tourist_Email !== email));
        } catch (error) {
            console.error('Error processing complaint:', error);
            alert('Failed to process the complaint.');
        }
    };

 


    return (
        <div>
           <div className="NavBar">
               <img src={logo} alt="logo" />
               <nav className="main-nav">
                   <ul className="nav-links">
                       <Link to="/">Home</Link>
                       <Link to="/Adminproducts">Products</Link>
                   </ul>
               </nav>
           </div>
           <br />
           <br></br>
           <br></br>
            <br></br>
           <div>
                <h1>Admin Home</h1>

                {/* Button to fetch and view requests */}
                <button onClick={fetchRequests}>View All Requests</button>

                {/* Loading indicator */}
                {loading && <p>Loading requests...</p>}

                {/* Error handling */}
                {error && <p>Error: {error}</p>}

                {/* Display the list of requests if they are loaded and the user clicked to view them */}
                {showRequests && requests.length === 0 && !loading && <p>No requests available.</p>}

                {showRequests && requests.length > 0 && (
                    <ul>
                    {requests.map((request) => (
                        <li key={request._id}>
                        <p>Username: {request.Username}</p>
                        <p>Email: {request.Email}</p>
                        <p>Type: {request.Type}</p>
                        <button onClick={() => handleProcessRequest(request.Email)}>
                            Process Request
                        </button>
                        </li>
                    ))}
                    </ul>
                )}
                </div>

           {/* Form for deleting a user */}
           <div className="admin-actions">
               <h2>Delete User</h2>
               <form onSubmit={handleDeleteUser}>
                   <label htmlFor="email">Enter Email of User to Delete:</label>
                   <input
                       type="email"
                       id="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                   />
                   <button type="submit">Delete User</button>
               </form>
               {message && <p>{message}</p>}
           </div>

           <br />

           {/* Form for creating a new user */}
           <div className="admin-actions">
               <h2>Create New User (Admin or Tourism Governor)</h2>
               <form onSubmit={handleCreateUser}>
                   <label>Username:</label>
                   <input
                       type="text"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required
                   />
                   <label>Email:</label>
                   <input
                       type="email"
                       value={newEmail}
                       onChange={(e) => setNewEmail(e.target.value)}
                       required
                   />
                   <label>Password:</label>
                   <input
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                   />
                   <label>Type:</label>
                   <select
                       value={type}
                       onChange={(e) => setType(e.target.value)}
                       required
                   >
                       <option value="">Select Type</option>
                       <option value="Admin">Admin</option>
                       <option value="Tourism Governor">Tourism Governor</option>
                   </select>
                   <button type="submit">Create User</button>
               </form>
               {message && <p>{message}</p>}
           </div>

           <br />

           {/* Activity Categories Management */}
           <div className="admin-actions">
               <h2>Manage Activity Categories</h2>

               {/* Form for adding new category */}
               <form onSubmit={handleCreateCategory}>
                   <label>Category Name:</label>
                   <input
                       type="text"
                       value={categoryName}
                       onChange={(e) => setCategoryName(e.target.value)}
                       required
                   />
                   <button type="submit">Add Category</button>
               </form>

               <br />

               {/* Form for updating category */}
               <form onSubmit={handleUpdateCategory}>
                   <label>Current Category Name:</label>
                   <select
                       value={currentCategory}
                       onChange={(e) => setCurrentCategory(e.target.value)}
                       required
                   >
                       <option value="">Select Category</option>
                       {categories.map((cat) => (
                           <option key={cat._id} value={cat.Name}>
                               {cat.Name}
                           </option>
                       ))}
                   </select>
                   <label>New Category Name:</label>
                   <input
                       type="text"
                       value={newCategoryName}
                       onChange={(e) => setNewCategoryName(e.target.value)}
                       required
                   />
                   <button type="submit">Update Category</button>
               </form>

               <br />

               {/* Form for deleting category */}
               <form onSubmit={handleDeleteCategory}>
                   <label>Delete Category:</label>
                   <select
                       value={currentCategory}
                       onChange={(e) => setCurrentCategory(e.target.value)}
                       required
                   >
                       <option value="">Select Category</option>
                       {categories.map((cat) => (
                           <option key={cat._id} value={cat.Name}>
                               {cat.Name}
                           </option>
                       ))}
                   </select>
                   <button type="submit">Delete Category</button>
               </form>
           </div>

           <br />

           {/* Preference Tags Management */}
           <div className="admin-actions">
               <h2>Manage Preference Tags</h2>

               {/* Form for adding new tag */}
               <form onSubmit={handleCreateTag}>
                   <label>Tag Name:</label>
                   <input
                       type="text"
                       value={tagName}
                       onChange={(e) => setTagName(e.target.value)}
                       required
                   />
                   <button type="submit">Add Tag</button>
               </form>

               <br />

               {/* Form for updating tag */}
               <form onSubmit={handleUpdateTag}>
                   <label>Current Tag Name:</label>
                   <select
                       value={currentTagName}
                       onChange={(e) => setCurrentTagName(e.target.value)}
                       required
                   >
                       <option value="">Select Tag</option>
                       {tags.map((tag) => (
                           <option key={tag._id} value={tag.Name}>
                               {tag.Name}
                           </option>
                       ))}
                   </select>
                   <label>New Tag Name:</label>
                   <input
                       type="text"
                       value={newTagName}
                       onChange={(e) => setNewTagName(e.target.value)}
                       required
                   />
                   <button type="submit">Update Tag</button>
               </form>

               <br />

               {/* Form for deleting tag */}
               <form onSubmit={handleDeleteTag}>
                   <label>Delete Tag:</label>
                   <select
                       value={currentTagName}
                       onChange={(e) => setCurrentTagName(e.target.value)}
                       required
                   >
                       <option value="">Select Tag</option>
                       {tags.map((tag) => (
                           <option key={tag._id} value={tag.Name}>
                               {tag.Name}
                           </option>
                       ))}
                   </select>
                   <button type="submit">Delete Tag</button>
               </form>
           </div>
           <br />

            {/* Form for updating a product */}
            <div className="admin-actions">
                <h2>Update Product</h2>
                <form onSubmit={handleUpdateProduct}>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <label>Picture URL:</label>
                    <input
                        type="text"
                        value={picture}
                        onChange={(e) => setPicture(e.target.value)}
                    />
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label>Seller Name:</label>
                    <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                    />
                    <label>Rating:</label>
                    <input
                        type="number"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                    <label>Reviews:</label>
                    <input
                        type="number"
                        value={reviews}
                        onChange={(e) => setReviews(e.target.value)}
                    />
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <button type="submit">Update Product</button>
                </form>
                {updateMessage && <p>{updateMessage}</p>}
            </div>

            <div>
            <h1>Admin Home</h1>
            <button onClick={fetchComplaints}>View All Complaints</button>
            {loadingg && <p>Loading complaints...</p>}
            {errorr && <p>Error: {errorr}</p>}
            {showComplaints && complaints.length === 0 && !loadingg && <p>No complaints found.</p>}
            {showComplaints && complaints.length > 0 && (
                <ul>
                    {complaints.map((complaint) => (
                        <li key={complaint._id}>
                            <p>Username: {complaint.Tourist_Email}</p>
                            <p>Title: {complaint.Title}</p>
                            <p>Complaint: {complaint.Body}</p>
                            <button onClick={() => handleProcessComplaint(complaint.Tourist_Email)}>
                                Process Complaint
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    
        <div>
            
            {/* Input for fetching a specific complaint by email */}
            <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email to fetch complaint"
            />
            <button onClick={handleFetchComplaintByEmail}>Fetch Complaint</button>

            {/* Loading indicator */}
            {isLoading && <p>Loading complaints...</p>}

            {/* Error handling */}
            {errorMessage && <p>Error: {errorMessage}</p>}

            {/* Display the list of complaints if they are loaded and the user clicked to view them */}
            {showComplaints && complaintsList.length === 0 && !isLoading && <p>No complaints found.</p>}

            {showComplaintss && complaintsList.length > 0 && (
                <ul>
                    {complaintsList.map((complaint) => (
                        <li key={complaint._id}>
                            <p>Username: {complaint.Tourist_Email}</p>
                            <p>Title: {complaint.Title}</p>
                            <p>Body: {complaint.Body}</p>
                            <p>Status: {complaint.Status}</p>
                            <button onClick={() => handleProcessComplaint(complaint.Tourist_Email)}>
                                Process Complaint
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    

    


        </div>
    );
};

export default AdminHome;
