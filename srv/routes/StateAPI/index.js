const router = require(`express`).Router();
const { StateService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const states = await StateService.getList();

    ResponseHandler(
      res,
      `Successfully got states`,
      { states },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/state`;
exports.needsShield = true;
