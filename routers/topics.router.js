const express = require('express');
const { getTopics, postTopic } = require('../controllers/topics.controller');
const router = express.Router();

router.route("/")
.get(getTopics)
.post(postTopic)

module.exports = router;