const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const articleSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.ObjectId,
      ref: 'Project',
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'User',
    },
    body: [],
    isPublished: { type: Boolean, required: true, default: false },
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
articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

articleSchema.virtual('name').get(function () {
  const headerItems = this.body.filter((component) => component.type === 'header');
  if (headerItems.length) {
    return headerItems[0].data.text;
  }

  return 'name';
});

articleSchema.index({ 'body.data.text': 'text' });

/**
 * @typedef Article
 */
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
