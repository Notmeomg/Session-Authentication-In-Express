const { NODE_ENV } = require('dotenv').config().parsed;

const twoHours = 1000 * 60 * 60 * 2;

const development = {
  port: 3000,
  sess_duration: twoHours,
  sess_name: 'sid',
};

const config = {
  development,
};

module.exports = config[NODE_ENV];