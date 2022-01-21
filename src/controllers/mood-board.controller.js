const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { moodboardService } = require('../services');

const createMoodBoardForHabitat = catchAsync(async (req, res) => {
  req.body.owners = [req.user.id];
  const moodBoard = await moodboardService.createMoodBoard(req.body);
  res.status(httpStatus.CREATED).send(moodBoard);
});

const getMoodBoardForHabitat = catchAsync(async (req, res) => {
  const { moodboardId } = req.params;
  const moodBoard = await moodboardService.getMoodBoardById(moodboardId);
  res.send(moodBoard);
});

const addImageToMoodboard = catchAsync(async (req, res) => {
  const { id, imageId } = req.body;
  const moodBoard = await moodboardService.addImageToMoodBoard(id, imageId);
  res.send(moodBoard);
});

const removeImageFromMoodboard = catchAsync(async (req, res) => {
  const { id, imageId } = req.body;
  const moodBoard = await moodboardService.removeImageFromMoodBoard(id, imageId);
  res.send(moodBoard);
});

module.exports = {
  createMoodBoardForHabitat,
  getMoodBoardForHabitat,
  addImageToMoodboard,
  removeImageFromMoodboard,
};
