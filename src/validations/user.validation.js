const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      updatedUser: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        name: Joi.string(),
        role: Joi.string().required().valid('user', 'admin'),
        habitats: Joi.object().keys({
          current: Joi.string().custom(objectId),
          owner: Joi.array().items(Joi.string().custom(objectId)),
          admin: Joi.array().items(Joi.string().custom(objectId)),
          user: Joi.array().items(Joi.string().custom(objectId)),
        }),
        bio: Joi.string(),
      }),
      habitatId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
