const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createHabitat = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    owners: Joi.array().items(Joi.string().custom(objectId)).required(),
    address: Joi.object().allow(null, ''),
    description: Joi.string(),
  }),
};

const getHabitats = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getHabitat = {
  params: Joi.object().keys({
    habitatId: Joi.string().custom(objectId).required(),
  }),
};

const updateHabitat = {
  params: Joi.object().keys({
    habitatId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      id: Joi.string().custom(objectId).required(),
      name: Joi.string(),
      isArchived: Joi.boolean(),
      owners: Joi.array().items(Joi.string().custom(objectId)),
      users: Joi.array().items(Joi.string().custom(objectId)),
      address: Joi.object(),
    })
    .min(1),
};

const deleteHabitat = {
  params: Joi.object().keys({
    habitatId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createHabitat,
  getHabitats,
  getHabitat,
  updateHabitat,
  deleteHabitat,
};
