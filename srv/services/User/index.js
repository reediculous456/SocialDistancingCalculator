const { Building, User, jsonify } = require(`../../database`);
const { ROLES } = require(`../../../constants`);
const ActiveDirectoryService = require(`../ActiveDirectory`);
const TokenService = require(`../Token`);
const { logger } = require(`../../utils/Logging/winston`);

const UserService = {
  authenticate: async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error(`Invalid parameters provided`);
      }

      const [ adUser ] = await ActiveDirectoryService.find({ username: username.toLowerCase() });

      if (!adUser) {
        throw new Error(`Wrong Username`);
      }

      const user = await UserService.upsert({
        email: adUser.email.toLowerCase(),
        name: adUser.name,
        phone: adUser.phone ? adUser.phone : null,
        username: adUser.username.toLowerCase(),
      });

      if (!user.active) {
        throw new Error(`Inactive User`);
      }

      await ActiveDirectoryService.authenticate(
        username,
        password,
      );

      return TokenService.generate({
        user: {
          id: user.id,
          role_id: user.role_id,
        },
      });
    } catch (err) {
      logger.error(``, err);
      throw new Error(`Invalid Username or Password`);
    }
  },

  getAdmins: () => User
    .where({ role_id: ROLES.ADMIN })
    .fetchAll({
      withRelated: [ `role` ],
    })
    .then(jsonify),

  getByIds: (ids) => User
    .where(`id`, `IN`, ids)
    .fetchAll({ require: true })
    .then(jsonify),

  getByUsername: (username) => User
    .where({ username })
    .fetch({
      require: true,
      withRelated: [ `role` ],
    })
    .then(jsonify),

  getForBuilding: (id) => Building
    .where({ id })
    .fetch({
      withRelated: [ `users` ],
    })
    .then(jsonify)
    .then(building => building.users),

  getList: () => User
    .fetchAll({
      withRelated: [ `role` ],
    })
    .then(jsonify),

  upsert: (user) => User
    .where({ username: user.username })
    .upsert(user)
    .then(jsonify),
};

module.exports = UserService;
