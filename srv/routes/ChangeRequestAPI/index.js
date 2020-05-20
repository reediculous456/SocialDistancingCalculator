const router = require(`express`).Router();
const { ChangeRequestService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.get(`/list`, async (req, res, next) => {
  try {
    const { endDate, showCompleted, startDate } = req.query;
    const requests = await ChangeRequestService.getList(startDate, endDate, showCompleted);

    ResponseHandler(
      res,
      `Got requests`,
      { requests },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/building/:building_id`, async (req, res, next) => {
  try {
    const requests = await ChangeRequestService.getForBuilding(req.params.building_id);

    ResponseHandler(
      res,
      `Got requests`,
      { requests },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/urn/:urn_id`, async (req, res, next) => {
  try {
    const requests = await ChangeRequestService.getForUrn(req.params.urn_id);

    ResponseHandler(
      res,
      `Got requests`,
      { requests },
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/`, async (req, res, next) => {
  try {
    const { body: { request: newRequest }, user } = req;
    newRequest.created_by = user.id;
    const request = await ChangeRequestService.create(newRequest);

    ResponseHandler(
      res,
      `created request`,
      { request },
    );
  } catch (err) {
    next(err);
  }
});

router.delete(`/:id`, async (req, res, next) => {
  try {
    const request = await ChangeRequestService.update(req.params.id, { deleted_on: new Date() });

    ResponseHandler(
      res,
      `deleted request`,
      { request },
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/status`, async (req, res, next) => {
  try {
    const { body: { status: newStatus }, user } = req;
    newStatus.created_by = user.id;
    const status = await ChangeRequestService.setStatus(newStatus);

    ResponseHandler(
      res,
      `Set change request status`,
      { status },
    );
  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/change-request`;
exports.needsShield = true;
