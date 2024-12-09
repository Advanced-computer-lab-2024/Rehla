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
3. [Usage](#usage)
4. [Deployment](#deployment)
5. [License](#license)
6. [Contact](#contact)




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



<!-- USAGE EXAMPLES -->
## Usage

![alt text](image.png)

Firstly, you can sign up to have an account to be able to explore everything on our website without constraints of being a guest. You will be able to navigate through pages using the navigation bar at the top of the page. From shopping gifts, to booking flights and hotels, all these things will be done by a click of a button on our website. 

![alt text](image-1.png)
Using the sign in page, it will be your gateway of exploring this endlessly fun experience. 

![alt text](image-2.png)
Adding to that, you will be able to see whatever suits you the best without being obliged to view everything. 

On our website, you will be able to fulfill whatever you want and see what you search for. With the customizable experience, you will recieve a promocode on your birthday, notifications to remind you of your activities, gifts to order and a wish list that is waiting for you to fill with gifts you want to purchase.

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Rehla -  rehlanotification@gmail.com

Project Link: [https://github.com/Advanced-computer-lab-2024/Rehla.git](https://github.com/Advanced-computer-lab-2024/Rehla.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


