const express = require('express');
const articles = require('./routers/articles.router');
const topics = require('./routers/topics.router');
const users = require('./routers/users.router');
const endpoints = require('./routers/endpoints.router');
const comments = require('./routers/comments.router');
const { handleCustomErrors, handleServerErrors, handlePSQLErrors, invalidEndpoint } = require('./errors');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', endpoints);
app.use('/api/articles', articles);
app.use('/api/topics', topics);
app.use('/api/comments', comments);
app.use('/api/users', users);

app.use(invalidEndpoint);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);
module.exports = app;
