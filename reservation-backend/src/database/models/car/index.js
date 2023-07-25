const Sequelize = require('sequelize');

const modelName = "Car";
module.exports = sequelize => ({
  modelName,
  associate: ({Car, User}) => {
    Car.belongsTo(User);
  },
  model: sequelize
    .define(modelName, {
      id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true},
      make: {type: Sequelize.STRING, allowNull: false},
      model: {type: Sequelize.STRING, allowNull: false},
      year: {type: Sequelize.NUMBER, allowNull: false},
    },
    {
      freezeTableName: true,
      tableName: 'car',
    })
});