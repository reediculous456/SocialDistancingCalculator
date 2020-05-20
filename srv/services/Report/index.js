const { Address, jsonify } = require(`../../database`);

const ReportService = {
  get: () => Address
    .fetchAll()
    .then(jsonify),
};

module.exports = ReportService;
