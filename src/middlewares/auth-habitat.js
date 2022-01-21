const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const authHabitat = () => async (req, res, next) => {
  if (!req.user) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  if (!req.params.habitatId) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'No habitats ID'));
  }

  // OLD CODE
  // const authHabitat = (owner) => async (req, res, next) => {
  // if (owner) {
  //   if (!req.user.habitats.owner.includes(req.params.habitatId)) {
  //     next(new ApiError(httpStatus.UNAUTHORIZED, "You don't own this habitats"));
  //   }
  // } else if (
  //   !req.user.habitats.owner.includes(req.params.habitatId) &&
  //   !req.user.habitats.user.includes(req.params.habitatId)
  // ) {
  //   console.log(owner, req.user);
  //   next(new ApiError(httpStatus.UNAUTHORIZED, "You aren't a member of this habitats"));
  // }

  if (!req.user.habitats.owner.includes(req.params.habitatId) && !req.user.habitats.user.includes(req.params.habitatId)) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to view this habitat'));
  }

  next();
};

module.exports = authHabitat;
