const router = require(`express`).Router();
const { FloorService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/building/:building_id`, async (req, res, next) => {
  try {
    const { params: { building_id }, query: { active } } = req;
    const floors = await FloorService.getForBuilding(building_id, active);

    ResponseHandler(
      res,
      `Successfully got floors for building`,
      { floors },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/floor`;
exports.needsShield = true;
