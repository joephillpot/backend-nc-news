const express = require('express');
const { getTopics } = require('./controllers/controller');
const { handleCustomErrors, handleServerErrors } = require('./errors');
const app = express();


app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
  return res.status(404).send({msg: 'Not found'})
})

app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
