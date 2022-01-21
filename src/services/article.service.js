const httpStatus = require('http-status');
const { Article } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an article
 * @param {Object} articleBody
 * @returns {Promise<Article>}
 */
const createArticle = async (articleBody) => {
  const article = await Article.create(articleBody);
  return article;
};

/**
 * Get article by id
 * @param {ObjectId} id
 * @returns {Promise<Article>}
 */
const getArticleById = async (id) => {
  return Article.findById(id)
    .populate({ path: 'owner', populate: { path: 'image' } })
    .populate({ path: 'project', populate: { path: 'habitat' } });
};

/**
 * Update article by id
 * @param {ObjectId} articleId
 * @param {Object} updateBody
 * @returns {Promise<Habitat>}
 */
const updateArticleById = async (articleId, updateBody) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }
  Object.assign(article, updateBody);
  await article.save();
  return article;
};

/**
 * Delete article
 * @param {ObjectId} articleId
 * @return {Promise<Article>}
 */
const deleteArticle = async (articleId) => {
  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  await article.remove();
  return article;
};

/**
 * Get articles by searchTerm
 * @param {string} searchTerm
 * @returns {Promise<Article[]>}
 */
const getArticlesBySearchTerm = async (searchTerm) => {
  const strRegEx = `${searchTerm}`;
  const newRegEx = new RegExp(strRegEx, 'i');
  const aggreArticles = await Article.aggregate([
    {
      $unwind: '$body',
    },
    {
      $match: {
        $or: [{ 'body.data.text': newRegEx }],
      },
    },
    {
      $project: {
        _id: '$_id',
      },
    },
    {
      $group: {
        _id: '$_id',
      },
    },
  ]);

  const articleIds = aggreArticles.map((e) => e._id);

  const articles = await Article.find({ _id: { $in: articleIds }, isPublished: true })
    .populate({
      path: 'project',
      match: { isPublic: true },
    })
    .populate('owner');
  return articles;
};

module.exports = {
  createArticle,
  getArticleById,
  updateArticleById,
  deleteArticle,
  getArticlesBySearchTerm,
};
