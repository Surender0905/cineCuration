const {
    searchMovie,
    movieExistsInDB,
    fetchMovieAndCastDetails,
} = require("../services/movieService");
const {
    Watchlist,
    Wishlist,
    CuratedListItem,
    Movie,
    Review,
} = require("../models");
const { Op } = require("sequelize");

// Controller function to handle the search for movies
const searchMovies = async (req, res) => {
    const { query } = req.query; // Extract the query parameter from the URL

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        // Call the service to search for movies
        const data = await searchMovie(query);

        // Return the result in JSON format
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error from controller", error.message);
        return res.status(500).json({ error: error + " folder controller" });
    }
};

///add movie to watch list

const addMovieToWatchList = async (req, res) => {
    try {
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(404).json({ error: "Movie ID is required" });
        }

        // Check if the movie exists in DB
        let movie;
        const movieExists = await movieExistsInDB(+movieId);

        if (!movieExists) {
            // Fetch movie details and save to DB
            movie = await fetchMovieAndCastDetails(movieId);
        } else {
            movie = await Movie.findOne({ where: { tmdbId: movieId } });
        }

        //check if movie exists in watch list table
        const movieExistsInWatchlist = await Watchlist.findOne({
            where: { movieId: movie.id },
        });

        if (movieExistsInWatchlist) {
            return res
                .status(400)
                .json({ error: "Movie already exists in watchlist" });
        }

        // Add movie to watchlist
        await Watchlist.create({ movieId: movie.id });
        return res
            .status(200)
            .json({ message: "Movie added to watchlist successfully." });
    } catch (error) {
        console.log("movie controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const addMoviesToWishlist = async (req, res) => {
    try {
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(404).json({ error: "Movie ID is required" });
        }

        // Check if the movie exists in DB
        let movie;
        const movieExists = await movieExistsInDB(+movieId);

        if (!movieExists) {
            // Fetch movie details and save to DB
            movie = await fetchMovieAndCastDetails(movieId);
        } else {
            movie = await Movie.findOne({ where: { tmdbId: movieId } });
        }

        //check if movie exists in watch list table
        const movieExistsInWatchlist = await Wishlist.findOne({
            where: { movieId: movie.id },
        });

        if (movieExistsInWatchlist) {
            return res
                .status(400)
                .json({ error: "Movie already exists in watchlist" });
        }

        // Add movie to watchlist
        await Wishlist.create({ movieId: movie.id });
        return res
            .status(200)
            .json({ message: "Movie added to wishlist successfully." });
    } catch (error) {
        console.log("movie controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const addMoviesToCuratedList = async (req, res) => {
    try {
        const { movieId, curatedListId } = req.body;

        if (!movieId || !curatedListId) {
            return res
                .status(404)
                .json({ error: "Movie ID and Curated List ID are required" });
        }

        // Check if the movie exists in DB
        let movie;
        const movieExists = await movieExistsInDB(+movieId);
        console.log("movie", movieExists);

        if (!movieExists) {
            // Fetch movie details and save to DB
            movie = await fetchMovieAndCastDetails(movieId);
        } else {
            movie = await Movie.findOne({ where: { tmdbId: movieId } });
        }

        //check if movie exists in curated list item

        const movieExistsInCuratedList = await CuratedListItem.findOne({
            where: { movieId: movie.id, curatedListId },
        });

        if (movieExistsInCuratedList) {
            return res
                .status(400)
                .json({ error: "Movie already exists in curated list" });
        }

        // Add movie to curated list
        await CuratedListItem.create({ movieId: movie.id, curatedListId });
        return res
            .status(200)
            .json({ message: "Movie added to curated list successfully." });
    } catch (error) {
        console.log("movie controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const { movieId } = req.params;

        // Validation
        if (rating < 0 || rating > 10) {
            return res
                .status(400)
                .json({ message: "Rating must be between 0 and 10." });
        }

        if (reviewText.length > 500) {
            return res
                .status(400)
                .json({ message: "Review text must be under 500 characters." });
        }

        // Check if the movie exists in DB
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found." });
        }

        // Add review to movie
        const review = await Review.create({ rating, reviewText, movieId });

        return res
            .status(200)
            .json({ message: "Review added successfully.", review });
    } catch (error) {
        console.log("movie controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const searchByGenreAndActor = async (req, res) => {
    try {
        const { genre, actor } = req.query;
        // Validate query parameters
        if (!genre && !actor) {
            return res.status(400).json({
                message:
                    "Please provide at least one search parameter: genre or actor.",
            });
        }

        const whereConditions = {
            ...(genre && { genre: { [Op.iLike]: `%${genre}%` } }), // If genre is provided, add it to the whereConditions
            ...(actor && { actors: { [Op.iLike]: `%${actor}%` } }), // If actor is provided, add it to the whereConditions
        };

        const movies = await Movie.findAll({
            where: whereConditions,
            limit: 10,
        });

        return res.status(200).json({ movies });
    } catch (error) {
        console.log("movie controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const sortMovies = async (req, res) => {
    try {
        const { list, sortBy, order = "ASC" } = req.query;

        // Validate the sortBy parameter (only rating or releaseYear allowed)
        if (!["rating", "releaseYear"].includes(sortBy)) {
            return res.status(400).json({
                message:
                    "Invalid sortBy parameter. Use 'rating' or 'releaseYear'.",
            });
        }

        // Validate the order parameter (only ASC or DESC allowed)
        if (!["ASC", "DESC"].includes(order.toUpperCase())) {
            return res.status(400).json({
                message: "Invalid order parameter. Use 'ASC' or 'DESC'.",
            });
        }

        let listModel;

        if (list === "watchlist") {
            listModel = Watchlist;
        } else if (list === "wishlist") {
            listModel = Wishlist;
        } else if (list === "curatedlist") {
            listModel = CuratedListItem;
        } else {
            return res.status(400).json({
                message:
                    "Invalid list parameter. Use 'watchlist', 'wishlist', or 'curatedlist'.",
            });
        }

        const movies = await listModel.findAll({
            where: {},
            include: [
                {
                    model: Movie,
                    attributes: [
                        "id",
                        "title",
                        "tmdbId",
                        "genre",
                        "actors",
                        "releaseYear",
                        "rating",
                    ],
                },
            ],
            order: [[Movie, sortBy, order]],
        });

        const resultMovies = movies.map((entry) => ({
            title: entry.Movie.title,
            tmdbId: entry.Movie.tmdbId,
            genre: entry.Movie.genre,
            actors: entry.Movie.actors,
            releaseYear: entry.Movie.releaseYear,
            rating: entry.Movie.rating,
        }));

        res.status(200).json({
            movies: resultMovies,
        });
    } catch (error) {
        console.log("Error:controller " + error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getTop5Movies = async (req, res) => {
    try {
        const movies = await Movie.findAll({
            limit: 5,
            order: [["rating", "DESC"]],
            include: [
                {
                    model: Review,
                    attributes: ["rating", "reviewText"],
                },
            ],
        });

        const resultMovies = movies.map((movie) => {
            const reviewText = movie.Reviews[0]
                ? movie.Reviews[0].reviewText
                : "No review available";
            const wordCount = reviewText
                ? reviewText.split(" ").filter(Boolean).length
                : 0;

            return {
                title: movie.title,
                rating: movie.rating,
                review: {
                    text: reviewText,
                    wordCount: wordCount,
                },
            };
        });

        return res.json({ movies: resultMovies });
    } catch (error) {
        console.log("movie controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    searchMovies,
    addMovieToWatchList,
    addMoviesToWishlist,
    addMoviesToCuratedList,
    addReview,
    searchByGenreAndActor,
    sortMovies,
    getTop5Movies,
};
