const router = require(`express`).Router();
const { UserService } = require(`../../services`);
const { ResponseHandler, SessionManager } = require(`../../utils`);

router.post(`/`, async (req, res, next) => {
  try {
    const { password, username } = req.body;
    const token = await UserService.authenticate(username, password);
    delete req.body.username;
    delete req.body.password;
    await SessionManager.setSession(req, token);

    ResponseHandler(res, `login successful`);
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/login`;
