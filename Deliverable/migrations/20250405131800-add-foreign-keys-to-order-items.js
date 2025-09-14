"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("OrderItems", {
      fields: ["orderId"],
      type: "foreign key",
      name: "fk_order_items_order_id",
      references: {
        table: "Orders",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("OrderItems", {
      fields: ["vehicleId"],
      type: "foreign key",
      name: "fk_order_items_vehicle_id",
      references: {
        table: "Vehicles",
        field: "vid",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "OrderItems",
      "fk_order_items_order_id"
    );
    await queryInterface.removeConstraint(
      "OrderItems",
      "fk_order_items_vehicle_id"
    );
  },
};
