const httpStatus = require('http-status');
const { PublicTag } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get all Tags
 * @returns {Promise<PublicTag[]]>}
 */
const getAllTags = async () => {
  const allTags = await PublicTag.distinct('name');
  return allTags;
};

/**
 * Create a new Tag
 * @param {Object} tagName
 * @returns {Promise<PublicTag>}
 */
const createTag = async (tagName) => {
  const tag = await PublicTag.create(tagName);
  return tag;
};

/**
 * Add project to public tag
 * @param {string} tagName
 * @param {ObjectId} projectId
 * @returns {Promise<PublicTag>}
 */
const addProjectToTag = async (tagName, projectId) => {
  let tag = await PublicTag.findOne({ name: tagName });
  if (!tag) {
    tag = await createTag({ name: tagName });
  }

  tag.projects.addToSet(projectId);
  await tag.save();
  return tag;
};

/**
 * Add project to public tag
 * @param {string} tagName
 * @param {ObjectId} projectId
 * @returns {Promise<PublicTag>}
 */
const removeProjectFromTag = async (tagName, projectId) => {
  const tag = await PublicTag.findOne({ name: tagName });
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  tag.projects.pull(projectId);
  await tag.save();
  return tag;
};

/**
 * Get all tags
 * @returns {Promise<PublicTag>}
 */
const getPopular = async () => {
  // const tags = await PublicTag.distinct('name');
  const tags = await PublicTag.aggregate([
    { $project: { tag: '$name', projects: { $size: '$projects' } } },
    { $limit: 10 },
    { $sort: { projects: -1 } },
  ]);
  return tags;
};

/**
 * Return all projects for followed tags
 *  @param {string[]} followedTags
 * @returns {Promise<PublicTag>}
 */
const getProjectsForFollowedTags = async (followedTags) => {
  // TODO need to write a query to exclude archived habitats
  const tags = await PublicTag.find({
    name: { $in: followedTags },
    projects: { $exists: true, $not: { $size: 0 } },
  })
    .populate({
      path: 'projects',
      populate: [
        { path: 'habitat', populate: { path: 'owners', populate: { path: 'image' } } },
        { path: 'moodboard', populate: { path: 'images' } },
      ],
    })
    .sort({ updatedAt: 'desc' });
  return tags;
};

module.exports = {
  getAllTags,
  createTag,
  addProjectToTag,
  removeProjectFromTag,
  getPopular,
  getProjectsForFollowedTags,
};
