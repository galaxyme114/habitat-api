const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNote = {
  body: Joi.object().keys({
    project: Joi.string().custom(objectId).required(),
    owner: Joi.string().custom(objectId).required(),
    text: Joi.string().required(),
    colour: Joi.string().required(),
  }),
};

const updateNote = {
  body: Joi.object().keys({
    text: Joi.string().required(),
    colour: Joi.string().required(),
  }),
};

const deleteNote = {
  params: Joi.object().keys({
    noteId: Joi.string().required(),
  }),
};

module.exports = {
  createNote,
  updateNote,
  deleteNote,
};
