// models/ItemSold.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/Database");

const ItemSold = sequelize.define(
  "ItemSold",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    vid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "Vehicles",
        key: "vid",
      },
      onDelete: "CASCADE",
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantitySold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price_at_sale: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "items_sold",
    timestamps: false,
  }
);

module.exports = ItemSold;
