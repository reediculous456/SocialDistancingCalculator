const { PolylineType, jsonify } = require(`../../database`);

const PolylineTypeService = {
  create: (polylineType) => PolylineType
    .forge()
    .save(polylineType)
    .then(jsonify),

  delete: (id) => PolylineType
    .where({ id })
    .save({ active: false }, { patch: true })
    .then(jsonify),

  getByIds: (ids) => PolylineType
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getForCategory: (polyline_category_id, active = true) => PolylineType
    .where({ polyline_category_id })
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll()
    .then(jsonify),

  getList: (active = true) => PolylineType
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll({ require: true })
    .then(jsonify),

  update: (id, polylineType) => PolylineType
    .where({ id })
    .save(polylineType, { patch: true })
    .then(jsonify),
};

module.exports = PolylineTypeService;
