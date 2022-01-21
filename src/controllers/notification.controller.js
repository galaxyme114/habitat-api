const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification({ ...req.body });
  res.status(httpStatus.CREATED).send(notification);
});

const getNotificationsByUserId = catchAsync(async (req, res) => {
  const notificatoins = await notificationService.getNotificationsByUserId(req.params.userId);
  res.send(notificatoins);
});

const getNewNotificationsCounterByUserId = catchAsync(async (req, res) => {
  const newNotificationsCounter = await notificationService.getNewNotificationsCounterByUserId(req.params.userId);
  res.send({ counter: newNotificationsCounter });
});

const initializeNewNotificationsCounterByUserId = catchAsync(async (req, res) => {
  await notificationService.initializeNewNotificationsCounterByUserId(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteAllNotificationsByUserId = catchAsync(async (req, res) => {
  await notificationService.deleteAllNotificationsByUserId(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotification,
  getNotificationsByUserId,
  getNewNotificationsCounterByUserId,
  initializeNewNotificationsCounterByUserId,
  deleteAllNotificationsByUserId,
};
