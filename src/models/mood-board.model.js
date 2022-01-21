const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const moodBoardSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.ObjectId,
      ref: 'Project',
    },
    habitat: {
      type: mongoose.ObjectId,
      ref: 'Habitat',
    },
    images: [
      {
        type: mongoose.ObjectId,
        ref: 'Media',
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
moodBoardSchema.plugin(toJSON);
moodBoardSchema.plugin(paginate);

/**
 * @typedef Habitat
 */
const MoodBoard = mongoose.model('MoodBoard', moodBoardSchema);

module.exports = MoodBoard;
