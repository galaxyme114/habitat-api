const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mediaSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'User',
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
    },
    tags: [
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

mediaSchema.plugin(toJSON);
mediaSchema.plugin(paginate);

/**
 * @typedef Media
 */
const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
