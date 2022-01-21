const httpStatus = require('http-status');
const { Habitat } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a habitats
 * @param {Object} habitatBody
 * @returns {Promise<Habitat>}
 */
const createHabitat = async (habitatBody) => {
  const habitat = await Habitat.create(habitatBody);
  return habitat;
};

/**
 * Query for habitats
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} - Array of id and habitats names
 * @param userId
 */
const queryHabitats = async (userId, archived = false) =>
  Habitat.find({ $and: [{ $or: [{ owners: userId }, { users: userId }] }, { isArchived: archived }] })
    .sort({ updatedAt: 'desc' })
    .populate({ path: 'owners users', populate: { path: 'image' } })
    .populate({ path: 'moodboard', populate: { path: 'images', select: 'url' } })
    .populate({
      path: 'projects',
      match: { isArchived: false },
      populate: {
        path: 'moodboard habitat articles',
        populate: [{ path: 'images', select: 'url' }, { path: 'owner' }, { path: 'project' }],
      },
    });

/**
 * Get habitats by id
 * @param {ObjectId} id
 * @returns {Promise<Habitat>}
 */
const getHabitatById = async (id) => {
  return Habitat.findById(id)
    .populate('owners users address')
    .populate({ path: 'moodboard', populate: { path: 'images', select: 'url' } })
    .populate({
      path: 'projects',
      match: { isArchived: false },
      populate: { path: 'moodboard', populate: { path: 'images', select: 'url tags' } },
    });
};

/**
 * Get habitats by id
 * @param {ObjectId} id
 * @returns {Promise<Habitat>}
 */
const getPublicHabitatById = async (id) => {
  return Habitat.findById(id)
    .populate('owners users address')
    .populate({ path: 'moodboard', populate: { path: 'images', select: 'url' } })
    .populate({
      path: 'projects',
      match: { isArchived: false, isPublic: true },
      populate: { path: 'moodboard', populate: { path: 'images', select: 'url' } },
    });
};

/**
 * Get habitats inspiration by id
 * @param {ObjectId} id
 * @returns {Promise<Habitat>}
 */
const getHabitatInspirationById = async (id) => {
  return Habitat.findById(id)
    .populate({ path: 'moodboard', populate: { path: 'images', select: 'url tags' } })
    .populate({
      path: 'projects',
      match: { isArchived: false },
      populate: {
        path: 'moodboard articles links notes roomPlans',
        populate: [{ path: 'images', select: 'url tags' }, { path: 'owner' }, { path: 'project' }],
      },
    });
};

/**
 * Update habitats by id
 * @param {ObjectId} habitatId
 * @param {Object} updateBody
 * @returns {Promise<Habitat>}
 */
const updateHabitatById = async (habitatId, updateBody) => {
  const habitat = await getHabitatById(habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }
  Object.assign(habitat, updateBody);
  await habitat.save();
  return habitat;
};

/**
 * Delete habitats by id
 * @param {ObjectId} habitatId
 * @returns {Promise<Habitat>}
 */
const deleteHabitatById = async (habitatId) => {
  const habitat = await getHabitatById(habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }

  // TODO Remove habitats from all associated users, and delete all media and other associated data
  // TODO Check if habitats is current and also remove that. Should this process be attached to the model?

  await habitat.remove();
  return habitat;
};

/**
 * Add a moodboard to a habitat
 * @param {ObjectId} habitatId
 * @param {ObjectId} projectId
 * @returns {Promise<Habitat>}
 */
const addProjectToHabitat = async (habitatId, projectId) => {
  const habitat = await getHabitatById(habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }
  habitat.projects.addToSet(projectId);
  await habitat.save();
  return habitat;
};

/**
 * Add user to habitat
 * @param {ObjectId} id habitat id
 * @param {ObjectId} userId
 * @returns {Promise<Habitat>}
 */
const addUserToHabitat = async (id, userId) => {
  // TODO should I keep the add user to habitat here or create a seperate route in habitat services.
  const habitat = await getHabitatById(id);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }
  habitat.users.addToSet(userId);
  await habitat.save();
  return habitat;
};

/**
 * Remove user from habitat
 * @param {ObjectId} id habitat id
 * @param {ObjectId} userId
 * @returns {Promise<MoodBoard>}
 */
const removeUserFromHabitat = async (id, userId) => {
  let habitat = await getHabitatById(id);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }

  habitat.users.pull(userId);
  await habitat.save();
  habitat = await getHabitatById(id);
  return habitat;
};

/**
 * Add pending user invite
 * @param {ObjectId} habitatId habitat id
 * @param {string} email user email
 * @returns {Promise<MoodBoard>}
 */
const addPendingInvite = async (habitatId, email) => {
  const habitat = await getHabitatById(habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }

  habitat.invites.addToSet(email);
  await habitat.save();
  return habitat;
};

/**
 * Remove pending user invite
 * @param {ObjectId} habitatId habitat id
 * @param {string} email user email
 * @returns {Promise<MoodBoard>}
 */
const removePendingInvite = async (habitatId, email) => {
  const habitat = await getHabitatById(habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }

  habitat.invites.pull(email);
  await habitat.save();
  return habitat;
};

module.exports = {
  createHabitat,
  queryHabitats,
  getHabitatById,
  getPublicHabitatById,
  getHabitatInspirationById,
  updateHabitatById,
  deleteHabitatById,
  addProjectToHabitat,
  addUserToHabitat,
  removeUserFromHabitat,
  addPendingInvite,
  removePendingInvite,
};
