const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { updatedUser } = req.body;
  const user = await userService.updateUserById(req.params.userId, updatedUser);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const followTag = catchAsync(async (req, res) => {
  const { tag } = req.body;
  const { userId } = req.params;
  const user = await userService.addFollowedTag(userId, tag);

  res.send(user);
});

const unfollowTag = catchAsync(async (req, res) => {
  const { tag } = req.body;
  const { userId } = req.params;
  const user = await userService.removeFollowedTag(userId, tag);

  res.send(user);
});

const followUser = catchAsync(async (req, res) => {
  const { followedUser } = req.body;
  const { userId } = req.params;
  const user = await userService.followUser(userId, followedUser);

  res.send(user);
});

const unfollowUser = catchAsync(async (req, res) => {
  const { followedUser } = req.body;
  const { userId } = req.params;
  const user = await userService.unfollowUser(userId, followedUser);

  res.send(user);
});

const getFollowingUsers = catchAsync(async (req, res) => {
  const { searchText, meId } = req.query;
  const users = await userService.getFollowingUsers(meId, searchText);

  res.send(users);
});

const getFollowedUsers = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const followedUsers = await userService.getFollowedUsers(userId);

  res.send(followedUsers);
});

const getAllUsers = catchAsync(async (req, res) => {
  const { meId } = req.query;
  const users = await userService.getAllUsers(meId);

  res.send(users);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  followTag,
  unfollowTag,
  followUser,
  unfollowUser,
  getFollowingUsers,
  getFollowedUsers,
  getAllUsers,
};
