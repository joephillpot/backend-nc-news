const {fetchArticles, fetchArticleById, updateArticleVotes} = require("../models/articles.model")

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
  const inc_votes = req.body.inc_votes;
  const promises = [fetchArticleById(article_id), updateArticleVotes(article_id, inc_votes)];

  Promise.all(promises)
    .then((results) => {
      const newVote = results[1];
      res.status(201).send({ msg: newVote });
    })
    .catch((err) => {
      next(err);
    });
};