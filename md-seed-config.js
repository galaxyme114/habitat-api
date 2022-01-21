const mongoose = require('mongoose');
const config = require('./src/config/config');
const logger = require('./src/config/logger');

const UsersSeeder = require('./src/models/seeders/users.seeder');

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
const seedersList = {
  UsersSeeder,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () => mongoose.connect(config.mongoose.url, config.mongoose.options);

/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
const dropdb = async () =>
  mongoose.connection.db.listCollections().toArray(async (err, names) => {
    if (err) {
      logger.error(err);
      return;
    }
    const responses = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < names.length; i++) {
      responses.push(mongoose.connection.db.dropCollection(names[i].name));
      logger.info(`\r\n${names[i].name} collection dropped.`);
    }
    await Promise.all(responses);
  });

module.exports = {
  seedersList,
  connect,
  dropdb,
};
