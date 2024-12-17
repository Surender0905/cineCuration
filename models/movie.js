module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define(
        "Movie",
        {
            title: DataTypes.STRING,
            tmdbId: DataTypes.INTEGER, // TMDB Movie ID
            genre: DataTypes.TEXT,
            actors: DataTypes.TEXT,
            releaseYear: DataTypes.INTEGER,
            rating: DataTypes.FLOAT, // From TMDB
            description: DataTypes.TEXT,
        },
        {
            tableName: "movies", // Explicitly specify the table name
        },
    );

    Movie.associate = (models) => {
        Movie.hasMany(models.Review, { foreignKey: "movieId" });
        Movie.hasMany(models.Watchlist, { foreignKey: "movieId" });
        Movie.hasMany(models.CuratedListItem, { foreignKey: "movieId" });
        Movie.hasMany(models.Wishlist, { foreignKey: "movieId" });
    };

    return Movie;
};
