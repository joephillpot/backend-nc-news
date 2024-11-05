const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.insertTopic = (topic) => {
  const validKeys = ['description', 'slug'];
  Object.keys(topic).forEach((key) => {
    if (validKeys.includes(key) === false) {
      delete topic[key];
    }
  });

  return db
    .query(`INSERT INTO topics (description, slug) VALUES ($1, $2) RETURNING *`, Object.values(topic))
    .then(({ rows }) => {
      return rows[0];
    });
};
