'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderItems', 'vehicleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Vehicles',
        key: 'vid'  // 👈 this is the correct column to reference
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderItems', 'vehicleId');
  }
};
