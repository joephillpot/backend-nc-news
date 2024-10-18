const {fetchArticleComments, insertArticleComment, deleteCommentById} = require("../models/comments.model")
const {fetchArticleById} = require("../models/articles.model")

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