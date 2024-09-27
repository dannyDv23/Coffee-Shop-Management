// Import necessary modules
const express = require('express');
const path = require('path');
const http = require('http');
const reload = require('reload');
require('dotenv').config(); // Load .env variables

// Import routers
const homeRoute = require('./routers/HomeRoute');
const aboutRoute =  require('./routers/AboutRoute');

// Create the Express app
const app = express();
const port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

// Use the blog routes
app.use('/', homeRoute); // Apply the blog routes
app.use('/about', aboutRoute); 
// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Enable live reload
reload(app);

