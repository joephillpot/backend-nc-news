const express = require('express');
const { getTopics, getArticleById, getEndpoints, getArticles, getArticleComments, postArticleComment, patchArticleVotes, deleteComment } = require('./controllers/controller');
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require('./errors');
const app = express();

app.use(express.json())

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postArticleComment)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.all('/*', (req, res) => {
  return res.status(404).send({ msg: 'Not found' });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);
module.exports = app;
