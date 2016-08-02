'use strict';
var config = require(__dirname + '/../config');
var glob = require('glob');

// Start all bot services to update RDS database with crime data
var bots = glob.sync(config.root + '/bot/*bot.js');

// startbot function
function startBot(b) {
  console.log('starting bot ->' + b);
  try {
    require(b);
  }
  catch(e) {
    console.error('Error starting bot ' + b);
    console.error(e.message);
  }
}

// start each bot
bots.forEach(startBot);



