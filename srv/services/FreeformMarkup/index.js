const { FreeformMarkup, jsonify } = require(`../../database`);

const FreeformMarkupService = {
  create: (markup) => FreeformMarkup
    .forge()
    .save(markup)
    .then(jsonify),

  delete: (id) => FreeformMarkup
    .where({ id })
    .destory()
    .then(jsonify),

  getByIds: (ids) => FreeformMarkup
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getForUrn: (urn_id) => FreeformMarkup
    .where({ urn_id })
    .fetchAll()
    .then(jsonify),

  update: (id, markup) => FreeformMarkup
    .where({ id })
    .save(markup, { patch: true })
    .then(jsonify),
};

module.exports = FreeformMarkupService;
