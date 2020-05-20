const router = require(`express`).Router();
const arrify = require(`arrify`);
const { PolylineCategoryService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const polylineCategories = await PolylineCategoryService.getList(req.query.active);

    ResponseHandler(
      res,
      `Got polyline category list`,
      { polylineCategories },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const [ polylineCategory ] = await PolylineCategoryService.getByIds(arrify(req.params.id));

    ResponseHandler(
      res,
      `Successfully got the polyline category`,
      { polylineCategory },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/polyline-category`;
exports.needsShield = true;
