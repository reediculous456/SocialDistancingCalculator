const { Address, jsonify } = require(`../../database`);

const AddressService = {
  create: (address) => Address
    .forge()
    .save(address)
    .then(jsonify),
};

module.exports = AddressService;
