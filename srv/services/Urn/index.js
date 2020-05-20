const config = require(`config`);
const multer = require(`multer`);
const _ = require(`lodash`);
const { Floor, Urn, jsonify } = require(`../../database`);

const UrnService = {
  getByIds: (ids) => Urn
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),
  getCurrentUrns: (ids) => Floor
    .where(`id`, `IN`, ids)
    .fetchAll({
      require: true,
      withRelated: [ `currentUrn.urn`, `currentUrn.urn.floor` ],
    })
    .then(jsonify)
    .then(floors => floors.map(floor => floor.currentUrn.urn)),

  getForBuilding: (building_id) => Floor
    .where({ building_id })
    .fetchAll({
      require: true,
      withRelated: [ `urns`, `urns.uploader`, `urns.floor`, `urns.floor.type` ],
    })
    .then(jsonify)
    .then(floors => {
      const urns = floors.map(floor => floor.urns);
      return _.flattenDeep(urns);
    }),

  upload: multer({ dest: config.get(`uploadDir`) }),
  // uploadForFloor: (file, floor_id ) => {
  //   return new Promise((resolve, reject) => {
  //     if (!token) {
  //       return reject(`No token provided`);
  //     }

  //     if (!file) {
  //       return reject(`No filepath provided`);
  //     }

  //     const original = {
  //       originalname: file.originalname,
  //       mimetype: file.mimetype,
  //       size: file.size
  //     };

  //     const uploadFile = fs.createReadStream(file.path);

  //     const options = {
  //       uri: `${config.api.url}/floor-plan/floor/${floor_id}`,
  //       method: `POST`,
  //       headers: {
  //         'application': config.api.appId,
  //         'token': token
  //       },
  //       formData: {
  //         file: uploadFile
  //       },
  //       qs: original,
  //       json: true
  //     };

  //     request(options, (error, response, body) => {
  //       if (response.statusCode === 403) {
  //         return reject(`Unauthorized`);
  //       }

  //       if (response.statusCode !== 200) {
  //         return reject(`Request error`);
  //       }

  //       resolve(body.data.file);
  //     });

  //   });
  // },
  // createCadFileForFloor: (file, floorId, uploadedBy) => {
  //   return new Promise((resolve, reject) => {
  //     if (!token) {
  //       return reject(`No token provided`);
  //     }
  //     if (!file) {
  //       return reject(`No filepath provided`);
  //     }

  //     const original = {
  //       originalname: file.originalname,
  //       mimetype: file.mimetype,
  //       size: file.size,
  //       uploadedBy: uploadedBy
  //     };

  //     const uploadFile = fs.createReadStream(file.path);

  //     const options = {
  //       uri: `${ config.api.url }/file/cadfile/floor/${floorId}`,
  //       method: `POST`,
  //       headers: {
  //         application: config.api.appId,
  //         token
  //       },
  //       formData: {
  //         file: uploadFile
  //       },
  //       qs: original,
  //       json: true
  //     };

  //     request(options, (error, response, body) => {

  //       if (response.statusCode === 403) {
  //         return reject(`Unauthorized`);
  //       }
  //       if (response.statusCode !== 200) {
  //         return reject(`Request error`);
  //       }

  //       resolve(body);
  //     });

  //   });
  // },
};

module.exports = UrnService;
