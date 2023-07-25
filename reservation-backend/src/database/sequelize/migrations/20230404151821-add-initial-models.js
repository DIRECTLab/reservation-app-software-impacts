'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const shared = {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      }
    };

    await queryInterface.createTable("Charger", {
      ...shared,
      name: { type: Sequelize.STRING },
      latitude: { type: Sequelize.FLOAT, allowNull: false },
      longitude: { type: Sequelize.FLOAT, allowNull: false },
    });

    await queryInterface.createTable("User", {
      ...shared,
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING },
    });

    await queryInterface.createTable("Reservation", {
      ...shared,
      datetime: { type: Sequelize.DATE, allowNull: false },
      ChargerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "User",
          key: 'id',
        },
        onUpdate: 'cascade',
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Charger");
  }
};
