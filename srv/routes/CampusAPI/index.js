const router = require(`express`).Router();
const arrify = require(`arrify`);
const { ROLES } = require(`../../../constants`);
const { CampusService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const { query: { active }, user } = req;
    let campuses;

    if (user.role.id === ROLES.ADMIN) {
      campuses = await CampusService.getList(active);
    } else if (user.role.id === ROLES.user) {
      campuses = await CampusService.getForUser(user.id);
    }

    ResponseHandler(
      res,
      `Got Campus List`,
      { campuses },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const [ campus ] = await CampusService.getByIds(arrify(req.params.id));

    ResponseHandler(
      res,
      `Successfully got the campus`,
      { campus },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/campus`;
exports.needsShield = true;
