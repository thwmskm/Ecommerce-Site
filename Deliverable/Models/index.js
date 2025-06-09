'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
require('dotenv').config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&         // ignore hidden files
      file !== basename &&              // ignore this index.js
      file.slice(-3) === '.js' &&       // only .js files
      file.indexOf('.test.js') === -1   // skip test files
    );
  })
  .forEach((file) => {
    // Import the class-based model directly:
    const model = require(path.join(__dirname, file));
    // We do *not* call it as a function now — it’s already initialized via .init in the model file
    db[model.name] = model;
  });

// Run all associations (if any):
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
