const httpStatus = require('http-status');
const { Link } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a link preview
 * @param {Object} linkBody
 * @returns {Promise<Link>}
 */
const createLink = async (linkBody) => {
  const link = await Link.create(linkBody);
  return link;
};

/**
 * Update a link preview
 * @param {ObjectId} linkId
 * @param {Object} linkBody
 * @returns {Promise<Link>}
 */
const updateLink = async (linkId, updateBody) => {
  const link = await Link.findById(linkId);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link not found');
  }
  Object.assign(link, updateBody);
  await link.save();
  return link;
};

/**
 * Delete a link preview
 * @param {ObjectId} linkId
 * @return {Promise<Link>}
 */
const deleteLink = async (linkId) => {
  const link = await Link.findById(linkId);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link not found');
  }
  await link.remove();
  return link;
};

module.exports = {
  createLink,
  updateLink,
  deleteLink,
};
