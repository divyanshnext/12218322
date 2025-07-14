// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const urlRoutes = require('./routes/urlRoutes');

app.use(cors());
app.use(bodyParser.json());
app.use('/shorturls', urlRoutes);

// Redirection logic
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
