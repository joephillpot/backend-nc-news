const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  postNewArticle,
} = require('../controllers/articles.controller');
const { getArticleComments, postArticleComment } = require('../controllers/comments.controller');

router.route('/').get(getArticles).post(postNewArticle);

router.route('/:article_id/comments').get(getArticleComments).post(postArticleComment);

router.route('/:article_id').get(getArticleById).patch(patchArticleVotes);

module.exports = router;
