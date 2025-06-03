const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/Database'); // or wherever your Sequelize instance lives

class Order extends Model {
  static associate(models) {
    // Define model associations here
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE'
    });
    Order.belongsTo(models.Shipping, {
      foreignKey: 'shippingId',
      onDelete: 'RESTRICT'
    });
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }
}

// Initialize the model *inside* the file
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
  },
  shippingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Shipping',
      key: 'sid',
    },
},
  },
  {
    sequelize,
    modelName: 'Order',
    timestamps: true,
  }
);


  /*Order.associate = (models) => {

    Order.hasMany(models.OrderItem, {foreignKey: 'orderId', onDelete: 'CASCADE'});

    Order.belongsTo(models.Shipping, {foreignKey: 'shippingId', onDelete: 'RESTRICT'});

    Order.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
  };*/

  module.exports = Order;