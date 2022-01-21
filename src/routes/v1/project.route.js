const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const projectController = require('../../controllers/project.controller');
const projectValidation = require('../../validations/project.validation');

const router = express.Router();

router.route('/').post(auth(), validate(projectValidation.createProject), projectController.createProjectForHabitat);

router
  .route('/:projectId')
  .get(auth(), validate(projectValidation.getProject), projectController.getProject)
  .patch(auth(), validate(projectValidation.updateProject), projectController.updateProject);

router
  .route('/:projectId/tag')
  .post(auth(), validate(projectValidation.updateTag), projectController.addTag)
  .delete(auth(), validate(projectValidation.updateTag), projectController.removeTag);

router.route('/:projectId/share').post(auth(), validate(projectValidation.updateProject), projectController.shareProject);

router
  .route('/:projectId/unshare')
  .post(auth(), validate(projectValidation.updateProject), projectController.unshareProject);

router.route('/search').post(auth(), projectController.searchByTerm);

router.route('/:habitatId/archived').get(auth(), projectController.getArchivedProjects);

module.exports = router;
