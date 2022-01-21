const catchAsync = require('../utils/catchAsync');

const get = catchAsync(async (req, res) => {
  const result = {
    statuses: {
      active: 'Active',
      inactive: 'Inactive',
    },
    roles: {
      super: 'Super Administrator',
      admin: 'Administrator',
      user: 'User',
    },
    themes: {
      light: 'Light',
      dark: 'Dark',
    },
  };
  res.send(result);
});

module.exports = {
  get,
};
