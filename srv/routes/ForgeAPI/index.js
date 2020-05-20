const router = require(`express`).Router();
const forgeSDK = require(`forge-apis`);
const config = require(`config`);

router.get(`/token`, (req, res, next) => {
  try {
    const { client_id, client_secret } = config.get(`forge.credentials`);
    const scopes = config.get(`forge.scopePublic`);

    const forgeReq = new forgeSDK.AuthClientTwoLegged(client_id, client_secret, scopes);
    forgeReq.authenticate()
      .then(credentials => {
        const { access_token, expires_in } = credentials;
        res.json({ access_token, expires_in });
      });

  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/forge`;
exports.needsShield = true;
