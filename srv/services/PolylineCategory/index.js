const { PolylineCategory, jsonify } = require(`../../database`);

const PolylineCategoryService = {
  create: (polylineType) => PolylineCategory
    .forge()
    .save(polylineType)
    .then(jsonify),

  delete: (id) => PolylineCategory
    .where({ id })
    .save({ active: false }, { patch: true })
    .then(jsonify),

  getByIds: (ids) => PolylineCategory
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getList: (active = true) => PolylineCategory
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll({ require: true })
    .then(jsonify),

  update: (id, polylineType) => PolylineCategory
    .where({ id })
    .save(polylineType, { patch: true })
    .then(jsonify),
};

module.exports = PolylineCategoryService;
