const { fetchTopics, insertTopic } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const {description, slug} = req.body
  const newTopic = req.body

  if(!description || !slug){
    next({status: 400, msg: "Bad request"})
  }
  insertTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
