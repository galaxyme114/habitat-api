const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, projectService, articleService, habitatService } = require('../services');

const getPublicUser = catchAsync(async (req, res) => {
  const user = await userService.getPublicUser(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getPublicProject = catchAsync(async (req, res) => {
  const project = await projectService.getPublicProjectById(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});

const getPublicArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

const getPublicHabitat = catchAsync(async (req, res) => {
  const habitat = await habitatService.getPublicHabitatById(req.params.habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }
  res.send(habitat);
});

module.exports = {
  getPublicUser,
  getPublicProject,
  getPublicArticle,
  getPublicHabitat,
};
