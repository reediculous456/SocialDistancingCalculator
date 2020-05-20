const router = require(`express`).Router();
const { FloorTypeService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const floor_types = await FloorTypeService.getList();

    ResponseHandler(
      res,
      `Successfully got floor types`,
      { floor_types },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/floor-type`;
exports.needsShield = true;
