const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Project, Habitat } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get Project by id
 * @param {ObjectId} projectId
 * @returns {Promise<Project>}
 */
const getProjectById = async (projectId) => {
  return Project.findById(projectId)
    .populate('owners links')
    .populate({ path: 'moodboard', populate: { path: 'images' } })
    .populate({ path: 'habitat', populate: { path: 'users', populate: { path: 'image' } } })
    .populate({ path: 'articles', populate: { path: 'owner' } })
    .populate({ path: 'notes', populate: { path: 'owner', populate: { path: 'image' } } })
    .populate({ path: 'roomPlans', populate: { path: 'owner' } });
};

/**
 * Get Public Project by id
 * @param {ObjectId} projectId
 * @returns {Promise<Project>}
 */
const getPublicProjectById = async (projectId) => {
  return Project.findById(projectId)
    .populate('owners links')
    .populate({ path: 'moodboard', populate: { path: 'images' } })
    .populate({ path: 'habitat' })
    .populate({ path: 'articles', match: { isPublished: true }, populate: { path: 'owner' } })
    .populate({ path: 'notes', populate: { path: 'owner', populate: { path: 'image' } } })
    .populate({ path: 'roomPlans', populate: { path: 'owner' } });
};

/**
 * Create a moodboard
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */
const createProject = async (projectBody) => {
  const moodBoard = await Project.create(projectBody);
  return moodBoard;
};

/**
 * Update project by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Habitat>}
 */
const updateProjectById = async (projectId, updateBody) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  Object.assign(project, updateBody);
  await project.save();
  return project;
};

/**
 * Add a moodboard to a project
 * @param {ObjectId} projectId
 * @param {ObjectId} moodboardId
 * @returns {Promise<Project>}
 */
const addMoodboardToProject = async (projectId, moodboardId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.moodboard = moodboardId;
  await project.save();
  return project;
};

/**
 * Add a article to a project
 * @param {ObjectId} projectId
 * @param {ObjectId} articleId
 * @returns {Promise<Project>}
 */
const addArticleToProject = async (projectId, articleId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.articles.addToSet(articleId);
  await project.save();
  return project;
};

/**
 * Add a note to a project
 * @param {ObjectId} projectId
 * @param {ObjectId} noteId
 * @returns {Promise<Project>}
 */
const addNoteToProject = async (projectId, noteId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.notes.addToSet(noteId);
  await project.save();
  return project;
};

/**
 * Add link preview to a project
 * @param {ObjectId} projectId
 * @param {ObjectId} linkId
 * @returns {Promise<Project>}
 */
const addLinkToProject = async (projectId, linkId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.links.addToSet(linkId);
  await project.save();
  return project;
};

/**
 * Add Tag to a project
 * @param {ObjectId} projectId
 * @param {String} tagName
 * @returns {Promise<Project>}
 */
const addTagToProject = async (projectId, tagName) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.tags.addToSet(tagName);
  await project.save();
  return project;
};

/**
 * Add roomplan to a project
 * @param {ObjectId} projectId
 * @param {ObjectId} roomPlanId
 * @returns {Promise<Project>}
 */
const addRoomPlanToProject = async (projectId, roomPlanId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  project.roomPlans.addToSet(roomPlanId);
  await project.save();
  return project;
};

/**
 * Remove Tag from a project
 * @param {ObjectId} projectId
 * @param {String} tagName
 * @returns {Promise<Project>}
 */
const removeTagFromProject = async (projectId, tagName) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.tags.pull(tagName);
  await project.save();
  return project;
};

/**
 * Remove Link from a project
 * @param {ObjectId} projectId
 * @param {ObjectId} linkId
 * @returns {Promise<Project>}
 */
const removeLinkFromProject = async (projectId, linkId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.links.pull(linkId);
  await project.save();
  return project;
};

/**
 * Remove Article from a project
 * @param {ObjectId} projectId
 * @param {ObjectId} articleId
 * @returns {Promise<Project>}
 */
const removeArticleFromProject = async (projectId, articleId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.articles.pull(articleId);
  await project.save();
  return project;
};

/**
 * Remove a Room Plan from a project
 * @param {ObjectId} projectId
 * @param {ObjectId} roomPlanId
 * @returns {Promise<Project>}
 */
