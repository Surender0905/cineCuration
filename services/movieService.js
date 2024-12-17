const axiosInstance = require("../lib/axios");
const { Movie } = require("../models");

const getActors = async (movieId) => {
    try {
        const response = await axiosInstance.get(`/movie/${movieId}/credits`);

        const actors = response.data.cast
            .filter((actor) => actor.known_for_department === "Acting")
            .map((actor) => actor.name)
            .join(", ");
        return actors;
    } catch (error) {
        console.error("Error fetching actors:", error.message);
        return "";
    }
};

const searchMovie = async (query) => {
    try {
        const response = await axiosInstance.get("/search/movie", {
            params: { query }, // The query parameter passed from the request URL
        });

        const movies = await Promise.all(
            response.data.results.map(async (movie) => {
                const actors = await getActors(movie.id); // Get actors for each movie
                return {
                    title: movie.title,
                    tmdbId: movie.id,
                    genre: movie.genre_ids.join(", "), // Join genre IDs into a string
                    actors,
                    releaseYear: new Date(movie.release_date).getFullYear(),
                    rating: movie.vote_average,
                    description: movie.overview,
                };
            }),
        );

        return { movies };
    } catch (error) {
        console.error("Error searching for movies:", error.message);
        throw new Error(error.message);
    }
};

const movieExistsInDB = async (tmdbId) => {
    try {
        const movie = await Movie.findOne({
            where: { tmdbId },
        });

        return movie ? true : false;
    } catch (error) {
        console.error("Error checking if movie exists:", error.message);
        throw new Error(error.message);
    }
};

const fetchMovieAndCastDetails = async (tmdbId) => {
    try {
        const movieDetails = await axiosInstance.get(`/movie/${tmdbId}`);

        const castDetails = await axiosInstance.get(`/movie/${tmdbId}/credits`);

        const actors = castDetails.data.cast
            .filter((actor) => actor.known_for_department === "Acting")
            .slice(0, 5)
            .map((actor) => actor.name)
            .join(", ");

        // Extract genre as a comma-separated string
        const genre = movieDetails.data.genres
            .map((genre) => genre.name)
            .join(", ");

        // Save the movie to the database
        const movie = await Movie.create({
            title: movieDetails.data.title,
            tmdbId: movieDetails.data.id,
            genre,
            actors,
            releaseYear: new Date(movieDetails.data.release_date).getFullYear(),
            rating: movieDetails.data.vote_average,
            description: movieDetails.data.overview,
        });

        return movie;
    } catch (error) {
        console.error("Error fetching movie details services:", error.message);
        throw new Error(error.message);
    }
};
module.exports = { searchMovie, movieExistsInDB, fetchMovieAndCastDetails };
