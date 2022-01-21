const httpStatus = require('http-status');
// const logger = require('../config/logger');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).populate('image');
};

/**
 * Get public user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getPublicUser = async (id) => {
  return User.findById(id).populate({
    path: 'image habitats',
    populate: {
      path: 'owner',
      populate: {
        path: 'owners users moodboard projects article',
        populate: [
          { path: 'articles', match: { isPublished: true } },
          { path: 'image images moodboard', populate: { path: 'images' } },
        ],
      },
    },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email }).populate('image');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const createUserOwnerHabitat = async (userId, habitatId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // logger.info(user);
  user.habitats.owner.push(habitatId);
  user.habitats.current = habitatId;
  await user.save();
  return user;
};

const updateCurrentHabitat = async (userId, habitatId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.habitats.current = habitatId;
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Add a followed tag
 * @param {ObjectId} userId
 * @param {string} tag
 * @returns {Promise<User>}
 */
const addFollowedTag = async (userId, tag) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.followed_tags.addToSet(tag);
  await user.save();
  return user;
};

/**
 * Remove a followed tag
 * @param {ObjectId} userId
 * @param {string} tag
 * @returns {Promise<User>}
 */
const removeFollowedTag = async (userId, tag) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.followed_tags.pull(tag);
  await user.save();
  return user;
};

/**
 * Add a followed user
 * @param {ObjectId} userId
 * @param {string} followedUser
 * @returns {Promise<User>}
 */
const followUser = async (userId, followedUser) => {
  const user = await getUserById(userId);
  const followingUser = await getUserById(followedUser);
  if (!user || !followingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.followed_users.addToSet(followedUser);
  followingUser.followers.addToSet(userId);
  await user.save();
  await followingUser.save();
  return user;
};

/**
 * unfollowed user
 * @param {ObjectId} userId
 * @param {string} followedUser
 * @returns {Promise<User>}
 */
const unfollowUser = async (userId, followedUser) => {
  const user = await getUserById(userId);
  const unfollowingUser = await getUserById(followedUser);
  if (!user || !unfollowingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.followed_users.pull(followedUser);
  unfollowingUser.followers.pull(userId);
  await user.save();
  await unfollowingUser.save();
  return user;
};

/**
 * Add habitat to user
 * @param {ObjectId} userId
 * @param {ObjectId} habitatId
 * @returns {Promise<User>}
 */
const addHabitatToUser = async (userId, habitatId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.habitats.user.addToSet(habitatId);
  await user.save();
  return user;
};

/**
 * Get public users for following
 * @param {ObjectId} meId
 * @param {String} searchText
 * @returns {Promise<Users>}
 */
const getFollowingUsers = async (meId, searchText) => {
  const followedUsers = await User.findById(meId).select('followed_users');
  const users = await User.find({
    $and: [
      {
        $or: [
          { firstName: { $regex: searchText, $options: 'i' } },
          { lastName: { $regex: searchText, $options: 'i' } },
          { bio: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
          { phone: { $regex: searchText, $options: 'i' } },
        ],
      },
      { role: 'user' },
      { _id: { $ne: meId } },
      { _id: { $nin: followedUsers.followed_users } },
    ],
  }).populate([
    { path: 'image', select: 'url' },
    {
      path: 'habitats',
      match: { isArchived: false },
      populate: { path: 'owner', populate: { path: 'projects', match: { isPublic: true } } },
    },
  ]);
  return users;
};

/**
 * Get users followed
 * @param {ObjectId} userId
 * @returns {Promise<Users>}
 */
const getFollowedUsers = async (userId) => {
  return User.findById(userId).populate({
    path: 'followed_users',
    populate: [
      { path: 'image', select: 'url' },
      {
        path: 'habitats',
        populate: { path: 'owner', match: { isArchived: false }, populate: { path: 'projects', match: { isPublic: true } } },
      },
    ],
  });
};

/**
 * Get public users for following
 * @param {ObjectId} meId
 * @returns {Promise<Users>}
 */
const getAllUsers = async (meId) => {
  const users = await User.find(
    {
      $and: [{ role: 'user' }, { _id: { $ne: meId } }],
    },
    ['firstName', 'lastName', 'avatarColor']
  ).populate([{ path: 'image', select: 'url' }]);

  return users;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getPublicUser,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createUserOwnerHabitat,
  updateCurrentHabitat,
  addFollowedTag,
  removeFollowedTag,
  followUser,
  unfollowUser,
  addHabitatToUser,
  getFollowingUsers,
  getFollowedUsers,
  getAllUsers,
};
