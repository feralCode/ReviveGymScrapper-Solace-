'use strict';
var config = require(__dirname + '/../config');
var Sequelize = require('sequelize');
var DataTypes = Sequelize;

var db = new Sequelize(
  config.reviveDb.name,
  config.reviveDb.username,
  config.reviveDb.password,
  config.reviveDb.options
);

// Models
var Event = db.import(__dirname + '/Event');
Event.sync();

module.exports = {
  db: db,
  Event: Event
};
