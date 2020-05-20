const router = require(`express`).Router();
const { UserService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const users = await UserService.getList();

    ResponseHandler(
      res,
      `Got users list`,
      { users },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/list/admins`, async (req, res, next) => {
  try {
    const users = await UserService.getAdmins();

    ResponseHandler(
      res,
      `Got admin users list`,
      { users },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/list/building/:building_id`, async (req, res, next) => {
  try {
    const users = await UserService.getForBuilding(req.params.building_id);

    ResponseHandler(
      res,
      `Got admin users list`,
      { users },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/user`;
exports.needsShield = true;
