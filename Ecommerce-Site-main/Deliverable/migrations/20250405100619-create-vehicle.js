'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      vid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      modelYear: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      shape: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hasAccidents: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      historyReport: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isHotDeal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      exColour: {
        type: Sequelize.STRING,
        allowNull: false
      },
      inColour: {
        type: Sequelize.STRING,
        allowNull: false
      },
      inFabric: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};
