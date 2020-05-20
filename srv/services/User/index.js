const { Building, User, jsonify } = require(`../../database`);
const { ROLES } = require(`../../../constants`);
const TokenService = require(`../Token`);
const bcrypt = require(`bcrypt`);
const SALT_ROUNDS = 10;

const UserService = {
  authenticate: async (username, password) => {
    try {
      const user = await UserService.getByUsername(username.toLowerCase());
      const authResult = bcrypt.compareSync(password, user.password);
      if (!authResult) { throw new Error(); }
      delete user.password;
      return TokenService.generate({ user });
    } catch {
      throw new Error(`Invalid Username or Password`);
    }
  },

  create: (user) => {
    const { password } = user;
    user.password = bcrypt.hashSync(password, SALT_ROUNDS);
    return User
      .forge()
      .save(user)
      .then(jsonify);
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
};

module.exports = UserService;
