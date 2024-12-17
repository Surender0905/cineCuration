const express = require("express");
const {
    searchMovies,
    addMovieToWatchList,
    addMoviesToWishlist,
    addMoviesToCuratedList,
    addReview,
    searchByGenreAndActor,
    sortMovies,
    getTop5Movies,
} = require("../controllers/movieController"); // Import the controller
const router = express.Router();

// Define the GET route for searching movies
router.get("/search", searchMovies);

// http://localhost:3000/api/movies/watchlist
router.post("/watchlist", addMovieToWatchList);

//http://localhost:3000/api/movies/wishlist
router.post("/wishlist", addMoviesToWishlist);

//http://localhost:3000/api/movies/curated-list

router.post("/curated-list", addMoviesToCuratedList);

//http://localhost:3000/api/movies/:movieId/reviews

router.post("/:movieId/reviews", addReview);

// http://localhost:3000/api/movies/searchByGenreAndActor?genre=Action&actor=Leonardo> DiCaprio

router.get("/searchByGenreAndActor", searchByGenreAndActor);

// http://localhost:3000/api/movies/sort?list=watchlist&sortBy=rating&order=ASC

router.get("/sort", sortMovies);

//http://localhost:3000/api/movies/top5

router.get("/top5", getTop5Movies);

module.exports = router;
