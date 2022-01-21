const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const moodBoardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    path: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
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
