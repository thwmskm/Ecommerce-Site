const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/Database"); // or your actual sequelize instance path

class OrderItem extends Model {
  static associate(models) {
    // Associate OrderItem with Order
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      onDelete: "CASCADE",
    });

    // Associate OrderItem with Vehicle
    // (Make sure `models.Vehicle` is defined and exported properly)
    OrderItem.belongsTo(models.Vehicle, {
      foreignKey: "vehicleId",
      onDelete: "CASCADE",
    });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // The foreign key referencing Order
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "orderId",
      references: {
        model: "Orders", // or 'Order' if that matches your actual table
        key: "id",
      },
    },
    // The foreign key referencing Vehicle
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "vehicleId",
      references: {
        model: "Vehicles", // or 'Vehicle' if that’s your actual table
        key: "vid", // if Vehicle’s primary key is 'vid'
      },
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "OrderItems",
    timestamps: false, // or true if you want Sequelize to handle it automatically
  }
);

module.exports = OrderItem;
