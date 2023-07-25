# Example Migration

This is a migration example for the model example. It includes how to create associations as well

To create a new migration file, run `npx sequelize migrations:generate --name xyz`

This will create an empty migration in this same folder which you can use

```js
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chargepoint', {
      id: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },


      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    
    await queryInterface.createTable('chargepointEntry', {
      id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
      portNumber: { type: Sequelize.INTEGER },
      status: { type: Sequelize.STRING },
      timestamp: { type: Sequelize.DATE },

      ChargepointId: {
        type: Sequelize.STRING,
        references: {
          model: 'chargepoint',
          key: 'id'
        },
        onUpdate: 'cascade'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },



  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chargepointEntry');
    await queryInterface.dropTable('chargepoint');
  }
};
```