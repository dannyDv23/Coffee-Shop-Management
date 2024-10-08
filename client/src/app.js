// Import necessary modules
const express = require("express");
const path = require("path");
const http = require("http");
const reload = require("reload");
// const cookieParser = require('cookie-parser');
// const multer = require('multer');
require("dotenv").config(); // Load .env variables

// Import routers
const homeRoute = require("./routers/HomeRoute");
const loginRoute = require("./routers/LoginRoute");
const aboutRoute =  require('./routers/AboutRoute');
const manageEmployeeRoute = require('./routers/EmployeesRoute');
const inventoryRoute = require('./routers/InventoryRoute');

// Create the Express app
const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
const port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));

// Use the blog routes
app.use("/", homeRoute); 
app.use("/login", loginRoute);
app.use('/about', aboutRoute); 
app.use('/manage-employee', manageEmployeeRoute);
app.use('/inventory', inventoryRoute );
// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Enable live reload
reload(app);
