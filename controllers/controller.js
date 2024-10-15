const { fetchTopics, fetchArticleById } = require('../models/model');
const endpoints = require('../endpoints.json');

exports.getEndpoints = (req, res) => {
  return res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
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
