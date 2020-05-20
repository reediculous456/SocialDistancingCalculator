const router = require(`express`).Router();
const config = require(`config`);
const { UrnService } = require(`../../services`);
const { ResponseHandler } = require(`../../utils`);

router.post(`/floor/:floor_id`,
  UrnService.upload.single(`file`),
  (req, res, next) => {
    try {
      const { file, params: { floor_id }, user } = req;
      UrnService.create(file, floor_id, user.id);

      ResponseHandler(
        res,
        `Successfully uploaded floor plan`,
      );
    } catch (err) {
      next(err);
    }
  });

router.get(`/current`, async (req, res, next) => {
  try {
    const urns = await UrnService.getCurrentUrns(req.query.floor_ids);

    ResponseHandler(
      res,
      `Successfully got current urns for floors.`,
      { urns },
    );

  } catch (err) {
    next(err);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const file = await File.get(req.params.id);

    res.download(
      `${ config.get(`uploadDir`) }/${ file.localname }`,
      file.name,
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/building/:building_id`, async (req, res, next) => {
  try {
    const urns = await UrnService.getForBuilding(req.params.building_id);

    ResponseHandler(
      res,
      `Successfully got current urns for building.`,
      { urns },
    );

  } catch (err) {
    next(err);
  }
});

exports.router = router;
exports.path = `/api/urn`;
exports.needsShield = true;
