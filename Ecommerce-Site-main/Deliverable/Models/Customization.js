const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/Database');

const Customization = sequelize.define('Customization', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'vid'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  priceAdjustment: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  createdAt: {  
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {  
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
  }
});

Customization.associate = (models) => {
  Customization.belongsTo(models.Vehicle, { foreignKey: 'vid' });
};

module.exports = Customization;
