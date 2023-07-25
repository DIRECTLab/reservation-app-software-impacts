'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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

    await queryInterface.createTable("FavoriteCharger", {
      ...shared,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("FavoriteCharger");
  }
};
