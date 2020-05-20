const router = require(`express`).Router();
const arrify = require(`arrify`);
const { PolylineTypeService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const polylineTypes = await PolylineTypeService.getList(req.query.active);

    ResponseHandler(
      res,
      `Got polyline type List`,
      { polylineTypes },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/category/:category_id`, async (req, res, next) => {
  try {
    const { params: { category_id }, query: { active } } = req;
    const polylineTypes = await PolylineTypeService.getForCategory(category_id, active);

    ResponseHandler(
      res,
      `Got polyline types`,
      { polylineTypes },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const [ polylineType ] = await PolylineTypeService.getByIds(arrify(req.params.id));

    ResponseHandler(
      res,
      `Successfully got the polyline type`,
      { polylineType },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/polyline-type`;
exports.needsShield = true;
