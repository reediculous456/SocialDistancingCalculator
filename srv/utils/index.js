const ErrorHandler = require(`./ErrorHandler`);
const IndexRoute = require(`./IndexRoute`);
const Morgan = require(`./Logging/morgan`);
const ResponseHandler = require(`./ResponseHandler`);
const RouteLoader = require(`./RouteLoader`);
const SessionManager = require(`./SessionManager`);
const Sheild = require(`./Shield`);
const { logger } = require(`./Logging/winston`);

module.exports = {
  ErrorHandler,
  IndexRoute,
  Morgan,
  ResponseHandler,
  RouteLoader,
  SessionManager,
  Sheild,
  logger,
};
