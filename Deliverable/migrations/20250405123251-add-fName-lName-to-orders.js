'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'fName', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Orders', 'lName', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'fName');
    await queryInterface.removeColumn('Orders', 'lName');
  }
};
