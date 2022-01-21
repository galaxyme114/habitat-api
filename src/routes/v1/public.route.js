const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const publicController = require('../../controllers/public.controller');

const router = express.Router();

router.route('/user/:userId').get(publicController.getPublicUser);

router.route('/project/:projectId').get(publicController.getPublicProject);

router.route('/article/:articleId').get(publicController.getPublicArticle);

router.route('/habitat/:habitatId').get(publicController.getPublicHabitat);

module.exports = router;
