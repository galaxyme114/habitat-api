const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { mediaService, articleService, projectService } = require('../services');

const createArticleForProject = catchAsync(async (req, res) => {
  const article = await articleService.createArticle({ ...req.body });
  await projectService.addArticleToProject(req.body.project, article.id);
  res.status(httpStatus.CREATED).send(article);
});

const uploadImage = catchAsync(async (req, res) => {
  const media = await mediaService.createAsset({ url: req.file.location, owner: req.body.userId });
  res.status(httpStatus.CREATED).send(media);
});

const getArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  logger.info(article);
  res.send(article);
});

const updateArticle = catchAsync(async (req, res) => {
  const article = await articleService.updateArticleById(req.params.articleId, req.body);
  res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
  const article = await articleService.deleteArticle(req.params.articleId);
  await projectService.removeArticleFromProject(article.project, req.params.articleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchByTerm = catchAsync(async (req, res) => {
  const { searchTerm } = req.body;
  const articles = await articleService.getArticlesBySearchTerm(searchTerm);

  res.send(articles);
});

module.exports = {
  uploadImage,
  createArticleForProject,
  getArticle,
  updateArticle,
  deleteArticle,
  searchByTerm,
};
