const _ = require(`lodash`);
const moment = require(`moment`);
const { CR_STATUSES } = require(`../../../constants`);
const { Bookshelf, ChangeRequest } = require(`../../database`);

const mapCountsToDate = (collection) => _.chain(collection)
  .map(value => ({ count: value.count, date: moment(value.date).format(`MM-DD-YYYY`) }))
  .keyBy(`date`)
  .mapValues(`count`)
  .value();

const addMissingKeys = (obj1, obj2) => {
  const obj1MissingKeys = _.keys(_.omitBy(obj2, (v, k) => obj1[k] !== undefined));
  const obj2MissingKeys = _.keys(_.omitBy(obj1, (v, k) => obj2[k] !== undefined));
  obj1MissingKeys.forEach(key => { obj1[key] = 0; });
  obj2MissingKeys.forEach(key => { obj2[key] = 0; });
};

const DashboardService = {
  getAvgClosedChangeRequestCountPerDay: () => Bookshelf.knex(`change_requests`)
    .select(
      Bookshelf.knex.raw(`COUNT(*) "count"`),
    )
    .innerJoin(
      `current_change_request_statuses`,
      `change_requests.id`,
      `current_change_request_statuses.change_request_id`,
    )
    .innerJoin(`change_request_statuses`, function() {
      this.on(`current_change_request_statuses.change_request_status_id`, `=`, `change_request_statuses.id`)
        .andOn(`change_request_statuses.status_id`, CR_STATUSES.COMPLETED);
    })
    .groupByRaw(`date_trunc('day', change_requests.created_on)`)
    .whereNull(`change_requests.deleted_on`)
    .andWhere(`change_requests.created_on`, `>`, moment().subtract(`30`, `days`))
    .then(rows => {
      const counts = rows.map(row => parseInt(row.count));
      for (let i = counts.length; i < 30; i += 1) {
        counts.push(0);
      }
      return _.mean(counts).toFixed(2);
    }),

  getAvgTimeToCompleteChangeRequest: () => Bookshelf.knex(`change_requests`)
    .select(
      Bookshelf.knex.raw(`AVG(change_request_statuses.created_on - change_requests.created_on)`),
    )
    .innerJoin(
      `current_change_request_statuses`,
      `change_requests.id`,
      `current_change_request_statuses.change_request_id`,
    )
    .innerJoin(`change_request_statuses`, function() {
      this.on(`current_change_request_statuses.change_request_status_id`, `=`, `change_request_statuses.id`)
        .andOn(`change_request_statuses.status_id`, CR_STATUSES.COMPLETED);
    })
    .whereNull(`change_requests.deleted_on`)
    .andWhere(`change_requests.created_on`, `>`, moment().subtract(`30`, `days`))
    .first()
    .then(row => {
      const { avg } = row;
      if (!avg) { return 0; }
      let { days } = avg;

      if (avg.hours) {
        days += avg.hours / 24;
      }

      if (avg.minutes) {
        days += avg.minutes / 60 / 24;
      }

      return Math.round(days * 100) / 100;
    }),

  getChangeRequestCountByDay: () => Bookshelf.knex(`change_requests`)
    .select(
      Bookshelf.knex.raw(`date_trunc('day', change_requests.created_on) "date"`),
      Bookshelf.knex.raw(`COUNT(*) "count"`),
    )
    .innerJoin(
      `current_change_request_statuses`,
      `change_requests.id`,
      `current_change_request_statuses.change_request_id`,
    )
    .innerJoin(`change_request_statuses`, function() {
      this.on(`current_change_request_statuses.change_request_status_id`, `=`, `change_request_statuses.id`)
        .andOn(`change_request_statuses.status_id`, `<>`, CR_STATUSES.COMPLETED);
    })
    .groupByRaw(1)
    .whereNull(`change_requests.deleted_on`)
    .andWhere(`change_requests.created_on`, `>`, moment().subtract(`30`, `days`))
    .then(opened => Bookshelf.knex(`change_requests`)
      .select(
        Bookshelf.knex.raw(`date_trunc('day', change_requests.created_on) "date"`),
        Bookshelf.knex.raw(`COUNT(*) "count"`),
      )
      .innerJoin(
        `current_change_request_statuses`,
        `change_requests.id`,
        `current_change_request_statuses.change_request_id`,
      )
      .innerJoin(`change_request_statuses`, function() {
        this.on(`current_change_request_statuses.change_request_status_id`, `=`, `change_request_statuses.id`)
          .andOn(`change_request_statuses.status_id`, CR_STATUSES.COMPLETED);
      })
      .groupByRaw(1)
      .whereNull(`change_requests.deleted_on`)
      .andWhere(`change_requests.created_on`, `>`, moment().subtract(`30`, `days`))
      .then(closed => {
        const closedMap = mapCountsToDate(closed);
        const openedMap = mapCountsToDate(opened);
        addMissingKeys(openedMap, closedMap);
        return [
          { data: _.map(closedMap, (y, x) => ({ x, y })), name: `closed` },
          { data: _.map(openedMap, (y, x) => ({ x, y })), name: `open` },
        ];
      })),

  getClosedChangeRequestCount: () => ChangeRequest
    .query(qb => {
      qb.innerJoin(
        `current_change_request_statuses`,
        `change_requests.id`,
        `current_change_request_statuses.change_request_id`,
      );
      qb.innerJoin(`change_request_statuses`, function() {
        this.on(`current_change_request_statuses.change_request_status_id`, `=`, `change_request_statuses.id`)
          .andOn(`change_request_statuses.status_id`, CR_STATUSES.COMPLETED);
      });
    })
    .where(`change_requests.created_on`, `>`, moment().subtract(`30`, `days`))
    .count(),

  getOpenChangeRequestCount: () => ChangeRequest
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
    .count(),
};

module.exports = DashboardService;
