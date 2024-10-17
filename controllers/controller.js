const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  insertArticleComment,
  updateArticleVotes,
  deleteCommentById,
  fetchUsers,
} = require('../models/model');
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

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [fetchArticleById(article_id), fetchArticleComments(article_id)];

  Promise.all(promises)
    .then((results) => {
      const comments = results[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { author, body } = req.body;

  const promises = [fetchArticleById(article_id), insertArticleComment(article_id, author, body)];

  Promise.all(promises)
    .then((results) => {
      const comment = results[1];

      res.status(201).send({ comment });
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
