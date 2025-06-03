'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisitEvent', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ipaddress: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      day: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      vid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Vehicles', // Ensure this matches your Vehicles table name
          key: 'vid'         // Adjust if your primary key is named differently
        },
        onDelete: 'CASCADE'
      },
      eventtype: {
        type: Sequelize.STRING(20),
        allowNull: false
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
    await queryInterface.dropTable('VisitEvent');
  }
};
