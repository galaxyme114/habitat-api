const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const linkSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.ObjectId,
      ref: 'Project',
      required: true,
    },
    description: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    domain: {
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
linkSchema.plugin(toJSON);
linkSchema.plugin(paginate);

linkSchema.virtual('name').get(function () {
  return `${this.title}`;
});

/**
 * @typedef Link
 */
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
