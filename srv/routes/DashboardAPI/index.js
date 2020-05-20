const router = require(`express`).Router();
const { DashboardService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/change-request/count/day`, async (req, res, next) => {
  try {
    const requestCounts = await DashboardService.getChangeRequestCountByDay();

    ResponseHandler(
      res,
      `Got request counts`,
      { requestCounts },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/change-request/count/open`, async (req, res, next) => {
  try {
    const requestCounts = await DashboardService.getOpenChangeRequestCount();

    ResponseHandler(
      res,
      `Got request counts`,
      { requestCounts },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/change-request/count/closed`, async (req, res, next) => {
  try {
    const requestCounts = await DashboardService.getClosedChangeRequestCount();

    ResponseHandler(
      res,
      `Got request counts`,
      { requestCounts },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/change-request/avg/closed`, async (req, res, next) => {
  try {
    const avgDays = await DashboardService.getAvgClosedChangeRequestCountPerDay();

    ResponseHandler(
      res,
      `Got request counts`,
      { avgDays },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/change-request/avg/time/closed`, async (req, res, next) => {
  try {
    const avgDays = await DashboardService.getAvgTimeToCompleteChangeRequest();

    ResponseHandler(
      res,
      `Got request counts`,
      { avgDays },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/dashboard`;
exports.needsShield = true;
