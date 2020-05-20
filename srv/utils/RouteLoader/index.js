const fs = require(`fs`);
const path = require(`path`);
const Shield = require(`../Shield`);
const DEFAULT_ROUTES_DIR = `${__dirname}/../../routes`;

const getDirectories = (srcpath) =>
  fs.readdirSync(srcpath).filter((file) =>
    fs.statSync(path.join(srcpath, file)).isDirectory());

module.exports = (app, routeDirectoryPath = DEFAULT_ROUTES_DIR) => new Promise((resolve, reject) => {
  if (!app) {
    return reject(`No app provided`);
  }

  if (!routeDirectoryPath) {
    return reject(`No path provided`);
  }

  const routeDirectories = getDirectories(routeDirectoryPath);

  routeDirectories.forEach(route => {
    const routerPath = path.resolve(path.join(routeDirectoryPath, route));
    const router = require(routerPath);
    const params = [ router.path ];

    if (router.needsShield) {
      params.push(Shield);
    }

    params.push(router.router);
    app.use.apply(app, params);
  });

  resolve();
});
