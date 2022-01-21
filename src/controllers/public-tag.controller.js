// const httpStatus = require('http-status');
// const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
// const ApiError = require('../utils/ApiError');
const { publicTagService, projectService } = require('../services');

const fetchAll = catchAsync(async (req, res) => {
  const allTags = await publicTagService.getAllTags();
  res.send(allTags);
});

const fetchPopularTags = catchAsync(async (req, res) => {
  const popularTags = await publicTagService.getPopular();
  res.send(popularTags);
});

const fetchFollowedTags = catchAsync(async (req, res) => {
  const { tags } = req.body;
  const followedTags = await publicTagService.getProjectsForFollowedTags(tags);
  res.send(followedTags);
});

const fetchFollowedUserProjects = catchAsync(async (req, res) => {
  const { users } = req.body;
  const followedUserProjects = await projectService.getProjectsByFollowedUsers(users);
  res.send(followedUserProjects);
});

module.exports = {
  fetchAll,
  fetchPopularTags,
  fetchFollowedTags,
  fetchFollowedUserProjects,
};
