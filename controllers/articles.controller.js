const { fetchArticles, fetchArticleById, updateArticleVotes, insertNewArticle } = require('../models/articles.model');
const { fetchUserByUsername } = require('../models/users.model');
const { fetchTopics } = require('../models/topics.model');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  return fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [fetchArticleById(article_id), updateArticleVotes(article_id, inc_votes)];

  Promise.all(promises)
    .then((article) => {
      //const newVote = results[1];
      res.status(201).send({ article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  if (!author || !title || !body || !topic) {
    next({ status: 400, msg: 'Bad request' });
  }

  articleElementChecker = [
    fetchUserByUsername(author),
    fetchTopics(topic),
    insertNewArticle(author, title, body, topic, article_img_url),
  ];

  Promise.all(articleElementChecker)
    .then((results) => {
      res.status(201).send({ postedArticle: results[2] });
    })
    .catch((err) => {
      next(err);
    });
};
