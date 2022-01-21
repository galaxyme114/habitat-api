const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const habitatSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owners: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    admins: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    users: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    moodboard: {
      type: mongoose.ObjectId,
      ref: 'MoodBoard',
    },
    projects: [
      {
        type: mongoose.ObjectId,
        ref: 'Project',
      },
    ],
    address: {
      type: mongoose.ObjectId,
      ref: 'Address',
    },
    description: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    invites: [
      {
        type: String,
      },
    ],
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
habitatSchema.plugin(toJSON);
habitatSchema.plugin(paginate);

/**
 * @typedef Habitat
 */
const Habitat = mongoose.model('Habitat', habitatSchema);

module.exports = Habitat;
