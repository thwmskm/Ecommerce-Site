'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Orders', 'user_id', 'userId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Orders', 'userId', 'user_id');
  }
};
