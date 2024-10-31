const express = require('express');
const { deleteComment, patchCommentVotes } = require('../controllers/comments.controller');
const router = express.Router();

router.route("/:comment_id")
.delete(deleteComment)
.patch(patchCommentVotes)

module.exports = router;