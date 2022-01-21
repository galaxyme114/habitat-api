// const httpStatus = require('http-status');
const { Notification, User } = require('../models');
// const ApiError = require('../utils/ApiError');

/**
 * Send a notification to user
 * @param {ObjectId} recipientId
 * @param {ObjectId} sendertId
 * @param {String} text
 * @returns {Promise<Notifaction>}
 */
const createNotification = async (notificationBody) => {
  const notification = await Notification.create(notificationBody);
  await User.findOneAndUpdate({ _id: notificationBody.recipient }, { $inc: { newNotificationsCounter: 1 } });
  return notification;
};

/**
 * Get Notifications by userId
 * @param {ObjectId} userId
 * @returns {Promise<Notification>}
 */
const getNotificationsByUserId = async (userId) => {
  return Notification.find({ recipient: userId }).sort({ createdAt: 'desc' });
};

/**
 * Get New Notifications Counter by userId
 * @param {ObjectId} userId
 * @returns {Promise<Number>}
 */
const getNewNotificationsCounterByUserId = async (userId) => {
  const user = await User.findById(userId);
  return user.newNotificationsCounter;
};

/**
 * Initialize New Notificatoins Counter
 * @param {ObjectId} userId
 * @returns {Promise<Boolean>}
 */
const initializeNewNotificationsCounterByUserId = async (userId) => {
  await User.findByIdAndUpdate(userId, { newNotificationsCounter: 0 }, { upsert: true });
  return true;
};

/**
 * Delete all notifications by user Id
 * @param {ObjectId} userId
 * @returns {Promise<Void>}
 */
const deleteAllNotificationsByUserId = async (userId) => {
  await Notification.deleteMany({ recipient: userId });
  return true;
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  getNewNotificationsCounterByUserId,
  initializeNewNotificationsCounterByUserId,
  deleteAllNotificationsByUserId,
};
