const express = require('express');
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const habitatsRoute = require('./habitats.route');
const constantsRoute = require('./constants.route');
const docsRoute = require('./docs.route');
const googleRoute = require('./google.route');
const mediaRoute = require('./media.route');
const moodBoardRoute = require('./mood-board.route');
const projectRoute = require('./project.route');
const articlesRoute = require('./articles.route');
const notesRoute = require('./notes.route');
const linksRoute = require('./links.route');
const publicTagsRoute = require('./public-tags.route');
const roomPlansRoute = require('./room-plans.route');
const publicRoute = require('./public.route');
const notificationsRoute = require('./notifications.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/habitats', habitatsRoute);
router.use('/constants', constantsRoute);
router.use('/docs', docsRoute);
router.use('/google', googleRoute);
router.use('/media', mediaRoute);
router.use('/moodboard', moodBoardRoute);
router.use('/projects', projectRoute);
router.use('/articles', articlesRoute);
router.use('/notes', notesRoute);
router.use('/links', linksRoute);
router.use('/tags', publicTagsRoute);
router.use('/room-plans', roomPlansRoute);
router.use('/public', publicRoute);
router.use('/notifications', notificationsRoute);

module.exports = router;
