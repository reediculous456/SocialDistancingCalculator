const { Building, ChangeRequest, Floor, jsonify } = require(`../../database`);
const { CR_STATUSES } = require(`../../../constants`);

const FloorService = {
  create: (floor) => Floor
    .forge()
    .save(floor)
    .then(jsonify),

  getByIds: (ids) => Floor
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getForBuilding: (id, active = true) => Building
    .where({ id })
    .fetch({
      withRelated: [
        {
          floors: qb => {
            if (active) {
              qb.where({ active });
            }
          },
        },
        `floors.type`,
      ],
    })
    .then(jsonify)
    .then(building => building.floors)
    .then(async (floors) => {
      for (const floor of floors) {
        floor.activeRequests = parseInt(await ChangeRequest
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
      return floors;
    }),

  getList: (active = true) => Floor
    .query(qb => {
      if (active) { qb.where(`active`, active); }
    })
    .fetchAll()
    .then(jsonify),

  update: (id, floor) => Floor
    .where({ id })
    .save(floor, { patch: true })
    .then(jsonify),
};

module.exports = FloorService;
