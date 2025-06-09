// models/ItemSold.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const ItemSold = sequelize.define('ItemSold', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicleId: {
    type: DataTypes.STRING(255),
    field: 'vehicle_id',  // maps JS "vehicleId" -> DB "vehicle_id"
    allowNull: false
  },
  saleDate: {
    type: DataTypes.DATE,
    field: 'sale_date',   // maps JS "saleDate" -> DB "sale_date"
    allowNull: false
  },
  quantitySold: {
    type: DataTypes.INTEGER,
    field: 'quantity_sold', // maps JS "quantitySold" -> DB "quantity_sold"
    allowNull: false,
    defaultValue: 1
  },
  priceAtSale: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'price_at_sale', // maps JS "priceAtSale" -> DB "price_at_sale"
    allowNull: false
  }
}, {
  tableName: 'items_sold', 
  timestamps: false
});

module.exports = ItemSold;
