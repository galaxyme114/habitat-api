const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { roomPlanService, projectService } = require('../services');

const create = catchAsync(async (req, res) => {
  const roomPlan = await roomPlanService.createRoomPlan({ ...req.body, owner: req.user.id });
  await projectService.addRoomPlanToProject(req.body.project, roomPlan.id);
  res.status(httpStatus.CREATED).send(roomPlan);
});

const get = catchAsync(async (req, res) => {
  const roomPlan = await roomPlanService.getRoomPlanById(req.params.roomPlanId);
  if (!roomPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room Plan not found');
  }
  logger.info(roomPlan);
  res.send(roomPlan);
});

const update = catchAsync(async (req, res) => {
  const roomPlan = await roomPlanService.updateRoomPlanById(req.params.roomPlanId, req.body, req.user.id);
  res.send(roomPlan);
});

const deleteRoomPlan = catchAsync(async (req, res) => {
  const roomPlan = await roomPlanService.deleteRoomPlan(req.params.roomPlanId);
  await projectService.removeRoomPlanFromProject(roomPlan.project, req.params.roomPlanId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  get,
  update,
  deleteRoomPlan,
};
