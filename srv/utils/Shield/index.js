const SessionManager = require(`../SessionManager`);
const { TokenService } = require(`../../services`);
const config = require(`config`);

module.exports = async (req, res, next) => {
  try {
    await SessionManager.hasValidSession(req)
      .then(token => {
        req.token = token || req.headers.token;
        TokenService.decode(token)
          .then(user => {
            req.user = user;
            res.locals.user = user;
          });
      });
    next();
  } catch (err) {
    res.redirect(config.get(`loginEntryPoint`));
  }
};
