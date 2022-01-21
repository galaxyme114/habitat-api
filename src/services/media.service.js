const httpStatus = require('http-status');
const { Media } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Media asset
 * @param {Object} mediaBody
 * @returns {Promise<Media>}
 */
const createAsset = async (mediaBody) => {
  // Do i need to account for any errors
  const asset = await Media.create(mediaBody);
  return asset;
};

/**
 * Get Media asset by id
 * @param {ObjectId} id
 * @returns {Promise<Media>}
 */
const getAssetById = async (id) => {
  return Media.findById(id);
};

/**
 * Add tag to media asset
 * @param {ObjectId} id id of the asset to be updated
 * @param {[string]} tags array of tags to add
 * @returns {Promise<Media>}
 */
const addTagToAsset = async (id, tags) => {
  const media = await getAssetById(id);
  if (!media) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Media not found');
  }

  media.tags = tags;
  await media.save();
  // potentially return all media for front end update
  return media;
};

module.exports = {
  createAsset,
  getAssetById,
  addTagToAsset,
};
