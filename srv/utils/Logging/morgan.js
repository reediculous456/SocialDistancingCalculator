const morgan = require(`morgan`);
const { stream } = require(`./winston`);

morgan.token(`id`, (req) => req.id);

morgan.token(`user`, (req) => req.user ? req.user.id : `no user`);

morgan.token(`params`, (req) => req.params ? JSON.stringify(req.params) : ``);

module.exports = {
  // eslint-disable-next-line max-len
  after: morgan(`:id - :user - :remote-addr [:date[iso]] :method :response-time :url HTTP/:http-version" :status :res[content-length]`, {
    immediate: false,
    stream,
  }),
  before: morgan(`:id - :remote-addr [:date[iso]] :method :url ":referrer" ":user-agent" -- :params`, {
    immediate: true,
    stream,
  }),
};
