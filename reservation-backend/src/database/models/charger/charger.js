const Sequelize = require('sequelize');

const modelName = 'Charger';
module.exports = sequelize => ({
    modelName,
    associate: ({ Reservation, Charger, FavoriteCharger }) => {
        Charger.hasMany(Reservation);
        Charger.hasMany(FavoriteCharger);
    },
    model: sequelize
        .define(modelName, {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
            name: { type: Sequelize.STRING },
            latitude: { type: Sequelize.FLOAT, allowNull: false },
            longitude: { type: Sequelize.FLOAT, allowNull: false },
        },
        {
            freezeTableName: true,
            tableName: 'charger',
        }),
});