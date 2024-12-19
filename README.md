<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>


![image](https://github.com/user-attachments/assets/8941ab57-4aa9-4214-95ea-3a77c4b35a90)

# Rehla


<!-- TABLE OF CONTENTS -->
## Table of Contents
1. [About the Project](#about-the-project)
   - [Built With](#built-with)
   - [For Testing](#for-testing)
2. [Getting Started](#getting-started)
   - [Prerequisites and Installations](#prerequisites-and-installations)
   - [Post Installation](#post-installation)
   - [Environment Variables](#environment-variables)
   - [Project Structure](#project-structure)
3. [Tourist Usage](#tourist-usage)
4. [Admin Usage](#admin-usage)
5. [Tour Guide Usage](#tour-guide-usage)
6. [Avertiser Usage](#advertiser-usage)
7. [Tourism Governer Usage](#tourism-governer-usage)
8. [Seller Usage](#seller-usage)
9. [Deployment](#deployment)
10. [API References and Test Routes](#api-references-and-test-routes)
11. [License](#license)
12. [Contact](#contact)





<!-- ABOUT THE PROJECT -->
## About The Project

Introducing our all-in-one travel platform designed to make your vacation planning effortless and exciting! Whether you’re dreaming of historic landmarks, relaxing beaches, or family-friendly adventures, our website brings everything together for the perfect trip.

Embark on your next adventure with our comprehensive Travel Companion App. Designed to enhance your travel experience, our app offers a suite of features tailored to your preferences. Personalize your vacation with our travel planning tools, allowing you to curate your itinerary based on your interests, whether it's exploring historic sites, relaxing on beaches, or indulging in shopping. Seamlessly book flights, hotels, and transportation directly within the app, leveraging trusted third-party services for a hassle-free experience. Manage your budget with ease using our smart budgeting feature. Receive activity suggestions that fit your remaining budget after booking flights and hotels, including transportation costs, ensuring a stress-free planning process. Discover local gems with our curated recommendations for activities, museums, and historical landmarks, complete with ticket prices and directions. Stay informed about your upcoming events and activities with real-time notifications, keeping you in the loop throughout your journey. Elevate your travel experience with our tour guide itineraries, providing expert-led tours or the flexibility to create your own customized adventure. And don't forget to visit our exclusive gift shop, where you can find souvenirs and unique local items to commemorate your unforgettable trip. Whether you're planning a getaway or seeking hidden treasures, our Travel Companion App is your trusted companion, ensuring you have everything you need at your fingertips. Start your vacation with us today and embark on a truly remarkable journey.


### Built With

* MongoDB
*	Express.js
*	React.js
*	Node.js

### For Testing

* Postman

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites and Installations 

First off, you need to make sure that you have visual studio code. Then you will need to install the zipped folder of the code from github.
Getting started with the MERN stack involves setting up the necessary software components and creating a basic project structure. Here's a brief summary of the steps to get started:

Install Node.js and npm (Node Package Manager):

Visit the official Node.js website (https://nodejs.org) and download the latest LTS (Long-Term Support) version for your operating system.
The installation will also include npm, which is the package manager for Node.js.
Install MongoDB:

Visit the official MongoDB website (https://www.mongodb.com) and download the appropriate version for your operating system.
Follow the installation instructions for your platform to set up MongoDB on your machine.

Create a new project directory:

Open a terminal or command prompt and navigate to the location where you want to create your project.
Run the command mkdir mern-project to create a new directory for your MERN stack project.
Navigate into the project directory using cd mern-project.
Initialize a new Node.js project:

In the project directory, run the command npm init -y to create a new package.json file, which will manage your project dependencies.
Install the required dependencies:

Install Express.js, the web application framework, using the command npm install express.
Install Mongoose, the Object Document Mapping (ODM) library for MongoDB, using the command npm install mongoose.
Install React, the front-end library, using the command npm install react.
Install additional dependencies as needed, such as react-dom, react-scripts, and cors.
Set up the project structure:

Create a new directory called server for your back-end code.
Create a new directory called client for your front-end code.
In the server directory, create an index.js file to set up the Express.js server.
In the client directory, create a new React app using create-react-app or a similar tool.
Connect the back-end and front-end:

In the server directory, configure the Express.js server to handle API requests and connect to the MongoDB database.
In the client directory, create React components and use the appropriate API calls to interact with the back-end.
Run the development environment:

Start the MongoDB server.
In the server directory, run node index.js to start the back-end server.
In the client directory, run npm start to start the front-end development server.

### Post Installations 

This is a of list things you need to use the software and how to install them.

1. Clone the repo
   ```sh
   git clone https://github.com/Advanced-computer-lab-2024/Rehla.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
### Environment Variables

The following environment variables are required to run the application:

PORT = 8000
MONGO_URI = mongodb+srv://Rehla:Rehla2024@rehla.35b5h.mongodb.net/REHLA?retryWrites=true&w=majority&appName=Rehla
AMADEUS_API_KEY=qLctFI8fqU7154VBw7z1IUCGWBPa1dCL
AMADEUS_API_SECRET=9j75tRpG4ts0dw6f

Make sure to create a .env file in the root directory of the project and add the necessary environment variables.

## Project Structure

The project follows a typical MERN stack structure with the following directories:
```sh
mern-project/
├── src/
│   ├── uploads/
│   ├── models/
│   ├── routes/
│   └── App.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── css/
│   │   ├── images/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── package.json 
└── .env
```
The src directory contains the back-end code, including controllers, models, and routes.
The client directory contains the front-end code, including React components, pages, Redux store, and styles.
The root directory contains the main package.json file and the .env file for environment variables.

## Deployment

To deploy the application, follow these steps:

Start the Express.js server in production mode:
```sh
cd src
```
```sh
node App.js
```

Build the production-ready React app:
```sh
cd client
```
```sh
npm start
```
Configure your hosting platform to serve the built React app and the Express.js server.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API References and Test Routes 
After the installations and deployment, you can use these API References and test routes for some testing.

### API References:

- axios.put(`${API_URL}/updateProduct`, productData);
- axios.get(`${API_URL}/getAllUpcomingEventsAndPlaces`);
- axios.get(`${API_URL}/sortActivities`, {params: { sortBy } });
- axios.get(`${API_URL}/filterActivities?${queryParams}`);
- axios.post(`${API_URL}/addProduct`, productData);
- axios.get(`${API_URL}/filterProductsByPrice/${minPrice}/${maxPrice}`);
- axios.post(`${API_URL}/checkout-order`, orderData);
- axios.get(`${API_URL}/getProductsSortedByRating`);
- fetch(`${API_URL}/searchByNameCategoryTag?searchTerm=${encodeURIComponent(searchTerm)}`);
- axios.delete(`${API_URL}/deleteUser/${email}`);
- axios.get(`${API_URL}/getCategory`);
- axios.delete(`${API_URL}/deleteCategory`, { data: categoryData });
- axios.get(`${API_URL}/getTag`);
- axios.put(`${API_URL}/updateTag/${currentTagName}`, newTagName);
- axios.post(`${API_URL}/createActivityByAdvert`, activityData);
- axios.get(`${API_URL}/viewAllComplaintsSortedByDate`);


### Test Routes:
- app.put("/payForTouristActivity",payForTouristActivity);
- app.put("/payForItinerary",payForItinerary);
- app.post("/createComplaint", createComplaint);
- app.post("/getMyComplaints" ,getMyComplaints);
- app.put("/productRateReview" , productRateReview);
- app.post("/commentOnEvent", commentOnEvent);
- app.delete("/deleteTouristActivity",deleteTouristActivity);
- app.post("/createTouristActivity",createTouristActivity);
- app.get('/getAllFiles', getAllFiles);
- app.put('/updateCartItem', updateCartItem);
- app.get("/getAllUnarchivedProducts", getAllUnarchivedProducts);
- app.post("/createTransportation", createTransportation);
- app.get("/viewAllTransportation", viewAllTransportation);
- app.post("/bookTransportation", bookTransportation);
- app.delete("/deleteRequest", deleteRequest);

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
##  Tourist Usage

![alt text](image.png)

Firstly, you can sign up to have an account to be able to explore everything on our website without constraints of being a guest. You will be able to navigate through pages using the navigation bar at the top of the page. From shopping gifts, to booking flights and hotels, all these things will be done by a click of a button on our website. 


![alt text](image-1.png)
Using the sign in page, it will be your gateway of exploring this endlessly fun experience. 


![alt text](image-3.png)
Here, you will be able to view all the activities that are on our website. You can navigate through them and click on any activity that you like to get to know al the information you need to know in order to jin this activity and enjoy it. 


![alt text](image-4.png)
Adding to that, you will also be able to check the iteneraries, where this is a group of activities in one unforgetable day to enjoy your day to the maximum. This is your gateway to do multiple activities that are related to each other. 


![alt text](image-5.png)
Further scrolling means more fun unlocked. You will be able to view different museums and Historical Places that you may find joyful.


![alt text](image-2.png)

Adding to that, you will be able to see whatever suits you the best without being obliged to view everything. 


![alt text](image-6.png)
Want some souvenirs? No worries, we got a full gift shop with all memorable item that you can purchase to remid you of your favourite world spot you recently visited. We have a wide range of products that will fill your heart as well as you loved ones' with wlove and joy.


![alt text](image-7.png)
Adding to that, you can check all the activities, events, iterneraries, historical places and musuems you enjoyed and visited right from the navigation bar when clicking on my events. 


![alt text](image-8.png)
 ![alt text](image-9.png)
Not only booking places to see or activities to enjoy, you can also book Hotels, Flights and Transportations from our website. By choosing the dates, place or whatever it takes to enjoy your trip will be found on REHLA!


![alt text](image-10.png)

You will find your profile picture on the right top of the website, next to it the notification icon and the cart.These will give you quick access to your notifications and viewing your cart easily.


![alt text](image-14.png)
When clicking on the profile picture, this is what will appear to you. You will be able to see your saved activities and events. Also, you can edit whatever you want in you profile by just clicking edit profile. 

And here what you will be seeing when clicking on edit profile:
![alt text](image-15.png)


![alt text](image-11.png)
This will help you check any notifications that you have.

![alt text](image-12.png)
Here it a glance of what your cart will look like. You will be able to remove anything from it as well as increasing the quantity and adding it to your wish list if you want to still save it for further notice. 

![alt text](image-13.png)

As you know, we support all tourists. According to that, we add currency change to make it easier for you to choose the currency you want to view everything on the website with. 




On our website, you will be able to fulfill whatever you want and see what you search for. With the customizable experience, you will recieve a promocode on your birthday, notifications to remind you of your activities, gifts to order and a wish list that is waiting for you to fill with gifts you want to purchase.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##  Admin Usage

By signing in, you will be able to access everything on the website. 

![alt text](image-16.png)
You will be able to view all the account requests to be approved or deleted. Also, using the navigation bar, you can see the products and will be able to manage the activities and users that need to be approved or deleted.

![alt text](image-17.png)
Adding to that, you will be able to view all the complaints by the tourists and can reply to it or resolve it and can see its state.

Also, you will be able to create promo codes. But also, you can check all the sale reports on the website. You can flag any activity or itenerary if you find it inappropriate.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##  Tour Guide Usage
As Tour Guide, you can create iteneraries, deactivate them or view the details regarding a certain itenerary of your choice.
![alt text](image-18.png)

And here is the creating form:
![alt text](image-19.png)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

##  Advertiser Usage
As an Advertiser, you can create activities, deactivate them or view the details regarding a certain activity
of your choice.
![alt text](image-20.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##  Tourism Governer Usage
As a tourism Goverrner, you can view the landmarks that you added on the website. Also, you can create different tags for them.
![alt text](image-21.png)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


##  Seller Usage
As a seller, you will be able to view all your products, a sales report for all the products saled and you will be able to add a product to the website freely.
![alt text](image-22.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Rehla -  rehlanotification@gmail.com

Project Link: [https://github.com/Advanced-computer-lab-2024/Rehla.git](https://github.com/Advanced-computer-lab-2024/Rehla.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


