const router = require(`express`).Router();
const arrify = require(`arrify`);
const { CampusService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const { query: { active } } = req;

    const campuses = await CampusService.getList(active);

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
