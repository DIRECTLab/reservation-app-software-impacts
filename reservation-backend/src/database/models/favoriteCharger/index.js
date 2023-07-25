const Sequelize = require('sequelize');

const modelName = 'FavoriteCharger';
module.exports = sequelize => ({
    modelName,
    associate: ({ FavoriteCharger, Charger, User }) => {
      FavoriteCharger.belongsTo(Charger);
      FavoriteCharger.belongsTo(User);
    },
    model: sequelize
        .define(modelName, {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
        },
        {
            freezeTableName: true,
            tableName: 'favoritecharger',
        }),
});