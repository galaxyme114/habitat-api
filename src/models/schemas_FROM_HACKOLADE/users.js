const mongoose = require('mongoose');

const users = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  __v: {
    type: Number,
    required: true,
  },
  habitats: new mongoose.Schema({
    current: {
      type: mongoose.Schema.Types.ObjectId,
    },
    owner: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  }),
  image: {
    type: mongoose.Schema.Types.Mixed,
  },
});

module.exports = users;
