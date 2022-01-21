const httpStatus = require('http-status');
const { MoodBoard } = require('../models');
const ApiError = require('../utils/ApiError');
// const habitatService = require('./habitat.service');

/**
 * Create a moodboard
 * @param {Object} moodBoardBody
 * @returns {Promise<MoodBoard>}
 */
const createMoodBoard = async (moodBoardBody) => {
  const moodBoard = await MoodBoard.create(moodBoardBody);
  return moodBoard;
};

/**
 * Get moodboard by id
 * @param {ObjectId} id moodboard id
 * @returns {Promise<MoodBoard>}
 */
const getMoodBoardById = async (id) => {
  return MoodBoard.findById(id).populate('images').populate('habitat', 'name');
};

/**
 * Update moodboard by id
 * @param {ObjectId} id moodboard id
 * @param {Object} updateBody
 * @returns {Promise<MoodBoard>}
 */
const updateMoodBoardById = async (id, updateBody) => {
  const moodboard = await getMoodBoardById(id);
  if (!moodboard) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moodboard not found');
  }
  Object.assign(moodboard, updateBody);
  await moodboard.save();
  return moodboard;
};

/**
 * Add image to moodboard
 * @param {ObjectId} id moodboard id
 * @param {ObjectId} imageId
 * @returns {Promise<MoodBoard>}
 */
const addImageToMoodBoard = async (id, imageId) => {
  const moodboard = await getMoodBoardById(id);
  if (!moodboard) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moodboard not found');
  }
  moodboard.images.addToSet(imageId);
  await moodboard.save();
  return moodboard;
};

/**
 * Remove image from moodboard
 * @param {ObjectId} id moodboard id
 * @param {ObjectId} imageId
 * @returns {Promise<MoodBoard>}
 */
const removeImageFromMoodBoard = async (id, imageId) => {
  const moodboard = await getMoodBoardById(id);
  if (!moodboard) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moodboard not found');
  }
  moodboard.images.pull(imageId);
  await moodboard.save();
  return moodboard;
};

module.exports = {
  createMoodBoard,
  updateMoodBoardById,
  getMoodBoardById,
  addImageToMoodBoard,
  removeImageFromMoodBoard,
};
