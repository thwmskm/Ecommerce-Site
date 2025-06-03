const { DataTypes, Sequelize  } = require('sequelize');
const sequelize = require('../config/Database');

  const Analytics = sequelize.define('Analytics', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
      },
      timeStamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
          },
      }
  });

  Analytics.associate = (models) => {

    Analytics.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'SET NULL'});
  };

  module.exports = Analytics;