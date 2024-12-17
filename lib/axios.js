const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3", // Base URL for TMDB API

    headers: {
        Authorization: `Bearer ${process.env.API_KEY}`, // Authorization header with your TMDB API key
        "Content-Type": "application/json", // Ensure that all requests are made with JSON content type
    },
});

module.exports = axiosInstance;
