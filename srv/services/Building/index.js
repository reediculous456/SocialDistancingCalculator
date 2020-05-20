const { Building, ChangeRequest, User, jsonify } = require(`../../database`);
const { CR_STATUSES } = require(`../../../constants`);

const BuildingService = {
  create: (building) => Building
    .forge()
    .save(building)
    .then(jsonify),

  delete: (id) => Building
    .where({ id })
    .save({ active: false }, { patch: true })
    .then(jsonify),

  getByIds: (ids) => Building
    .where(`id`, `IN`, ids)
    .fetchAll({
      require: true,
      withRelated: [ `address`, `address.state` ],
    })
    .then(jsonify),

  getForCampus: (campus_id, active = true) => Building
    .where({ campus_id })
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll({
      withRelated: [ `address`, `address.state` ],
    })
    .then(jsonify),

  getForUser: (id) => User
    .where({ active: true, id })
    .fetch({
      withRelated: [ `buildings`, `buildings.address`, `buildings.address.state`, `buildings.campus` ],
    })
    .then(jsonify)
    .then(user => user.buildings),

  getList: (active = true) => Building
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll({
      require: true,
      withRelated: [
        `address`,
        `address.state`,
        `campus`,
        {
          floors: qb => {
            if (active) {
              qb.where({ active });
            }
          },
        },
      ],
    })
    .then(jsonify)
    .then(async (buildings) => {
      for (const building of buildings) {
        building.activeRequests = 0;
        for (const floor of building.floors) {
          building.activeRequests += parseInt(await ChangeRequest
            .where({ floor_id: floor.id })
            .query(qb => {
              qb.innerJoin(
                `current_change_request_statuses`,
                `change_requests.id`,
                `current_change_request_statuses.change_request_id`,
              );
              qb.innerJoin(`change_request_statuses`, function() {
                this.on(`current_change_request_statuses.change_request_status_id`, `=`, `change_request_statuses.id`)
                  .andOn(`change_request_statuses.status_id`, `<>`, CR_STATUSES.COMPLETED);
              });
            })
            .count());
        }
        delete building.floors;
      }
      return buildings;
    }),

  update: (id, building) => Building
    .where({ id })
    .save(building, { patch: true })
    .then(jsonify),
};

module.exports = BuildingService;
