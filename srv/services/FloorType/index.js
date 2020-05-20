const { FloorType, jsonify } = require(`../../database`);

const FloorTypeService = {
  getList: () => FloorType
    .fetchAll()
    .then(jsonify),
};

module.exports = FloorTypeService;
