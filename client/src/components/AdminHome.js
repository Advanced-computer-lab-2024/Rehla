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
    deletePreferenceTag 
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

               <nav className="signing">
                   <Link to="/">MyProfile</Link>
               </nav>
           </div>
           <br />

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
        </div>
    );
};

export default AdminHome;
