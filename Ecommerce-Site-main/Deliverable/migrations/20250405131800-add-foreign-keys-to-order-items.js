'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add FK constraint on order_id (no column creation)
    await queryInterface.addConstraint('OrderItems', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_order_items_order_id',
      references: {
        table: 'Orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    // Add FK constraint on vehicle_id (no column creation)
    await queryInterface.addConstraint('OrderItems', {
      fields: ['vehicle_id'],
      type: 'foreign key',
      name: 'fk_order_items_vehicle_id',
      references: {
        table: 'Vehicles',
        field: 'vid',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('OrderItems', 'fk_order_items_order_id');
    await queryInterface.removeConstraint('OrderItems', 'fk_order_items_vehicle_id');
  }
};
