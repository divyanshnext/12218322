// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const { createShortUrl, getStats } = require('../services/urlService');
const { getAllStats } = require('../services/statsService');
const authenticate = require('../middleware/authenticate');


router.post('/', createShortUrl);
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await getAllStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
router.get('/:shortcode', getStats);


module.exports = router;
