const { Polyline, jsonify } = require(`../../database`);

const PolylineService = {
  create: (polyline) => Polyline
    .forge()
    .save(polyline)
    .then(jsonify),

  delete: (id) => PolylineService
    .where({ id })
    .save({ active: false }, { patch: true })
    .then(jsonify),
  getByIds: (ids) => Polyline
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getByObjectId: (object_id, urn_id) => Polyline
    .where({ object_id, urn_id })
    .fetch()
    .then(jsonify),

  getForUrn: (urn_id) => Polyline
    .where({ urn_id })
    .fetchAll()
    .then(jsonify),

  update: (id, polyline) => Polyline
    .where({ id })
    .save(polyline, { patch: true })
    .then(jsonify),
};

module.exports = PolylineService;
