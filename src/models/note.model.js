const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const noteSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.ObjectId,
      ref: 'Project',
      required: true,
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
      required: true,
    },
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
noteSchema.plugin(toJSON);
noteSchema.plugin(paginate);

/**
 * @typedef Note
 */
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
