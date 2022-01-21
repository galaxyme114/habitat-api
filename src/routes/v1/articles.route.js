const express = require('express');
const auth = require('../../middlewares/auth');
const { upload } = require('../../services/ImageUpload');
const articlesController = require('../../controllers/article.controller');

const router = express.Router();

// TODO: Add article validation
router.route('/').post(auth(), articlesController.createArticleForProject);

router
  .route('/:articleId')
  .get(auth(), articlesController.getArticle)
  .patch(auth(), articlesController.updateArticle)
  .delete(auth(), articlesController.deleteArticle);

router.route('/images').post(upload.single('file'), articlesController.uploadImage);

router.route('/search').post(auth(), articlesController.searchByTerm);

module.exports = router;
