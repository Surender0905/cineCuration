module.exports = (sequelize, DataTypes) => {
    const CuratedList = sequelize.define(
        "CuratedList",
        {
            name: DataTypes.STRING,
            slug: DataTypes.STRING, // For public access
            description: DataTypes.STRING,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "curatedLists", // Explicitly specify the table name
        },
    );

    CuratedList.associate = (models) => {
        CuratedList.hasMany(models.CuratedListItem, {
            foreignKey: "curatedListId",
        });
    };

    return CuratedList;
};
