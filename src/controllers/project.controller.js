const httpStatus = require('http-status');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { projectService, moodboardService, habitatService, publicTagService } = require('../services');

const createProjectForHabitat = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);

  // Add project to habitat
  await habitatService.addProjectToHabitat(req.body.habitat, project.id);

  // Create moodboard for project
  const moodboard = await moodboardService.createMoodBoard({
    project: project.id,
  });

  // Add moodboard to project
  const updatedProject = await projectService.addMoodboardToProject(project.id, moodboard.id);

  res.status(httpStatus.CREATED).send(updatedProject);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  logger.info(project);
  res.send(project);
});

const updateProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  const updatedProject = await projectService.updateProjectById(projectId, req.body);

  if (updatedProject.isPublic && updatedProject.tags.length) {
    const promises = updatedProject.tags.map(async (tag) => {
      const promise = await publicTagService.addProjectToTag(tag, projectId);
      return promise;
    });

    await Promise.all(promises);
  } else if (!updatedProject.isPublic && updatedProject.tags.length) {
    const promises = updatedProject.tags.map(async (tag) => {
      const promise = await publicTagService.removeProjectFromTag(tag, projectId);
      return promise;
    });

    await Promise.all(promises);
  }

  // need to add project to tags
  res.send(updatedProject);
});

const addTag = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { tag } = req.body;

  // add tag to project
  const updatedProject = await projectService.addTagToProject(projectId, tag);

  // add project to public tag
  if (updatedProject.isPublic) {
    await publicTagService.addProjectToTag(tag, projectId);
  }
  logger.info(updatedProject);
  res.send(updatedProject);
});

const removeTag = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { tag } = req.body;

  // remove tag from project
  const updatedProject = await projectService.removeTagFromProject(projectId, tag);

  // remove project from public tag
  if (updatedProject.isPublic) {
    await publicTagService.removeProjectFromTag(tag, projectId);
  }
  logger.info(updatedProject);
  res.send(updatedProject);
});

const shareProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  const updatedProject = await projectService.updateProjectById(projectId, req.body);

  if (updatedProject.tags.length) {
    const promises = updatedProject.tags.map(async (tag) => {
      const promise = await publicTagService.addProjectToTag(tag, projectId);
      return promise;
    });

    await Promise.all(promises);
  }

  logger.info(updatedProject);
  res.send(updatedProject);
});

const unshareProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  const updatedProject = await projectService.updateProjectById(projectId, req.body);

  if (updatedProject.tags.length) {
    const promises = updatedProject.tags.map(async (tag) => {
      const promise = await publicTagService.removeProjectFromTag(tag, projectId);
      return promise;
    });

    await Promise.all(promises);
  }

  logger.info(updatedProject);
  res.send(updatedProject);
});

const searchByTerm = catchAsync(async (req, res) => {
  const { searchTerm } = req.body;

  const projects = await projectService.getProjectsBySearchTerm(searchTerm);

  res.send(projects);
});

const getArchivedProjects = catchAsync(async (req, res) => {
  const { habitatId } = req.params;

  const projects = await projectService.getArchivedProjects(habitatId);

  res.send(projects);
});

module.exports = {
  createProjectForHabitat,
  getProject,
  updateProject,
  addTag,
  removeTag,
  shareProject,
  unshareProject,
  searchByTerm,
  getArchivedProjects,
};
