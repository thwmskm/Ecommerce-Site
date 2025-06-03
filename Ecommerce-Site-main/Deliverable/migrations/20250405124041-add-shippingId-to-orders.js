'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'shippingId', {
      type: Sequelize.INTEGER,
      allowNull: true // or false, depending on your logic
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'shippingId');
  }
};
