// services/urlService.js
const { save, get } = require('../utils/storage');
const log = require('../middleware/logger');

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidShortcode(shortcode) {
  // Only allow alphanumeric characters, 3-10 chars length
  return /^[a-zA-Z0-9]{3,10}$/.test(shortcode);
}

function generateShortcode(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function createShortUrl(req, res) {
  const { url, validity = 30, shortcode } = req.body;

  // Input validation
  if (!url) {
    await log("backend", "error", "handler", "URL is required");
    return res.status(400).json({ error: "URL is required" });
  }

  if (!isValidUrl(url)) {
    await log("backend", "error", "handler", `Invalid URL format: ${url}`);
    return res.status(400).json({ error: "Invalid URL format" });
  }

  if (validity < 1 || validity > 10080) { // Max 1 week
    await log("backend", "error", "handler", `Invalid validity period: ${validity}`);
    return res.status(400).json({ error: "Validity must be between 1 and 10080 minutes" });
  }

  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) {
      await log("backend", "error", "handler", `Invalid shortcode format: ${code}`);
      return res.status(400).json({ error: "Shortcode must be 3-10 alphanumeric characters" });
    }
    if (get(code)) {
      await log("backend", "error", "handler", `Shortcode ${code} already exists`);
      return res.status(409).json({ error: "Shortcode already exists" });
    }
  } else {
    do {
      code = generateShortcode();
    } while (get(code)); // Ensure uniqueness
  }

  const expiry = new Date(Date.now() + validity * 60000).toISOString();
  save(code, url, expiry);

  const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
  
  await log("backend", "info", "handler", `Shortcode ${code} created for ${url}`);
  res.status(201).json({
    shortLink: `${BASE_URL}/${code}`,
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
