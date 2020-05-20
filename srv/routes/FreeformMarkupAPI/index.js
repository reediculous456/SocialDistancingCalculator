const router = require(`express`).Router();
const arrify = require(`arrify`);
const { FreeformMarkupService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.post(`/`, async (req, res, next) => {
  try {
    const { body: { markup: newMarkup }, user } = req;
    newMarkup.created_by = user.id;
    const markup = await FreeformMarkupService.create(newMarkup);

    ResponseHandler(
      res,
      `Successfully created freeform markup!`,
      { markup },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const [ markup ] = await FreeformMarkupService.getByIds(arrify(req.params.id));

    ResponseHandler(
      res,
      `Successfully got markup`,
      { markup },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/urn/:urn_id`, async (req, res, next) => {
  try {
    const markups = await FreeformMarkupService.getForUrn(req.params.urn_id);

    ResponseHandler(
      res,
      `Successfully got markups by floor`,
      { markups },
    );
  } catch (err) {
    next(err);
  }
});

router.put(`/:id`, async (req, res, next) => {
  try {
    const { body: { markup: updatedMarkup }, params: { id }, user } = req;
    if (updatedMarkup.deleted_on) {
      updatedMarkup.deleted_by = user.id;
    }

    const markup = await FreeformMarkupService.update(id, updatedMarkup);

    ResponseHandler(
      res,
      `Successfully updated freeform markup`,
      { markup },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/freeform-markup`;
exports.needsShield = true;
