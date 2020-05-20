const router = require(`express`).Router();
const arrify = require(`arrify`);
const { ROLES } = require(`../../../constants`);
const { BuildingService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const { query: { active }, user } = req;
    let buildings;

    if (user.role.id === ROLES.ADMIN) {
      buildings = await BuildingService.getList(active);
    } else if (user.role.id === ROLES.USER) {
      buildings = await BuildingService.getForUser(user.id);
    }

    ResponseHandler(
      res,
      `Got buildings`,
      { buildings },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/campus/:campus_id`, async (req, res, next) => {
  try {
    const { params: { campus_id }, query: { active } } = req;
    const buildings = await BuildingService.getForCampus(campus_id, active);

    ResponseHandler(
      res,
      `Got buildings`,
      { buildings },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const [ building ] = await BuildingService.getByIds(arrify(req.params.id));

    ResponseHandler(
      res,
      `Got building`,
      { building },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/building`;
exports.needsShield = true;
