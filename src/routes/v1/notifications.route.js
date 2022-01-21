const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationController = require('../../controllers/notification.controller');
const notificationValidation = require('../../validations/notification.validation');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(notificationValidation.createNotification), notificationController.createNotification);

router
  .route('/:userId/all')
  .get(auth(), notificationController.getNotificationsByUserId)
  .delete(auth(), notificationController.deleteAllNotificationsByUserId);

router.route('/:userId/new-notifications-counter').get(auth(), notificationController.getNewNotificationsCounterByUserId);

router
  .route('/:userId/initialize-new-notifications-counter')
  .patch(auth(), notificationController.initializeNewNotificationsCounterByUserId);

module.exports = router;
