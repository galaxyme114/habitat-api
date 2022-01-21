const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema(
  {
    habitat: {
      type: mongoose.ObjectId,
      ref: 'Habitat',
      required: true,
    },
    moodboard: {
      type: mongoose.ObjectId,
      ref: 'MoodBoard',
    },
    description: {
      type: String,
      required: false,
    },
    articles: [
      {
        type: mongoose.ObjectId,
        ref: 'Article',
      },
    ],
    notes: [
      {
        type: mongoose.ObjectId,
        ref: 'Note',
      },
    ],
    links: [
      {
        type: mongoose.ObjectId,
        ref: 'Link',
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    roomPlans: [
      {
        type: mongoose.ObjectId,
        ref: 'RoomPlan',
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    // roomplan: [
    //   {
    //     type: mongoose.ObjectId,
    //     ref: 'Roomplan',
    //   },
    // ],
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
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * @typedef Project
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
