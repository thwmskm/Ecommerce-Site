const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/Database');

const Vehicle = sequelize.define(
  'Vehicle',
  {
    vid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shape: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mileage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hasAccidents: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    historyReport: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isHotDeal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    exColour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inColour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inFabric: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null if no image provided
    }
  },
  {
    timestamps: true,          // automatically adds createdAt/updatedAt columns
    // If you want to control the column names, you can do:
    // createdAt: 'createdAt',
    // updatedAt: 'updatedAt',
  }
);

Vehicle.associate = (models) => {
  Vehicle.hasMany(models.OrderItem, {
    foreignKey: 'vehicleId',
    onDelete: 'CASCADE',
  });
};

module.exports = Vehicle;
