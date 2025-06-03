const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/Database");

const User = sequelize.define("User", {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

User.associate = (models) => {
  User.hasMany(models.Order, { foreignKey: "userId", onDelete: "CASCADE" });

  User.hasMany(models.Shipping, { foreignKey: "userId", onDelete: "CASCADE" });

  User.hasMany(models.VisitEvent, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(models.Analytics, {
    foreignKey: "userId",
    onDelete: "SET NULL",
  });
};

module.exports = User;
