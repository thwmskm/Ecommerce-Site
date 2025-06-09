'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Orders', 'total_price', 'totalPrice');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Orders', 'totalPrice', 'total_price');
  }
};
