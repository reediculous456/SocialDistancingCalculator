const { State, jsonify } = require(`../../database`);

const StateService = {
  getList: () => State
    .fetchAll()
    .then(jsonify),
};

module.exports = StateService;
