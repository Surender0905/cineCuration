module.exports = function (sequelize, DataTypes) {
    const CuratedListItem = sequelize.define(
        "CuratedListItem",
        {
            curatedListId: {
                type: DataTypes.INTEGER,
                references: { model: "CuratedLists", key: "id" },
            },
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
            tableName: "curatedListItems",
        },
    );

    CuratedListItem.associate = (models) => {
        CuratedListItem.belongsTo(models.Movie, { foreignKey: "movieId" });
        CuratedListItem.belongsTo(models.CuratedList, {
            foreignKey: "curatedListId",
        });
    };

    return CuratedListItem;
};
