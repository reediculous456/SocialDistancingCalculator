const config = require(`config`);
const express = require(`express`);
const app = express();
const server = require(`http`).Server(app);
const { ErrorHandler, IndexRoute, Morgan, RouteLoader, logger } = require(`./utils`);
const favicon = require(`serve-favicon`);
const Redis = require(`redis`);
const session = require(`express-session`);
const RedisStore = require(`connect-redis`)(session);
const bodyParser = require(`body-parser`);
const boolParser = require(`express-query-boolean`);
const compression = require(`compression`);

const sesh = session({
  resave: true,
  saveUninitialized: true,
  secret: config.get(`cache.sessionKey`),
  store: new RedisStore({
    client: Redis.createClient({
      host: config.get(`cache.host`),
      pass: config.get(`cache.pass`),
      port: config.get(`cache.port`),
    }),
  }),
  ttl: config.has(`cache.ttl`) ? config.get(`cache.ttl`) : 86400,
});

app.use(sesh);
app.use(compression());
app.use(favicon(`${__dirname}/../public/images/uc_logo.png`));
app.set(`view engine`, `ejs`);
app.set(`views`, `${__dirname}/../views`);

app.use(bodyParser.json({ limit: `50mb` }));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(boolParser());
app.use(express.static(`${__dirname}/../public`));

if (process.env.NODE_ENV !== `dev`) {
  app.use(Morgan.before);
  app.use(Morgan.after);
}
RouteLoader(app)
  .then(() => {
    app.all(`/*`, IndexRoute);
    app.use(ErrorHandler);

    const PORT = config.get(`server.port`);
    server.listen(PORT, logger.info(`Listening on port ${PORT}`));
  })
  .catch(err => {
    logger.error(`Failed to start application`, err.stack);
    process.exit(1);
  });
