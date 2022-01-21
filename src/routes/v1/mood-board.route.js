const express = require('express');
const auth = require('../../middlewares/auth');
const moodBoardController = require('../../controllers/mood-board.controller');

const router = express.Router();

router
  .route('/images')
  .post(auth(), moodBoardController.addImageToMoodboard)
  .delete(auth(), moodBoardController.removeImageFromMoodboard);

router.route('/:moodboardId').get(auth(), moodBoardController.getMoodBoardForHabitat);

module.exports = router;
