'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Charger', [
      {
        name: 'charger1',
        latitude: 41.759814028614045,
        longitude: -111.81761918553795,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'charger2',
        latitude: 41.759815029001956,
        longitude: -111.81735767016022,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Charger', null, {});
  }
};
