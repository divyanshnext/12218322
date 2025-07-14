// services/urlService.js
const { save, get } = require('../utils/storage');
const log = require('../middleware/logger');

function generateShortcode(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function createShortUrl(req, res) {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) {
    await log("backend", "error", "handler", "URL is required");
    return res.status(400).json({ error: "URL is required" });
  }

  let code = shortcode || generateShortcode();
  if (get(code)) {
    await log("backend", "error", "handler", `Shortcode ${code} already exists`);
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  const expiry = new Date(Date.now() + validity * 60000).toISOString();
  save(code, url, expiry);

  await log("backend", "info", "handler", `Shortcode ${code} created`);
  res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    expiry,
  });
}

async function getStats(req, res) {
  const { shortcode } = req.params;
  const record = get(shortcode);

  if (!record) {
    await log("backend", "error", "handler", `Stats not found for ${shortcode}`);
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    originalURL: record.url,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clicks: record.clicks,
  });
}

module.exports = { createShortUrl, getStats };
