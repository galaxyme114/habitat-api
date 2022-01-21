const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const publicTagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projects: [
      {
        type: mongoose.ObjectId,
        ref: 'Project',
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
publicTagSchema.plugin(toJSON);
publicTagSchema.plugin(paginate);

/**
 * @typedef Project
 */
const PublicTag = mongoose.model('PublicTag', publicTagSchema);

module.exports = PublicTag;
