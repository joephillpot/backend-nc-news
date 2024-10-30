const db = require("../db/connection")

exports.fetchArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertArticleComment = (article_id, author, body) => {
  if (!author || !body) {
    return Promise.reject({ status: 400, msg: 'Missing required fields' });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`,
      [article_id, author, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `DELETE
    FROM comments
    WHERE comment_id = $1`,
      [comment_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
    });
};