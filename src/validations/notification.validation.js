const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  body: Joi.object().keys({
    recipient: Joi.string().custom(objectId).required(),
    sender: Joi.string().custom(objectId).required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
  }),
};

module.exports = {
  createNotification,
};
