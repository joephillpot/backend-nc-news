const express = require('express');
const { getTopics, getArticleById, getEndpoints, getArticles } = require('./controllers/controller');
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require('./errors');
const endpoints = require('./endpoints.json');
const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById);

app.all('/*', (req, res) => {
  return res.status(404).send({ msg: 'Not found' });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);
module.exports = app;
