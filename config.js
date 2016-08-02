var path = require('path');
var rootPath = path.normalize(__dirname);
var env = process.env.NODE_ENV || 'development';

var reviveDb = {
  name: 'solace',
  username: 'reviveUser',
  password: 'Bs8tMGSBLTJSLmFWtyHcTnlo2T5nT9wB',
  options: {
    host: '173.194.234.125',
    port: 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
};

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'Solace Bot'
    },
    port: 8080,
    reviveDb: reviveDb
  },

  test: {
    root: rootPath,
    app: {
      name: 'Solace Bot'
    },
    port: 8080,
    reviveDb: reviveDb
  },

  production: {
    root: rootPath,
    app: {
      name: 'Solace Bot'
    },
    port: 8080,
    reviveDb: reviveDb
  }
};

module.exports = config[env];
