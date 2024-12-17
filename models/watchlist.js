module.exports = function (sequelize, DataTypes) {
    const Watchlist = sequelize.define(
        "Watchlist",
        {
            movieId: {
                type: DataTypes.INTEGER,
                references: { model: "Movies", key: "id" },
            },
            addedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "watchlists",
        },
    );

    Watchlist.associate = (models) => {
        Watchlist.belongsTo(models.Movie, { foreignKey: "movieId" });
    };

    return Watchlist;
};
