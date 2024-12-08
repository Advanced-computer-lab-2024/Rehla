import React, { useEffect, useState } from 'react';
import { fetchItineraryReport, getTourGuideProfile, calculateItineraryRevenue, fetchFilteredTourGuideSalesReport, fetchAllSalesReportsitinemail, filterItineraryAttendeesByMonth  } from '../services/api';
import { Link} from 'react-router-dom';
import logo from '../images/logoWhite.png';




const TourGuideReport = () => {

    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        Mobile_Number: '',
        Experience: '',
        Previous_work: '',
        Type: ''
    });

    const [currency, setCurrency] = useState('USD');
    // const [conversionRates] = useState({
    //     USD: 1,
    //     EUR: 0.85,
    //     GBP: 0.75,
    //     JPY: 110,
    //     CAD: 1.25,
    //     AUD: 1.35
    // });

    const [salesReports, setSalesReports] = useState([]);
    const [messagee, setMessagee] = useState('');
    const [itineraryReport, setItineraryReport] = useState(null);
    const [erro, setErro] = useState(null); // State to handle any errors
    const [filteredItineraryReport, setFilteredItineraryReport] = useState(null); // State for the filtered report
    const [monthh, setMonthh] = useState(''); // State to store the selected month
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState([]);
    const [itineraryFilter, setItineraryFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [month, setMonth] = useState("");




    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const email = localStorage.getItem('email');
            const profileData = await getTourGuideProfile({ Email: email });
            //setTourist(profileData);
            setFormData(profileData);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        };
        handleViewItineraryReport();
        handleFetchSalesReports();
        fetchProfile();
    }, []);

    // Function to fetch the general itinerary report
    const handleViewItineraryReport = async () => {
        try {
            setErro(null); // Reset errors
            const email = localStorage.getItem('email');
            if (!email) {
                setErro("No email found. Please sign in.");
                return;
            }
            const data = await fetchItineraryReport(email);
            setItineraryReport(data);
            setFilteredItineraryReport(null); // Hide the filtered report
        } catch (err) {
            setErro("An error occurred while fetching the itinerary report.");
            console.error(err);
        }
    };

    // const convertPrice = (price) => {
    //     return (price * conversionRates[currency]).toFixed(2);
    // };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    // Function to filter itineraries by month
    const handleFilterItineraryByMonth = async () => {
        try {
            setErro(null); // Reset errors
            const email = localStorage.getItem('email');
            if (!email) {
                setErro("No email found. Please sign in.");
                return;
            }
            if (!monthh || monthh < 1 || monthh > 12) {
                setErro("Please enter a valid month (1-12).");
                return;
            }
            const data = await filterItineraryAttendeesByMonth(email, parseInt(monthh, 10));
            setFilteredItineraryReport(data);
            setItineraryReport(null); // Hide the general report
        } catch (err) {
            setErro("An error occurred while filtering itineraries.");
            console.error(err);
        }
    };
    const fetchitinRevenue = async () => {
        try {
            const email = localStorage.getItem('email');
            setLoading(true);
            const reportsData = await calculateItineraryRevenue(email);
            setReports(reportsData);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error(err);
            setError('Failed to fetch activity revenue. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    const handleFilterFetchSalesReports = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            const reports = await fetchFilteredTourGuideSalesReport(email, itineraryFilter, startDate, endDate, month); // Send filters to API
    
            if (reports.length === 0) {
                setMessagee("No sales reports found for the given filters.");
            } else {
                setSalesReports(reports);
                setMessagee(""); // Clear any previous error messages
            }
        } catch (err) {
            setMessagee(err.response?.data?.message || "Error fetching filtered sales reports.");
            console.error(err); // Log the full error for debugging
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleFetchSalesReports = async () => {
        try {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
    
            if (!email) {
                setMessagee('No email found. Please sign in again.');
                return;
            }
    
            const reports = await fetchAllSalesReportsitinemail(email); // Pass the email to the API function
            setSalesReports(reports);
        } catch (err) {
            setMessagee('Error fetching itinerary sales reports.');
            console.error(err);
        }
    };

    return(
        <div>
            <div className="w-full mx-auto px-6 py-1 bg-black shadow flex flex-col sticky z-50 top-0">
                <div className="flex items-center">                
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="w-44" />

                    {/* Main Navigation */}
                    <nav className="flex space-x-6">
                        <Link to="/TourGuideHome" className="text-lg font-medium text-white hover:text-blue-500">
                            Home
                        </Link>
                        <a onClick="" href="#uh" className="text-lg font-medium font-family-cursive text-white hover:text-blue-500">
                            Create
                        </a>
                        <Link to="/TourGuideHome/TourGuideReport" className="text-lg font-medium text-logoOrange hover:text-blue-500">
                            Reports
                        </Link>
                    </nav>

                    <div className="flex items-center ml-auto">
                        <select 
                            value={currency} 
                            onChange={handleCurrencyChange} 
                            className="rounded p-1 mx-2 bg-transparent text-white"
                        >
                            <option value="USD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">USD</option>
                            <option value="EUR" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">EUR</option>
                            <option value="GBP" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">GBP</option>
                            <option value="JPY" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">JPY</option>
                            <option value="CAD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">CAD</option>
                            <option value="AUD" className="bg-black hover:bg-gray-700 px-4 py-2 rounded">AUD</option>
                        </select>
                        <nav className="flex space-x-4 ml-2"> {/* Reduced ml-4 to ml-2 and space-x-6 to space-x-4 */}
                            <Link to="/TourGuideHome/TourGuideProfile">
                                {/* Profile Picture */}
                                <div className="">
                                    {formData.Profile_Pic ? (
                                        <img
                                            src={formData.Profile_Pic}
                                            alt={`${formData.Name}'s profile`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-black text-white text-center flex items-center justify-center border-2 border-white">
                                            <span className="text-4xl font-bold">{formData.Username.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </nav>
                    </div>


                </div>            
            </div>
            
            <div className="p-6 bg-gray-50 min-h-screen">

                

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Sales Reports</h2>

                    <div className="flex flex-wrap gap-4">
                        <div className="w-full sm:w-1/5">
                            <label htmlFor="itineraryFilter" className="block font-medium mb-1">Itinerary:</label>
                            <input
                                type="text"
                                id="itineraryFilter"
                                value={itineraryFilter}
                                onChange={(e) => setItineraryFilter(e.target.value)}
                                placeholder="Enter itinerary"
                                className="w-full p-2 border rounded-full"
                            />
                        </div>

                        <div className="w-full sm:w-1/5">
                            <label htmlFor="startDate" className="block font-medium mb-1">Start Date:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border rounded-full"
                            />
                        </div>

                        <div className="w-full sm:w-1/5">
                            <label htmlFor="endDate" className="block font-medium mb-1">End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 border rounded-full"
                            />
                        </div>

                        <div className="w-full sm:w-1/5">
                            <label htmlFor="month" className="block font-medium mb-1">Month:</label>
                            <input
                                type="month"
                                id="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full p-2 border rounded-full"
                            />
                        </div>

                        <div className="w-full sm:w-auto flex items-end">
                            <button
                                onClick={handleFilterFetchSalesReports}
                                className="bg-logoOrange hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full"
                            >
                                Apply Filters
                            </button>
                            <button
                            onClick={fetchitinRevenue}
                            className="bg-black ml-4 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full"
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}
                {messagee && <p className="text-green-500 mb-4">{messagee}</p>}
                {/* Error State */}
                {error && <p className="text-red-500">{messagee}</p>}

                {/* Sales Reports Table */}
                {salesReports.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-200 p-3 text-left">Itinerary</th>
                                <th className="border border-gray-200 p-3 text-left">Revenue</th>
                                <th className="border border-gray-200 p-3 text-left">Sales</th>
                                <th className="border border-gray-200 p-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesReports.map((report) => (
                                <tr key={report.Report_no} className="hover:bg-gray-50">
                                    <td className="border border-gray-200 p-3">{report.Itinerary}</td>
                                    <td className="border border-gray-200 p-3">${report.Revenue}</td>
                                    <td className="border border-gray-200 p-3">{report.Sales}</td>
                                    <td className="border border-gray-200 p-3">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p className="text-gray-500">No sales reports available.</p>
                )}

                {/* General Itinerary Report */}
                <div className="bg-white shadow-md p-6 rounded-md">
                <div className="mb-4 flex items-end gap-2">
                    <div className="w-1/3">
                        <label className="block font-medium mb-1">
                        Filter by Month (1-12):
                        </label>
                        <input
                        type="number"
                        value={monthh}
                        onChange={(e) => setMonthh(e.target.value)}
                        min="1"
                        max="12"
                        className="w-full p-1 border rounded-md"
                        />
                    </div>

                    <button
                        onClick={handleFilterItineraryByMonth}
                        className="bg-black hover:bg-logoOrange text-white font-medium py-1 px-3 rounded-md"
                    >
                        Filter
                    </button>
                    </div>


                    {erro && <p className="text-red-500 mb-4">{erro}</p>}

                    {itineraryReport && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Itinerary Report</h2>
                        <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-2 text-left">Itinerary Name</th>
                            <th className="border border-gray-200 p-2 text-left">Date</th>
                            <th className="border border-gray-200 p-2 text-left">Attendees Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itineraryReport.itineraryDetails.map((itinerary, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-2">{itinerary.itineraryName}</td>
                                <td className="border border-gray-200 p-2">
                                {new Date(itinerary.itineraryDate).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-200 p-2">{itinerary.attendeesCount}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        <p className="mt-4 font-semibold">
                        <strong>Total Attendees:</strong> {itineraryReport.totalAttendees}
                        </p>
                    </div>
                    )}

                    {filteredItineraryReport && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Filtered Itinerary Report</h2>
                        <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-2 text-left">Itinerary Name</th>
                            <th className="border border-gray-200 p-2 text-left">Date</th>
                            <th className="border border-gray-200 p-2 text-left">Attendees Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItineraryReport.filteredItineraryDetails.map((itinerary, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-2">{itinerary.itineraryName}</td>
                                <td className="border border-gray-200 p-2">
                                {new Date(itinerary.itineraryDate).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-200 p-2">{itinerary.attendeesCount}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        <p className="mt-4 font-semibold">
                        <strong>Total Attendees:</strong> {filteredItineraryReport.totalFilteredAttendees}
                        </p>
                    </div>
                    )}

                </div>

            </div>
            <footer className="bg-black shadow m-0">
                <div className="w-full mx-auto md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="w-44" alt="Flowbite Logo" />
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
export default TourGuideReport