const httpStatus = require('http-status');
const { RoomPlan } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an roomPlan
 * @param {Object} roomPlanBody
 * @returns {Promise<Article>}
 */
const createRoomPlan = async (data) => {
  const roomPlan = await RoomPlan.create(data);
  return roomPlan;
};

/**
 * Get roomPlan by id
 * @param {ObjectId} id
 * @returns {Promise<RoomPlan>}
 */
const getRoomPlanById = async (id) => {
  return RoomPlan.findById(id)
    .populate({ path: 'project', populate: { path: 'habitat' } })
    .populate('owner');
};

/**
 * Update roomPlan by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Habitat>}
 */
const updateRoomPlanById = async (id, updateBody, userId) => {
  const roomPlan = await getRoomPlanById(id);
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room Plan not found');
  }

  roomPlan.snapShots.push({
    owner: userId,
    state: updateBody,
  });
  await roomPlan.save();
  return roomPlan;
};

/**
 * Delete a roomPlan
 * @param {ObjectId} roomPlanId
 * @return {Promise<Link>}
 */
const deleteRoomPlan = async (roomPlanId) => {
  const roomPlan = await RoomPlan.findById(roomPlanId);
  if (!roomPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room Plan not found');
  }
  await roomPlan.remove();
  return roomPlan;
};

module.exports = {
  createRoomPlan,
  getRoomPlanById,
  updateRoomPlanById,
  deleteRoomPlan,
};
