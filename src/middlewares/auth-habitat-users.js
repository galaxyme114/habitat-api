const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const authHabitatUsers = () => async (req, res, next) => {
  if (!req.user) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  if (!req.params.habitatId) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'No habitats ID'));
  }

  if (!req.user.habitats.owner.includes(req.params.habitatId) && !req.user.habitats.admin.includes(req.params.habitatId)) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to manage habitat users'));
  }

  next();
};

module.exports = authHabitatUsers;
