const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    project: Joi.string().custom(objectId).required(),
  }),
};

const list = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const get = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      owners: Joi.string().custom(objectId),
      users: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const destroy = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  create,
  list,
  get,
  update,
  destroy,
};
