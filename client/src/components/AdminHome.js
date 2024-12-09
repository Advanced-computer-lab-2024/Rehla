import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell  } from '@fortawesome/free-solid-svg-icons';
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
    ,getDeleteRequests,
    deleteRequest,
    updateComplaintStatus,
    createPromoCode,
    viewUserStats,
    fetchAllSalesReports,fetchAllSalesReportsitin,fetchAllSalesReportsSeller,
    fetchFilteredSellerSalesReportad,
    viewMyProducts,
    createOutOfStockNotificationsadmin,
    markAsSeenna,
    getNotificationsForadmin,
} from '../services/api'; // Import all API functions
import '../css/Home.css';
import logo from '../images/logoWhite.png';



const AdminHome = () => {
    const [deleteRequests, setDeleteRequests] = useState([]);
    const [loadingdelete, setLoadingdelete] = useState(false);
    const [errordelete, setErrordelete] = useState(null);
    const [showRequestsdelete, setShowRequestsdelete] = useState(false);
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
    const [complaintTitle, setComplaintTitle] = useState('');

    
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
    //bto3 el user number
    const [totalUsers, setTotalUsers] = useState(0);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [errorFetchingStats, setErrorFetchingStats] = useState(''); // Renamed error state
    const [isStatsFetched, setIsStatsFetched] = useState(false); // New state to track stats fetch status


    const [itineraryName, setItineraryName] = useState('');
    const [itineraryFlagMessage, setItineraryFlagMessage] = useState('');
    const [flagError, setFlagError] = useState('');

    //Activity management modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    //user Modal
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    // Fetch activity categories and preference tags on component mount
    const [messagee, setMessagee] = useState('');
    const [salesReportss, setSalesReportss] = useState([]);
    const [salesReports, setSalesReports] = useState([]);
    const [salesReportsss, setSalesReportsss] = useState([]);

    const [productFilter, setProductFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [month, setMonth] = useState("");

    const [myProducts, setMyProducts] = useState([]); // New state for my products


    const [notifications, setNotifications] = useState([]); // State for notifications
    const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
    const [showModall, setShowModall] = useState(false); // State to show/hide the modal
    const [notificationError, setNotificationError] = useState(null); // State for notification errors
    const [notificationSuccess, setNotificationSuccess] = useState(null); // State for notification success
    const [emaill, setEmaill] = useState('');


    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmaill(storedEmail);
    
            const handleNotifyForBookings = async () => {
                try {
                    const response = await createOutOfStockNotificationsadmin(storedEmail); // Pass email to notify function
                    setNotificationSuccess(response.message || 'Notifications processed successfully.');
                } catch (err) {
                    setNotificationError(err.message || 'Failed to process notifications.');
                }
            };
    
            handleNotifyForBookings();
        }
    }, []); // This runs only once when the component mounts

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
                if (!storedEmail) {
                    throw new Error("User email not found in local storage.");
                }
    
                // Fetch notifications for the signed-in user
                const data = await getNotificationsForadmin(storedEmail);
                setNotifications(data); // Set notifications
                const unread = data.filter((notification) => !notification.seen).length; // Count unread notifications
                setUnreadCount(unread);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
    
        fetchNotifications();
    }, []);
    
    const handleNotificationClick = async () => {
        setShowModall(true); // Show the modal when the notification icon is clicked
    
        try {
            const storedEmail = localStorage.getItem('email'); // Retrieve the signed-in user's email
            if (!storedEmail) {
                throw new Error("User email not found in local storage.");
            }
    
            // Mark all unseen notifications for the user as seen
            for (const notification of notifications) {
                if (!notification.seen) {
                    await markAsSeenna(notification._id); // Mark as seen
                }
            }
    
            // Refresh the notifications for the signed-in user
            const updatedNotifications = await getNotificationsForadmin(storedEmail);
            setNotifications(updatedNotifications); // Set updated notifications
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };
    

    const handleCloseModal = () => {
        setShowModall(false); // Close the modal
        setUnreadCount(0); // Reset the unread count when the modal is closed
    };
    

    const handleFilterFetchSalesReports = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            const reports = await fetchFilteredSellerSalesReportad(productFilter, startDate, endDate, month); // Send filters to API
            setSalesReportsss(reports);
            setLoading(false);
        } catch (err) {
            setMessagee("Error fetching filtered sales reports.");
            setError(err);
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchMyProducts = async () => {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
            console.log(email);
            try {
                if (!email) {
                    setError('No email found. Please sign in again.');
                    return;
                }
                const fetchedProducts = await viewMyProducts(email);
                console.log(fetchedProducts);
                setMyProducts(fetchedProducts);
            } catch (error) {
                //setError('Failed to load my products');
                console.error(error);
            }
        };
        fetchMyProducts();
    }, []);

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



    const handleFetchSalesReportsact = async () => {
        try {
            const reportss = await fetchAllSalesReports();
            setSalesReportss(reportss);
        } catch (err) {
            setMessagee('Error fetching sales reports.');
            console.error(err);
        }
    };

    const handleFetchSalesReportsitin = async () => {
        try {
            const reports = await fetchAllSalesReportsitin();
            setSalesReports(reports);
        } catch (err) {
            setMessagee('Error fetching sales reports.');
            console.error(err);
        }
    };

    const handleFetchSalesReports = async () => {
        try {
            const reports = await fetchAllSalesReportsSeller();
            setSalesReportsss(reports);
        } catch (err) {
            setMessagee('Error fetching sales reports.');
            console.error(err);
        }
    };






    
    const handleFetchStats = async () => {
        // Clear previous error message
        setErrorFetchingStats('');
        setIsStatsFetched(false); // Reset the state before fetching

        try {
            const data = await viewUserStats();
            setTotalUsers(data.totalUsers);
            setMonthlyStats(data.monthlyStats);
            setIsStatsFetched(true); // Mark stats as fetched successfully
        } catch (error) {
            setErrorFetchingStats('Error retrieving user statistics');
            console.error('Error fetching user stats:', error);
        }
    };
    
    const fetchDeleteRequests = async () => {
        setLoadingdelete(true);
        try {
            const data = await getDeleteRequests();
            setDeleteRequests(data.deleteRequests);
            setShowRequestsdelete(true); // Show requests when fetched
        } catch (err) {
            setErrordelete(err.message || 'Failed to fetch delete requests');
        } finally {
            setLoadingdelete(false);
        }
    };

    useEffect(() => {
        fetchDeleteRequests(); // Fetch delete requests on component mount
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

      const handleDeleteRequest = async (email) => {
        try {
          await deleteRequest(email);
          alert('Request deleted successfully: ');
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

    const handleComplaintStatus = async (email, title) => {
        try {
            const response = await updateComplaintStatus(email, title);
            alert("Complaint resolved")
            setReplySuccessMessage(response.message);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Failed to update complaint status.');
            console.error('Error:', error);
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

const toggleUserModal = () => {
    setUserModalOpen(!isUserModalOpen);
  };

  const [promoCode, setPromoCode] = useState('');
const [discount, setDiscount] = useState('');
const [expiry, setExpiry] = useState('');
const [createdby,setCreatedBy]= useState('');
const [promoType, setPromoType] = useState('');
const [promoMessage, setPromoMessage] = useState('');

useEffect(() => {
    const adminemail = localStorage.getItem('email');
    setCreatedBy(adminemail);
}, []);

const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    setPromoMessage('');
    try {
        const response = await createPromoCode(promoCode, discount, expiry, createdby , promoType);

        setPromoMessage(`Promo code ${response.Code} created successfully!`);
    } catch (error) {
        setPromoMessage(error.message);
    }
};

  


    return (
        <div>

<div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Main Navigation */}
                    <nav className="flex space-x-6">
                        <Link to="/">Home</Link>
                        <Link to="/Adminproducts">Products</Link>
                        <a 
                            href="#a" 
                            onClick={() => setIsModalOpen(true)} 
                            className="text-white hover:underline"
                        >
                            Activities Management
                        </a>

                        <a 
                            href="#u" 
                            onClick={() => setUserModalOpen(true)} 
                            className="text-white hover:underline"
                        >
                            users Management
                        </a>
                    </nav>

                    <div className="flex items-center ml-auto">
                        {/* Notification Icon */}
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <div className="relative ml-2"> {/* Reduced ml-4 to ml-2 */}
                                <FontAwesomeIcon
                                    icon={faBell}
                                    size="1x" // Increased the size to 2x
                                    onClick={handleNotificationClick}
                                    className="cursor-pointer text-white" // Added text-white to make the icon white
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </nav>
                    </div>


                </div>            
            </div>
            
            
            <br />
            <br></br>
            <br></br>
            <br></br>
            <div className="w-36 py-6">
               {/* Modal */}
            {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsModalOpen(false)}></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 mt-20">
                        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                            <h2 className="text-xl font-bold mb-4">Manage Activity Categories</h2>

                            {/* Label for Category Management */}
                            <label className="block text-lg font-semibold mb-2">Category Management</label>
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
                                <button type="submit" className="mt-2 bg-black text-white rounded-md px-4 py-2">
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
                                <button type="submit" className="mt-2 bg-black text-white rounded-md px-4 py-2">
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
                                <button type="submit" className="mt-2 bg-logoOrange text-white rounded-md px-4 py-2">
                                    Delete Category
                                </button>
                            </form>

                            <h2 className="text-xl font-bold mb-4">Manage Preference Tags</h2>
                            {/* Label for Tag Management */}
                            <label className="block text-lg font-semibold mb-2">Tag Management</label>

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
                                <button type="submit" className="mt-2 bg-black text-white rounded-md px-4 py-2">
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
                                <button type="submit" className="mt-2 bg-black text-white rounded-md px-4 py-2">
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
                                <button type="submit" className="mt-2 bg-logoOrange text-white rounded-md px-4 py-2">
                                    Delete Tag
                                </button>
                            </form>

                            <h2 className="text-xl font-bold mb-4">Flag Activities and Itineraries</h2>

                            {/* Flag Activity Section */}
                            <form onSubmit={handleFlagActivity} className="mb-4">
                                <label className="block text-sm font-medium mb-1">Flag Activity as Inappropriate:</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Enter Activity Name"
                                        value={activityName}
                                        onChange={(e) => setActivityName(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-2 bg-logoOrange text-white rounded-md px-4 py-2 "
                                    >
                                        Flag Activity
                                    </button>
                             </div>
                                {flagMessage && <p className="text-sm text-green-600 mt-2">{flagMessage}</p>}
                            </form>

                            {/* Flag Itinerary Section */}
                            <form onSubmit={handleFlagItinerary} className="mb-4">
                                <label className="block text-sm font-medium mb-1">Flag Itinerary as Inappropriate:</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={itineraryName}
                                        onChange={(e) => setItineraryName(e.target.value)}
                                        placeholder="Enter Itinerary Name"
                                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-2 bg-logoOrange text-white rounded-md px-4 py-2 "
                                    >
                                        Flag Itinerary
                                    </button>
                                </div>
                                {itineraryFlagMessage && <p className="text-sm text-green-600 mt-2">{itineraryFlagMessage}</p>}
                                {flagError && <p className="text-sm text-red-600 mt-2">{flagError}</p>}
                            </form>

                            {/* Close Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mt-4 bg-logoOrange text-white rounded-md px-4 py-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
                {/* Notification Modal */}
                {showModall && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-xl text-gray-500"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-3 mb-2 rounded-lg ${
                                            notification.seen ? 'bg-gray-100' : 'bg-yellow-100'
                                        }`}
                                    >
                                        <p className="font-semibold">{notification.title}</p>
                                        <p>{notification.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No notifications available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            </div>

            <div className="p-6 bg-gray-50 mt-[-80px]">
                <h1 className="text-2xl font-bold text-center mb-6">Admin Home</h1>
                <h1 className="text-3xl font-extrabold text-center mb-8 mt-8 text-black">Users Requests</h1>

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
                                    <th className="py-3 px-6 text-left">Actions</th>
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
                                                className="text-logoOrange hover:text-black font-semibold"
                                            >
                                                Process Request
                                            </button>
                                        </td>
                                        <td className="py-2 px-6 border-t">
                                            <button 
                                                onClick={() => handleDeleteRequest(request.Email)} 
                                                className="text-red hover:text-black font-semibold"
                                            >
                                                Delete Request
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

      
            {isUserModalOpen && (
    <>
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setUserModalOpen(false)}></div>
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ paddingTop: '80px' }}> {/* Adjust this value as needed */}
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                <h2 className="text-xl font-bold mb-4">User Management</h2>

                {/* Form for creating a new user */}
                <form onSubmit={handleCreateUser} className="mb-4">
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
                            className="bg-black text-white rounded-md px-4 py-2 transition duration-200 "
                        >
                            Create User
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            className="bg-logoOrange text-white rounded-md px-4 py-2 transition duration-200 "
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Form for deleting a user */}
                <form onSubmit={handleDeleteUser} className="mb-4">
                    <label className="block text-sm font-medium mb-1">Enter Email of User to Delete:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button type="submit" className="mt-2 bg-logoOrange text-white rounded-md px-4 py-2">
                        Delete User
                    </button>
                </form>

                {/* Close Button */}
                <button
                    onClick={() => setUserModalOpen(false)}
                    className="mt-4 bg-logoOrange text-white rounded-md px-4 py-2"
                >
                    Close
                </button>
            </div>
        </div>
    </>
)}

  <h1 className="text-3xl font-extrabold text-center mb-8 mt-10 text-black">
    Tourist Complaints</h1>
        <div>
            {loadingg && <p>Loading complaints...</p>}
            {errorr && <p className="text-red-500">Error: {errorr}</p>}
            {showComplaints && complaints.length === 0 && !loadingg && <p>No complaints found.</p>}

            {/* Search Input for Email */}
            <div className="flex flex-col items-center space-y-4 mb-4 p-2"> {/* Centered the search inputs */}
                {/* Search by Email */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email to search complaints"
                        className="border border-gray-300 p-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" // More rounded
                    />
                    <button
                        onClick={handleSearchComplaints}
                        className="bg-black text-white rounded-full px-4 py-2 transition duration-200 hover:bg-logoOrange" // More rounded
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
                        className="border border-gray-300 p-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" // More rounded
                    />
                    <button
                        onClick={handleFilterComplaintsByStatus}
                        disabled={isLoadingFiltered}
                        className="bg-black text-white rounded-full px-4 py-2 transition duration-200 hover:bg-logoOrange" // More rounded
                    >
                        {isLoadingFiltered ? 'Loading...' : 'Filter Complaints'}
                    </button>

                    {/* Sort Complaints by Date (Positioned beside the status input) */}
                    <button
                        onClick={fetchSortedComplaints}
                        disabled={loadingSortedComplaints}
                        className="bg-black text-white rounded-full px-4 py-2 transition duration-200 hover:bg-logoOrange" // More rounded
                    >
                        Sort Complaints by Date
                    </button>
                    {loadingSortedComplaints && <p>Loading complaints...</p>}
                    {sortedComplaintsError && <p>{sortedComplaintsError}</p>}
                </div>
            </div>

            <div className="p-6">
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
                                <th className="py-2 px-4 border">Solve</th>
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
                                            className="bg-black text-white rounded-md px-2 py-1 transition duration-200 hover:bg-logoOrange"
                                        >
                                            Reply
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleComplaintStatus(complaint.Tourist_Email, complaint.Title)}
                                            className="bg-black text-white rounded-md px-2 py-1 transition duration-200 hover:bg-logoOrange"
                                        >
                                            Resolve
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
                            className="bg-black text-white rounded-md px-4 py-2 mr-2 transition duration-200 hover:bg-logoOrange"
                        >
                            {isSendingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                            onClick={() => setShowreplyModal(false)}
                            className="bg-logoOrange text-black rounded-md px-4 py-2 transition duration-200 "
                        >
                            Cancel
                        </button>
                        {replyErrorMessage && <p className="text-red-500">{replyErrorMessage}</p>}
                        {replySuccessMessage && <p className="text-green-500">{replySuccessMessage}</p>}
                    </div>
                </div>
            )}
        </div>

        <div className="w-full p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Delete Requests</h2>
            {loadingdelete && <p className="text-blue-500 text-center mb-4">Loading...</p>}
            {errordelete && <p className="text-red-500 text-center mb-4">{errordelete}</p>}
            {message && <p className="text-green-500 text-center mb-4">{message}</p>} {/* Show success or error message */}

            {showRequestsdelete && (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">Username</th>
                                <th className="py-2 px-4 border">Email</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deleteRequests.length > 0 ? (
                                deleteRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border">{request.Username}</td>
                                        <td className="py-2 px-4 border">{request.Email}</td>
                                        <td className="py-2 px-4 border">
                                            <button 
                                                className="bg-logoOrange text-white rounded-md px-2 py-1 transition duration-200 hover:black"
                                            >
                                                Delete User
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                                        No delete requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
           <br />
           <div>

<h1 className="text-3xl font-extrabold text-center mb-8 mt-8 text-black">Create Promo Code</h1>
<form onSubmit={handleCreatePromoCode} className="mb-4">
    <label className="block mb-2">Promo Code:</label>
    <input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        required
        className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <label className="block mb-2">Discount:</label>
    <input
        type="text"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        required
        className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <label className="block mb-2">Expiry Date:</label>
    <input
        type="date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        required
        className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <label className="block mb-2">Type:</label>
    <select
        value={promoType}
        onChange={(e) => setPromoType(e.target.value)}
        required
        className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
        <option value="">Select Promo Type</option>
        <option value="Product">Product</option>
        <option value="Itinrary">Itinrary</option>
        <option value="Activity">Activity</option>
        <option value="All">All</option>
</select>
    <button type="submit" className="bg-black text-white rounded-md px-4 py-2 transition duration-200">
        Create Promo Code
    </button>
</form>
{promoMessage && <p className="text-green-500">{promoMessage}</p>}
</div>
<div>
            <h2>User Statistics</h2>
            <button onClick={handleFetchStats}>Fetch Stats</button> {/* Button to fetch stats */}
            
            {errorFetchingStats && <p style={{ color: 'red' }}>{errorFetchingStats}</p>} {/* Error message */}
            
            {isStatsFetched && ( // Only show stats if they have been fetched
                <>
                    <p>Total Users: {totalUsers}</p>
                    <h3>Monthly User Statistics</h3>
                    <ul>
                        {monthlyStats.map((stat) => (
                            <li key={`${stat.year}-${stat.month}`}>
                                {stat.year}-{stat.month}: {stat.userCount} users
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
        <div>
    <h1>Advertiser Home</h1>
    {loading && <p>Loading activities...</p>}
    {error && <p>Error: {error.message}</p>}
    {messagee && <p>{messagee}</p>}

    {/* Activities Section */}
    <div>
        <h2>Sales Reports - Activities</h2>
        <button
            onClick={handleFetchSalesReportsact}
            style={{
                marginBottom: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Fetch All Activity Reports
        </button>
        {salesReportss.length > 0 ? (
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontSize: "1rem",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Activity</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Revenue</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Sales</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {salesReportss.map((report) => (
                        <tr
                            key={report.Report_no}
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: report.Report_no % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                        >
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Activity}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>${report.Revenue}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Sales}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No sales reports available.</p>
        )}
    </div>

    {/* Itineraries Section */}
    <div>
        <h2>Sales Reports - Itineraries</h2>
        <button
            onClick={handleFetchSalesReportsitin}
            style={{
                marginBottom: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Fetch All Itinerary Reports
        </button>
        {salesReports.length > 0 ? (
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontSize: "1rem",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Itinerary</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Revenue</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Sales</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {salesReports.map((report) => (
                        <tr
                            key={report.Report_no}
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: report.Report_no % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                        >
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Itinerary}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>${report.Revenue}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Sales}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No sales reports available.</p>
        )}
    </div>
    {/* Filter Section */}
    <div>
        <h2>Filter Sales Reports</h2>
        <div>
            <label htmlFor="productFilter">Product:</label>
            <input
                type="text"
                id="productFilter"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                placeholder="Enter product name"
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="endDate">End Date:</label>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <div>
            <label htmlFor="month">Month:</label>
            <input
                type="month"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{ margin: "5px", padding: "5px" }}
            />
        </div>
        <button
            onClick={handleFilterFetchSalesReports}
            style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Apply Filters
        </button>
    </div>

    {/* Products Section */}
    <div>
        <h2>Sales Reports - Products</h2>
        <button
            onClick={handleFetchSalesReports}
            style={{
                marginBottom: "10px",
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
        >
            Fetch All Sales Reports
        </button>
        {salesReportsss.length > 0 ? (
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontSize: "1rem",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Product</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Revenue</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Sales</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f4f4f4" }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {salesReportsss.map((report) => (
                        <tr
                            key={report.Report_no}
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: report.Report_no % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                        >
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Product}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>${report.Revenue}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.Sales}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No sales reports available.</p>
        )}
    </div>
        </div>

                    {/* Products Table */}
                    <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Product Name</th>
                            <th className="py-2 px-4 border-b">Picture</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Seller Name</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Archived</th>
                            <th className="py-2 px-4 border-b">Saled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myProducts.map((product) => (
                            <tr key={product._id.$oid}>
                                <td className="py-2 px-4 border-b">{product.Product_Name}</td>
                                <td className="py-2 px-4 border-b">
                                    <img src={product.Picture} alt={product.Product_Name} className="w-16 h-16 object-cover" />
                                </td>
                                <td className="py-2 px-4 border-b">{product.Price}</td>
                                <td className="py-2 px-4 border-b">{product.Quantity}</td>
                                <td className="py-2 px-4 border-b">{product.Seller_Name}</td>
                                <td className="py-2 px-4 border-b">{product.Description}</td>
                                <td className="py-2 px-4 border-b">{product.Archived ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4 border-b">{product.Saled}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        <footer className="bg-black shadow dark:bg-black m-0">
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


        
        </div>

        
    );
};

export default AdminHome;
