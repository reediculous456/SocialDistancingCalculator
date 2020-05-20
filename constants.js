module.exports = {
  CR_STATUSES: {
    COMPLETED: 3,
    IN_PROGRESS: 2,
    SUBMITTED: 1,
  },
  REGEX: {
    PHONE_NUMBER_FORMAT: `($1) $2-$3`,
    VALID_PHONE_NUMBER: /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g,
  },
  ROLES: {
    ADMIN: 1,
    USER: 2,
  },
};
