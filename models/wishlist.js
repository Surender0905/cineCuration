module.exports = function (sequelize, DataTypes) {
    const Wishlist = sequelize.define(
        "Wishlist",
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
            tableName: "wishlists",
        },
    );

    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.Movie, { foreignKey: "movieId" });
    };

    return Wishlist;
};
