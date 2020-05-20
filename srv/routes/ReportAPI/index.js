const router = require(`express`).Router();
const { ReportService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/contact/base`, async (req, res, next) => {
  try {
    const buildings = await ReportService.getContactReport();

    ResponseHandler(
      res,
      `Sucessfully got contact report`,
      { buildings },
    );

  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/report`;
exports.needsShield = true;
