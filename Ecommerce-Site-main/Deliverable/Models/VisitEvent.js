const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const VisitEvent = sequelize.define('VisitEvent', {
  id: {                                // NEW: Unique primary key for each event
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ipaddress: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  eventtype: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  vid: {
    type: DataTypes.STRING(20),
    allowNull: false,
  }
}, {
  tableName: 'VisitEvent',
  timestamps: false,      // No createdAt/updatedAt columns (optional)
  freezeTableName: true   // Prevents automatic pluralization of the table name
});

module.exports = VisitEvent;
