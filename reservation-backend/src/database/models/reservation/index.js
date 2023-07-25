const Sequelize = require('sequelize');

const modelName = 'Reservation';
module.exports = sequelize => ({
    modelName,
    associate: ({ Reservation, Charger, User }) => {
        Reservation.belongsTo(Charger);
        Reservation.belongsTo(User);
    },
    model: sequelize
        .define(modelName, {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
            datetime: { type: Sequelize.DATE, allowNull: false },
        },
        {
            freezeTableName: true,
            tableName: 'reservation',
        }),
});