const express = require("express");
const { sequelize } = require("./models");
const dotenv = require("dotenv");
const movieRoutes = require("./routes/movie");
const curatedListRoutes = require("./routes/curatedList");
const app = express();

// Load environment variables
dotenv.config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware and routes
app.use("/api/movies", movieRoutes);
app.use("/api", curatedListRoutes);

//connect to database
sequelize
    .authenticate()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.log("Error: " + err);
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
