const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id) :: INT
    AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }
    return rows[0];
  });
};

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

exports.updateArticleVotes = (article_id, inc_votes) => {
  const isVotesEmpty = (inc_votes) => {
    return JSON.stringify(inc_votes) === '{}';
  };

  if (isVotesEmpty(inc_votes) || typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *`,
      [article_id, inc_votes]
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
      if(result.rowCount === 0) {
        return Promise.reject({status: 404, msg: 'Not found'})
      }
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({rows})=>{
    return rows;
  })
}
