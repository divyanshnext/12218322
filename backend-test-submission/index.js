// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('./middleware/rateLimiter');

const app = express();
const urlRoutes = require('./routes/urlRoutes');

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware (use only one)
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use(rateLimit(50, 60000)); // 50 requests per minute

app.use('/shorturls', urlRoutes);

// Redirection logic (must come after API routes)
const storage = require('./utils/storage');
const log = require('./middleware/logger');

app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const record = storage.get(shortcode);

  if (!record) {
    await log("backend", "error", "handler", `Shortcode ${shortcode} not found`);
    return res.status(404).json({ error: "Short URL not found" });
  }

  const now = new Date();
  if (now > new Date(record.expiry)) {
    await log("backend", "warn", "handler", `Shortcode ${shortcode} expired`);
    return res.status(410).json({ error: "Short URL expired" });
  }

  record.clicks.push({ time: now.toISOString() });
  res.redirect(record.url);
});

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${BASE_URL}`);
});
