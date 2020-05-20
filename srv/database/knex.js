const config = require(`config`);

module.exports = require(`knex`)({
  client: config.get(`database.dialect`),
  connection: {
    database: config.get(`database.connection.database`),
    host: config.get(`database.connection.host`),
    password: config.get(`database.connection.password`),
    port: config.get(`database.connection.port`),
    user: config.get(`database.connection.username`),
  },
  debug: false,
  version: config.get(`database.version`),
});
