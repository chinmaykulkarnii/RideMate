# RideMate
RideMate is a Bike and Car Pooling Website developed using MEAN stack.

## Introduction
Welcome to the Bike and Car Pooling Website, a graduation project developed using the MEAN stack (MongoDB, Express.js, Angular, Node.js). This platform aims to facilitate ride-sharing by connecting bike and car owners with individuals seeking rides, promoting efficient and eco-friendly transportation solutions.

## Features
User Registration and Authentication: Secure user sign-up and login functionality.
Ride Posting: Users can post available rides, specifying details such as origin, destination, date, time, and available seats.
Ride Searching: Users can search for available rides based on their requirements.
Booking Rides: Users can book available rides and receive confirmation notifications.
User Profiles: Detailed user profiles displaying ride history and ratings.

## Installation Guide

To set up and run the project locally, follow these steps:

Clone the Repository:
git clone https://github.com/chinmaykulkarnii/RideMate.git
cd RideMate

Install Backend Dependencies:
Navigate to the project root and install the required Node.js packages.
npm install

Install Frontend Dependencies:
Navigate to the ride-frontend directory and install Angular dependencies.
cd ride-frontend
npm install
cd ..

Configure Environment Variables:
Create a .env file in the project root and add necessary environment variables (e.g., MongoDB URI, JWT secret).

Run the Backend Server:
npm start

Run the Frontend Server:
Open a new terminal, navigate to the ride-frontend directory, and start the Angular development server.
cd ride-frontend
ng serve

## Usage
Register an Account:
Sign up as a new user by providing your details.

Post a Ride:
After logging in, navigate to the "Offer Ride" section and fill out the ride details.

Search for Rides:
Navigate to the "Get Ride" to find available rides that match your criteria.

Book a Ride:
Select a suitable ride from the search results and book it.

Manage Bookings:
View and manage your ride bookings through "My Bookings".
