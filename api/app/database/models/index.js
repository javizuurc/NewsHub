const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && 
           (file !== 'index.js') && 
           (file.slice(-3) == '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

if (db.Clave && !db.PalabraClave) {
  db.PalabraClave = db.Clave;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const { testConnection, syncModels } = require('../db');
db.testConnection = testConnection;
db.syncModels = syncModels;
db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;