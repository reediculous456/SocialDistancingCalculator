const knex = require(`./knex`);
const Bookshelf = require(`bookshelf`)(knex);
Bookshelf.plugin(require(`bookshelf-soft-delete`));

const User = Bookshelf.Model.extend({
  tableName: `users`,
  buildings() { // eslint-disable-line sort-keys
    return this.belongsToMany(Building);
  },
  createdChangeRequests() {
    return this.hasMany(ChangeRequest, `created_by`);
  },
  createdFreeformMarkups() {
    return this.hasMany(FreeformMarkup, `created_by`);
  },
  deletedFreeformMarkups() {
    return this.hasMany(FreeformMarkup, `deleted_by`);
  },
  role() {
    return this.belongsTo(Role);
  },
  updatedChangeRequests() {
    return this.hasMany(ChangeRequest, `updated_by`);
  },
  urns() {
    return this.hasMany(Urn, `uploaded_by`);
  },
});

const Role = Bookshelf.Model.extend({
  tableName: `roles`,
  users() {
    return this.hasMany(User);
  },
});

const Campus = Bookshelf.Model.extend({
  tableName: `campuses`,
  buildings() { // eslint-disable-line sort-keys
    return this.hasMany(Building);
  },
});

const Building = Bookshelf.Model.extend({
  tableName: `buildings`,
  address() { // eslint-disable-line sort-keys
    return this.belongsTo(Address);
  },
  campus() {
    return this.belongsTo(Campus);
  },
  floors() {
    return this.hasMany(Floor);
  },
  users() {
    return this.belongsToMany(User);
  },
});

const Address = Bookshelf.Model.extend({
  tableName: `addresses`,
  building() { // eslint-disable-line sort-keys
    return this.hasOne(Building);
  },
  state() {
    return this.belongsTo(State);
  },
});

const State = Bookshelf.Model.extend({
  tableName: `states`,
  addresses() { // eslint-disable-line sort-keys
    return this.hasMany(Address);
  },
});

const Floor = Bookshelf.Model.extend({
  tableName: `floors`,
  building() { // eslint-disable-line sort-keys
    return this.belongsTo(Building);
  },
  changeRequests() {
    return this.hasMany(ChangeRequest);
  },
  currentUrn() {
    return this.hasOne(CurrentUrn);
  },
  type() {
    return this.belongsTo(FloorType);
  },
  urns() {
    return this.hasMany(Urn);
  },
});

const FloorType = Bookshelf.Model.extend({
  tableName: `floor_types`,
  floors() { // eslint-disable-line sort-keys
    return this.hasMany(Floor);
  },
});

const Urn = Bookshelf.Model.extend({
  tableName: `urns`,
  floor() { // eslint-disable-line sort-keys
    return this.belongsTo(Floor);
  },
  latest() {
    return this.hasOne(CurrentUrn);
  },
  polylines() {
    return this.hasMany(Polyline);
  },
  uploader() {
    return this.belongsTo(User, `uploaded_by`);
  },
});

const FreeformMarkup = Bookshelf.Model.extend({
  tableName: `freeform_markups`,
  soft: [ `deleted_on` ], // eslint-disable-line sort-keys
  changeRequest() { // eslint-disable-line sort-keys
    return this.belongsTo(ChangeRequest);
  },
  creator() {
    return this.belongsTo(User, `created_by`);
  },
  deletor() {
    return this.belongsTo(User, `deleted_by`);
  },
  type() {
    return this.hasOne(MarkupType, `type_id`);
  },
});

const MarkupType = Bookshelf.Model.extend({
  tableName: `markup_types`,
  markups() { // eslint-disable-line sort-keys
    return this.belongsToMany(FreeformMarkup, `type_id`);
  },
});

const ChangeRequest = Bookshelf.Model.extend({
  tableName: `change_requests`,
  soft: [ `deleted_on` ], // eslint-disable-line sort-keys
  building() { // eslint-disable-line sort-keys
    return this.belongsTo(Building).through(Floor);
  },
  creator() {
    return this.belongsTo(User, `created_by`);
  },
  floor() {
    return this.belongsTo(Floor);
  },
  freeformMarkups() {
    return this.hasMany(FreeformMarkup);
  },
  status() {
    return this.hasOne(ChangeRequestStatus)
      .through(CurrentChangeRequestStatus, `id`, `change_request_id`, `change_request_status_id`);
  },
  statuses() {
    return this.hasMany(ChangeRequestStatus);
  },
  updator() {
    return this.belongsTo(User, `updated_by`);
  },
});

const ChangeRequestStatus = Bookshelf.Model.extend({
  tableName: `change_request_statuses`,
  changeRequest() { // eslint-disable-line sort-keys
    return this.belongsTo(ChangeRequest);
  },
  creator() {
    return this.belongsTo(User, `created_by`);
  },
  type() {
    return this.belongsTo(ChangeRequestStatusType, `status_id`);
  },
});

const CurrentChangeRequestStatus = Bookshelf.Model.extend({
  tableName: `current_change_request_statuses`,
  request() { // eslint-disable-line sort-keys
    return this.belongsTo(ChangeRequest);
  },
  status() {
    return this.belongsTo(ChangeRequestStatus);
  },
});

const ChangeRequestStatusType = Bookshelf.Model.extend({
  tableName: `change_request_status_types`,
  statuses() { // eslint-disable-line sort-keys
    return this.hasMany(ChangeRequestStatus, `status_id`);
  },
});

const CurrentUrn = Bookshelf.Model.extend({
  tableName: `current_urns`,
  floor() { // eslint-disable-line sort-keys
    return this.belongsTo(Floor);
  },
  urn() {
    return this.belongsTo(Urn);
  },
});

const Polyline = Bookshelf.Model.extend({
  tableName: `polylines`,
  type() {
    return this.belongsTo(PolylineType);
  },
  urn() {
    return this.belongsTo(Urn);
  },
});

const PolylineCategory = Bookshelf.Model.extend({
  tableName: `polyline_categories`,
  polylineTypes() { // eslint-disable-line sort-keys
    return this.hasMany(PolylineType);
  },
});

const PolylineType = Bookshelf.Model.extend({
  tableName: `polyline_types`,
  category() { // eslint-disable-line sort-keys
    return this.belongsTo(PolylineCategory);
  },
  polylines() {
    return this.hasMany(Polyline);
  },
});

module.exports = {
  Address,
  Bookshelf,
  Building,
  Campus,
  ChangeRequest,
  ChangeRequestStatus,
  CurrentChangeRequestStatus,
  CurrentUrn,
  Floor,
  FloorType,
  FreeformMarkup,
  MarkupType,
  Polyline,
  PolylineCategory,
  PolylineType,
  Role,
  State,
  Urn,
  User,
  jsonify: ele => ele.toJSON(),
};
