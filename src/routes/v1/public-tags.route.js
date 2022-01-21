const express = require('express');
const auth = require('../../middlewares/auth');
const publicTagsController = require('../../controllers/public-tag.controller');

const router = express.Router();

router.route('/').get(auth(), publicTagsController.fetchAll);

router.route('/popular').get(auth(), publicTagsController.fetchPopularTags);

router.route('/followed').post(auth(), publicTagsController.fetchFollowedTags);

router.route('/followed-users').post(auth(), publicTagsController.fetchFollowedUserProjects);

module.exports = router;
