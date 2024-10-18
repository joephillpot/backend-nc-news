const express = require('express');
const { getEndpoints } = require('../controllers/endpoints.controller');
const router = express.Router();

router.get("/", getEndpoints)

module.exports = router;