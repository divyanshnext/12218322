// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const { createShortUrl, getStats } = require('../services/urlService');

router.post('/', createShortUrl);
router.get('/:shortcode', getStats);

module.exports = router;