const removeRoomPlanFromProject = async (projectId, roomPlanId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.roomPlans.pull(roomPlanId);
  await project.save();
  return project;
};

/**
 * Remove a Note from a project
 * @param {ObjectId} projectId
 * @param {ObjectId} noteId
 * @returns {Promise<Project>}
 */
const removeNoteFromProject = async (projectId, noteId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.notes.pull(noteId);
  await project.save();
  return project;
};

/**
 * Get projects by search term
 * @param {string} searchTerm
 * @returns {Promise<Project>}
 */
const getProjectsBySearchTerm = async (searchTerm) => {
  const projects = await Project.find({
    $and: [{ $or: [{ name: { $regex: searchTerm, $options: 'i' } }, { tags: searchTerm }] }, { isPublic: true }],
  })
    .populate({ path: 'moodboard', populate: { path: 'images', select: 'url' } })
    .populate({ path: 'habitat', populate: { path: 'owners', populate: { path: 'image' } } });
  return projects;
};

/**
 * Get projects by followed users
 * @param {string} searchTerm
 * @returns {Promise<Project>}
 */
const getProjectsByFollowedUsers = async (followedUsers) => {
  const typedUsers = followedUsers.map((user) => mongoose.Types.ObjectId(user));
  // Well isn't this a lovely query
  const habitats = Habitat.aggregate([
    { $match: { owners: { $in: typedUsers } } },
    { $lookup: { from: 'users', localField: 'owners', foreignField: '_id', as: 'owners' } },
    { $unwind: '$owners' },
    { $lookup: { from: 'projects', localField: 'projects', foreignField: '_id', as: 'projects' } },
    { $unwind: '$projects' },
    { $match: { 'projects.isPublic': true } },
    { $lookup: { from: 'moodboards', localField: 'projects.moodboard', foreignField: '_id', as: 'projects.moodboard' } },
    { $unwind: '$projects.moodboard' },
    { $replaceRoot: { newRoot: '$projects' } },
    { $lookup: { from: 'media', localField: 'moodboard.images', foreignField: '_id', as: 'moodboard.images' } },
    { $addFields: { imageLength: { $size: '$moodboard.images' } } },
    { $match: { imageLength: { $gt: 0 } } },
    { $lookup: { from: 'habitats', localField: 'habitat', foreignField: '_id', as: 'habitat' } },
    { $unwind: '$habitat' },
    { $lookup: { from: 'users', localField: 'habitat.owners', foreignField: '_id', as: 'habitat.owners' } },
    { $unwind: '$habitat.owners' },
    { $addFields: { 'habitat.owners.id': '$habitat.owners._id' } },
    { $lookup: { from: 'media', localField: 'habitat.owners.image', foreignField: '_id', as: 'habitat.owners.image' } },
    { $unwind: { path: '$habitat.owners.image', preserveNullAndEmptyArrays: true } },
    { $addFields: { id: '$_id' } },
    { $sort: { updatedAt: -1 } },
    {
      $group: {
        _id: '$habitat.owners._id',
        projects: { $push: '$$ROOT' },
        firstName: { $first: '$habitat.owners.firstName' },
        lastName: { $first: '$habitat.owners.lastName' },
      },
    },
  ]);

  return habitats;
};

/**
 * Get projects by followed users
 * @param {ObjectId} habitatId
 * @returns {Promise<Project>}
 */

const getArchivedProjects = async (habitatId) => {
  const projects = await Project.find({
    $and: [{ habitat: habitatId }, { isArchived: true }],
  }).populate({ path: 'moodboard', populate: { path: 'images', select: 'url tags' } });

  return projects;
};

module.exports = {
  getProjectById,
  getPublicProjectById,
  createProject,
  updateProjectById,
  addMoodboardToProject,
  addArticleToProject,
  addNoteToProject,
  addLinkToProject,
  addTagToProject,
  removeTagFromProject,
  getProjectsBySearchTerm,
  addRoomPlanToProject,
  getProjectsByFollowedUsers,
  getArchivedProjects,
  removeLinkFromProject,
  removeArticleFromProject,
  removeRoomPlanFromProject,
  removeNoteFromProject,
};
