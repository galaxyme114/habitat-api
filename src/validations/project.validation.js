const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    habitat: Joi.string().custom(objectId).required(),
    description: Joi.string().allow(null, ''),
    isPublic: Joi.boolean().required(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const updateTag = {
  body: Joi.object().keys({
    tag: Joi.string().required(),
  }),
};

const updateProject = {
  body: Joi.object()
    .keys({
      id: Joi.string().custom(objectId),
      isPublic: Joi.boolean(),
      isArchived: Joi.boolean(),
      description: Joi.string().allow(null, ''),
      name: Joi.string(),
      tags: Joi.array().items(Joi.string()),
    })
    .min(1),
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createProject,
  getProject,
  updateTag,
  updateProject,
};
