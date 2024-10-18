const db = require("../db/connection")

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  const validSortQueries = ['article_id', 'author', 'title', 'topic', 'created_at', 'votes', 'comment_count'];
  const validOrderQueries = ['ASC', 'DESC'];

  if (validSortQueries.includes(sort_by) === false) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  if (validOrderQueries.includes(order.toUpperCase()) === false) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  let queryString = `
    SELECT articles.*, 
    COUNT(comments.article_id) :: INT
    AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const promises = [];
  const queryValues = [];

  if (topic) {
    queryString += `WHERE topic = $1 `;
    queryValues.push(topic);
    promises.push(db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]));
  }

  queryString += `GROUP BY articles.article_id `;

  if (sort_by === 'comment_count') {
    queryString += `ORDER BY comment_count ${order}`;
  } else {
    queryString += `ORDER BY articles.${sort_by} ${order}`;
  }

  promises.unshift(db.query(queryString, queryValues));

  return Promise.all(promises).then((results) => {
    const articles = results[0].rows;
    if (articles.length === 0 && topic && results[1].rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }
    articles.forEach((article) => {
      delete article.body;
    });
    return articles;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, 
    COUNT(comments) :: INT
    AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
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