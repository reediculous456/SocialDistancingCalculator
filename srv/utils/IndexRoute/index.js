const SessionManager = require(`../SessionManager`);
const { TokenService } = require(`../../services`);

module.exports = async (req, res) => {
  try {
    const token = await SessionManager.hasValidSession(req);
    const user = await TokenService.decode(token);

    res.render(`index`, {
      token: req.session.token,
      user,
    });
  } catch (err) {
    await SessionManager.destroySession(req);

    res.redirect(`/login`);
  }
};
