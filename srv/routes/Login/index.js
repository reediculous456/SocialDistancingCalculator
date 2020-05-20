const router = require(`express`).Router();
const { SessionManager } = require(`../../utils`);

router.get(`/`, (req, res, next) => {
  try {
    SessionManager.hasValidSession(req)
      .then(() => {
        res.redirect(`/`);
      })
      .catch(() => {
        res.render(`login`);
      });
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/login`;
