const express = require('express');
const { deleteComment } = require('../controllers/comments.controller');
const router = express.Router();

router.route("/:comment_id")
.delete(deleteComment)

module.exports = router;