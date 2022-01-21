const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const getTimeDiff = require('../utils/timeDiff');

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

notificationSchema.virtual('timeDiff').get(function () {
  let timeDiff = '';
  timeDiff = getTimeDiff(this.createdAt);

  return timeDiff;
});

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
