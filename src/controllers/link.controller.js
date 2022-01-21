// const linkPreviewGenerator = require('link-preview-generator');
const { getLinkPreview } = require('link-preview-js');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { linkService, projectService } = require('../services');

const fetchLinkPreviewData = catchAsync(async (req, res) => {
  const previewData = await getLinkPreview(req.body.url);
  logger.info(previewData);
  res.send(previewData);
});

const createLinkPreviewForProject = catchAsync(async (req, res) => {
  const link = await linkService.createLink({ ...req.body });
  await projectService.addLinkToProject(req.body.project, link.id);
  res.status(httpStatus.CREATED).send(link);
});

const updateLinkPreviewForProject = catchAsync(async (req, res) => {
  const link = await linkService.updateLink(req.params.linkId, req.body);
  res.send(link);
});

const deleteLinkPreviewForProject = catchAsync(async (req, res) => {
  const link = await linkService.deleteLink(req.params.linkId);
  await projectService.removeLinkFromProject(link.project, link.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  fetchLinkPreviewData,
  createLinkPreviewForProject,
  updateLinkPreviewForProject,
  deleteLinkPreviewForProject,
};
