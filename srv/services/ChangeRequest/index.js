const arrify = require(`arrify`);
const { ChangeRequest, ChangeRequestStatus, jsonify } = require(`../../database`);
const FloorService = require(`../Floor`);
const UrnService = require(`../Urn`);
const { CR_STATUSES } = require(`../../../constants`);

const ChangeRequestService = {

  create: (request) => ChangeRequest
    .forge()
    .save(request)
    .then(jsonify),

  getForBuilding: async (id) => {
    const floors = await FloorService.getForBuilding(id);
    const floor_ids = floors.map(floor => floor.id);
    const requests = await ChangeRequest
      .where(`floor_id`, `IN`, floor_ids)
      .fetchAll({
        withRelated: [
          `creator`,
          `status`,
          `status.type`,
          {
            statuses: qb => {
              qb.orderBy(`created_on`);
            },
          },
          `statuses.type`,
          `statuses.creator`,
        ],
      })
      .then(jsonify);
    return requests.map(request => {
      request.floor = floors.find(floor => floor.id === request.floor_id);
      return request;
    });
  },

  getForFloor: (floor_id) => ChangeRequest
    .where({ floor_id })
    .fetchAll()
    .then(jsonify),

  getForUrn: async (id) => {
    const [ urn ] = await UrnService.getByIds(arrify(id));
    return ChangeRequest
      .where({ floor_id: urn.floor_id })
      .fetchAll({
        withRelated: [
          `creator`,
          `status`,
          `status.type`,
          {
            statuses: qb => {
              qb.orderBy(`created_on`);
            },
          },
          `statuses.type`,
          `statuses.creator`,
        ],
      })
      .then(jsonify)
      .then(requests => requests.filter(
        request => request.status.status_id !== CR_STATUSES.COMPLETED,
      ));
  },

  getList: (startDate, endDate, showCompleted) => ChangeRequest
    .query(qb => {
      if (startDate) { qb.whereRaw(`date_trunc('day', created_on) >= '${startDate}'`); }
      if (endDate) { qb.whereRaw(`date_trunc('day', created_on) <= '${endDate}'`); }
    })
    .fetchAll({
      withRelated: [
        `creator`,
        `status`,
        `status.type`,
        {
          statuses: qb => {
            qb.orderBy(`created_on`);
          },
        },
        `statuses.type`,
        `statuses.creator`,
        `floor`,
        `floor.type`,
        `building`,
        `building.campus`,
      ],
    })
    .then(jsonify)
    .then(requests => {
      if (!showCompleted) {
        return requests.filter(
          request => request.status.status_id !== CR_STATUSES.COMPLETED,
        );
      }
      return requests;

    }),

  setStatus: (status) => ChangeRequestStatus
    .forge()
    .save(status)
    .then(jsonify),

  update: (id, request) => ChangeRequest
    .where({ id })
    .save(request, { patch: true })
    .then(jsonify),
};

module.exports = ChangeRequestService;
