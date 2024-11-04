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
    viewComplaintByEmail,
    replyToComplaint ,
    viewAllComplaintsSortedByDate ,
    filterComplaintsByStatus ,
    flagActivity , flagItinerary 
    
} from '../services/api'; // Import all API functions
import '../css/Home.css';
import logo from '../images/logo.png';



const AdminHome = () => {
    const [email, setEmail] = useState(''); // For deleting user
    const [showModal, setShowModal] = useState(false);
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
    const [filteredComplaints, setFilteredComplaints] = useState([]);


    const [showreplyModal, setShowreplyModal] = useState(false);
    const [complaintEmail, setComplaintEmail] = useState(''); // State to store email
    const [complaintReply, setComplaintReply] = useState(''); // State to store reply
    const [isSendingReply, setIsSendingReply] = useState(false); // Loading state
    const [replyErrorMessage, setReplyErrorMessage] = useState('');
    const [replySuccessMessage, setReplySuccessMessage] = useState('');

    
    const [sortedComplaints, setSortedComplaints] = useState([]);
    const [loadingSortedComplaints, setLoadingSortedComplaints] = useState(false);
    const [sortedComplaintsError, setSortedComplaintsError] = useState('');

    const [allComplaints, setAllComplaints] = useState([]); // Updated state for all complaints
    const [filterStatus, setFilterStatus] = useState(''); // Updated state for the status filter
    const [isLoadingFiltered, setIsLoadingFiltered] = useState(false); // Updated loading state for filtered complaints
    const [filterErrorMsg, setFilterErrorMsg] = useState(''); // Updated error message for filtering

    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const [activityName, setActivityName] = useState(''); // State for activity name input
    const [flagMessage, setFlagMessage] = useState(''); // State to display success/error message

    const [itineraryName, setItineraryName] = useState('');
    const [itineraryFlagMessage, setItineraryFlagMessage] = useState('');
    const [flagError, setFlagError] = useState('');

    //Activity management modal
    const [isModalOpen, setIsModalOpen] = useState(false);

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

      useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, []);
    
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
        setShowModal(false);
        try {
            const response = await createUserAdmin(userData);
            setMessage(`User ${response.Username} created successfully!`);
        } catch (error) {
            setMessage(error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        // Reset the form fields
        setUsername('');
        setNewEmail('');
        setPassword('');
        setType('');
        setMessage('');
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

    const handleSearchComplaints = () => {
        const filtered = complaints.filter(complaint => 
            complaint.Tourist_Email.toLowerCase().includes(emailInput.toLowerCase())
        );
        setFilteredComplaints(filtered);
    };

 
    const handleReplyToComplaint = async () => {
        setIsSendingReply(true);
        setReplyErrorMessage('');
        setReplySuccessMessage('');

        try {
            const response = await replyToComplaint(complaintEmail, complaintReply);
            setReplySuccessMessage('Reply sent successfully: ' + response.message);
            // Optionally, clear input fields after a successful reply
            setComplaintEmail('');
            setComplaintReply('');
        } catch (error) {
            setReplyErrorMessage('Failed to send reply. Please try again.');
            console.error('Error in replying to complaint:', error);
        } finally {
            setIsSendingReply(false);
        }
    };



    const fetchSortedComplaints = async () => {
        setLoadingSortedComplaints(true);
        setSortedComplaintsError('');
        try {
            const complaints = await viewAllComplaintsSortedByDate();
            setSortedComplaints(complaints); // Store the sorted complaints
        } catch (error) {
            setSortedComplaintsError('Failed to fetch complaints sorted by date.');
            console.error('Error fetching sorted complaints:', error);
        } finally {
            setLoadingSortedComplaints(false);
        }
    };

    const handleFilterComplaintsByStatus = async () => {
        setIsLoadingFiltered(true);
        setFilterErrorMsg(''); // Clear previous error message
        try {
            const filteredComplaintsData = await filterComplaintsByStatus(filterStatus);
            setFilteredComplaints(filteredComplaintsData); // Update the filtered complaints state
            if (filteredComplaintsData.length === 0) {
                // Handle no complaints found scenario
                throw new Error('No complaints found for the selected status.'); // Trigger catch block
            }
        } catch (error) {
            setFilterErrorMsg(error.message || 'Failed to fetch filtered complaints.');
        } finally {
            setIsLoadingFiltered(false);
        }
    };

// Handler function to flag the activity
const handleFlagActivity = async () => {
    try {
        const response = await flagActivity(activityName);
        setFlagMessage(response.message); // Set success message
    } catch (error) {
        setFlagMessage('Error flagging activity: ' + error.message); // Set error message
    }
};

const handleFlagItinerary = async () => {
    try {
        const response = await flagItinerary(itineraryName);
        setItineraryFlagMessage(response.message); // Display success message
        setFlagError(''); // Clear any previous errors
    } catch (error) {
        setItineraryFlagMessage('');
        setFlagError('Error flagging itinerary: ' + (error.response?.data?.message || error.message));
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
                       <li>
                        <a 
                            href="#" 
                            onClick={() => setIsModalOpen(true)} 
                            className="text-blue-500 hover:underline"
                        >
                            Activities Management
                        </a>
                    </li>
                   </ul>
               </nav>   
            </div>
            <div className= "w-36"> 
              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-bold mb-4">Manage Activity Categories</h2>

                        {/* Form for adding new category */}
                        <form onSubmit={handleCreateCategory} className="mb-4">
                            <label className="block text-sm font-medium mb-1">Category Name:</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                            <button type="submit" className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2">
                                Add Category
                            </button>
                        </form>

                        {/* Form for updating category */}
                        <form onSubmit={handleUpdateCategory} className="mb-4">
                            <label className="block text-sm font-medium mb-1">Current Category Name:</label>
                            <select
                                value={currentCategory}
                                onChange={(e) => setCurrentCategory(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.Name}>
                                        {cat.Name}
                                    </option>
                                ))}
                            </select>
                            <label className="block text-sm font-medium mb-1 mt-2">New Category Name:</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                            <button type="submit" className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2">
                                Update Category
                            </button>
                        </form>

                        {/* Form for deleting category */}
                        <form onSubmit={handleDeleteCategory} className="mb-4">
                            <label className="block text-sm font-medium mb-1">Delete Category:</label>
                            <select
                                value={currentCategory}
                                onChange={(e) => setCurrentCategory(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.Name}>
                                        {cat.Name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="mt-2 bg-red-500 text-white rounded-md px-4 py-2">
                                Delete Category
                            </button>
                        </form>

                        <h2 className="text-xl font-bold mb-4">Manage Preference Tags</h2>

                        {/* Form for adding new tag */}
                        <form onSubmit={handleCreateTag} className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tag Name:</label>
                            <input
                                type="text"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                            <button type="submit" className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2">
                                Add Tag
                            </button>
                        </form>

                        {/* Form for updating tag */}
                        <form onSubmit={handleUpdateTag} className="mb-4">
                            <label className="block text-sm font-medium mb-1">Current Tag Name:</label>
                            <select
                                value={currentTagName}
                                onChange={(e) => setCurrentTagName(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            >
                                <option value="">Select Tag</option>
                                {tags.map((tag) => (
                                    <option key={tag._id} value={tag.Name}>
                                        {tag.Name}
                                    </option>
                                ))}
                            </select>
                            <label className="block text-sm font-medium mb-1 mt-2">New Tag Name:</label>
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                            <button type="submit" className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2">
                                Update Tag
                            </button>
                        </form>

                        {/* Form for deleting tag */}
                        <form onSubmit={handleDeleteTag} className="mb-4">
                            <label className="block text-sm font-medium mb-1">Delete Tag:</label>
                            <select
                                value={currentTagName}
                                onChange={(e) => setCurrentTagName(e.target.value)}
                                required
                                className="border border-gray-300 p-2 rounded w-full"
                            >
                                <option value="">Select Tag</option>
                                {tags.map((tag) => (
                                    <option key={tag._id} value={tag.Name}>
                                        {tag.Name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="mt-2 bg-red-500 text-white rounded-md px-4 py-2">
                                Delete Tag
                            </button>
                        </form>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 bg-gray-300 text-black rounded-md px-4 py-2"
                        >
                            Close
                        </button>
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
                </div>
            )}
            </div>
            <br />
            <br></br>
            <br></br>
            <br></br>
            <div className="p-6 bg-gray-50">
                <h1 className="text-2xl font-bold text-center mb-6">Admin Home</h1>

                {/* Loading indicator */}
                {loading && <p className="text-gray-500 text-center">Loading requests...</p>}

                {/* Error handling */}
                {error && <p className="text-red-500 text-center">Error: {error}</p>}

                {/* Display the table if requests are loaded */}
                {showRequests && requests.length === 0 && !loading && (
                    <p className="text-gray-500 text-center">No requests available.</p>
                )}

                {showRequests && requests.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-3 px-6 text-left">Username</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Type</th>
                                    <th className="py-3 px-6 text-left">Actions</th> {/* New Actions column */}
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => (
                                    <tr 
                                        key={request._id} 
                                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    >
                                        <td className="py-2 px-6 border-t">{request.Username}</td>
                                        <td className="py-2 px-6 border-t">{request.Email}</td>
                                        <td className="py-2 px-6 border-t">{request.Type}</td>
                                        <td className="py-2 px-6 border-t">
                                            <button 
                                                onClick={() => handleProcessRequest(request.Email)} 
                                                className="text-blue-500 hover:text-blue-700 font-semibold"
                                            >
                                                Process Request
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

           {/* Form for deleting a user */}
           <div className="admin-action p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Delete User</h2>
                <form onSubmit={handleDeleteUser} className="flex flex-col">
                    <label htmlFor="email" className="mb-2 font-medium">
                        Enter Email of User to Delete:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button 
                        type="submit" 
                        className="bg-red-500 text-white rounded-md px-4 py-2 transition duration-200 hover:bg-red-600"
                    >
                        Delete User
                    </button>
                </form>
                {message && <p className="mt-4 text-red-600">{message}</p>}
            </div>
            <div>
            {loadingg && <p>Loading complaints...</p>}
            {errorr && <p className="text-red-500">Error: {errorr}</p>}
            {showComplaints && complaints.length === 0 && !loadingg && <p>No complaints found.</p>}

            {/* Search Input for Email */}
            <div className="flex space-x-4 mb-4 p-4">
                {/* Search by Email */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email to search complaints"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <button
                        onClick={handleSearchComplaints}
                        className="bg-blue-500 text-white rounded-md px-4 py-2"
                    >
                        Search
                    </button>
                </div>

                {/* Filter by Status */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        placeholder="Enter complaint status"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <button
                        onClick={handleFilterComplaintsByStatus}
                        disabled={isLoadingFiltered}
                        className="bg-blue-500 text-white rounded-md px-4 py-2"
                    >
                        {isLoadingFiltered ? 'Loading...' : 'Filter Complaints'}
                    </button>
                </div>
            </div>


            <div className="p-6">
            <div className="mb-4">
                <button
                    onClick={fetchSortedComplaints}
                    disabled={loadingSortedComplaints}
                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                    Sort Complaints by Date
                </button>
                {loadingSortedComplaints && <p>Loading complaints...</p>}
                {sortedComplaintsError && <p>{sortedComplaintsError}</p>}
            </div>

            {showComplaints || filteredComplaints.length > 0 || emailInput ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">Username</th>
                            <th className="py-2 px-4 border">Title</th>
                            <th className="py-2 px-4 border">Complaint</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Date</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Display sorted complaints if they exist, otherwise display the original complaints */}
                        {(sortedComplaints.length > 0 ? sortedComplaints : (filteredComplaints.length > 0 ? filteredComplaints : complaints)).map((complaint) => (
                            <tr key={complaint._id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border">{complaint.Tourist_Email}</td>
                                <td className="py-2 px-4 border">{complaint.Title}</td>
                                <td className="py-2 px-4 border">{complaint.Body}</td>
                                <td className="py-2 px-4 border">{complaint.Status}</td>
                                <td className="py-2 px-4 border">{complaint.Date_Of_Complaint}</td>
                                <td className="py-2 px-4 border">
                                    <button
                                        onClick={() => {
                                            setComplaintEmail(complaint.Tourist_Email);
                                            setShowreplyModal(true);
                                        }}
                                        className="bg-blue-500 text-white rounded-md px-2 py-1 transition duration-200 hover:bg-blue-600"
                                    >
                                        Reply
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No complaints found.</p>
            )}
        </div>



            {/* Modal for replying to complaints */}
            {showreplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Reply to Complaint</h2>
                        <input
                            type="email"
                            placeholder="Enter user email"
                            value={complaintEmail}
                            onChange={(e) => setComplaintEmail(e.target.value)}
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <textarea
                            placeholder="Enter your reply"
                            value={complaintReply}
                            onChange={(e) => setComplaintReply(e.target.value)}
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <button
                            onClick={handleReplyToComplaint}
                            disabled={isSendingReply}
                            className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 transition duration-200 hover:bg-blue-600"
                        >
                            {isSendingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                            onClick={() => setShowreplyModal(false)}
                            className="bg-gray-300 text-black rounded-md px-4 py-2 transition duration-200 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        {replyErrorMessage && <p className="text-red-500">{replyErrorMessage}</p>}
                        {replySuccessMessage && <p className="text-green-500">{replySuccessMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    

           <br />

           {/* Form for creating a new user */}
           <div className="admin-actions">
            <button 
                onClick={() => setShowModal(true)} 
                className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4 transition duration-200 hover:bg-blue-600"
            >
                Add New User
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Create New User (Admin or Tourism Governor)</h2>
                        <form onSubmit={handleCreateUser}>
                            <label className="block mb-2">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <label className="block mb-2">Email:</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <label className="block mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <label className="block mb-2">Type:</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Type</option>
                                <option value="Admin">Admin</option>
                                <option value="Tourism_Governor">Tourism Governor</option>
                            </select>
                            <div className="flex space-x-4">
                                <button 
                                    type="submit" 
                                    className="bg-green-500 text-white rounded-md px-4 py-2 transition duration-200 hover:bg-green-600"
                                >
                                    Create User
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white rounded-md px-4 py-2 transition duration-200 hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {message && <p className="mt-4 text-green-600">{message}</p>}
                    </div>
                </div>
            )}
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
    
       
        <footer className="bg-brandBlue shadow dark:bg-brandBlue m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="w-12" alt="Flowbite Logo" />
                        </a>
                        <div className="flex justify-center w-full">
                            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 -ml-14">
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">About</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline me-4 md:me-6">Licensing</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Rehla™</a>. All Rights Reserved.</span>
                </div>
            </footer>
            <div>
            <h3>Flag Activity as Inappropriate</h3>
            <div>
                <input 
                    type="text" 
                    placeholder="Enter Activity Name" 
                    value={activityName} 
                    onChange={(e) => setActivityName(e.target.value)} 
                />
                <button onClick={handleFlagActivity}>Flag Activity</button>
            </div>
            {flagMessage && <p>{flagMessage}</p>} {/* Display success/error message */}
        </div>
        <div>
            <h3>Flag an Itinerary as Inappropriate</h3>
            <input
                type="text"
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
                placeholder="Enter itinerary name"
            />
            <button onClick={handleFlagItinerary}>Flag Itinerary</button>
            
            {itineraryFlagMessage && <p style={{ color: 'green' }}>{itineraryFlagMessage}</p>}
            {flagError && <p style={{ color: 'red' }}>{flagError}</p>}
        </div>

        
        </div>
    );
};

export default AdminHome;
