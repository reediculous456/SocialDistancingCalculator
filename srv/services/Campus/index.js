const { Campus, User, jsonify } = require(`../../database`);

const CampusService = {
  create: (campus) => Campus
    .forge()
    .save(campus)
    .then(jsonify),

  delete: (id) => Campus
    .where({ id })
    .save({ active: false }, { patch: true })
    .then(jsonify),

  getByIds: (ids) => Campus
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getForUser: (id) => User
    .where({ active: true, id })
    .fetch({
      withRelated: [ `buildings.campus` ],
    })
    .then(jsonify)
    .then(user => user.buildings.map(building => building.campus)),

  getList: (active = true) => Campus
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll({ require: true })
    .then(jsonify),

  update: (id, campus) => Campus
    .where({ id })
    .save(campus, { patch: true })
    .then(jsonify),

};

module.exports = CampusService;
