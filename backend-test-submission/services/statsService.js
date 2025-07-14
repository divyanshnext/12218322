const { getAll } = require("../utils/storage");

function getAllStats() {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
  const data = getAll();
  return data.map(([shortcode, record]) => ({
    shortcode,
    originalUrl: record.url,
    shortUrl: `${BASE_URL}/${shortcode}`,
    totalClicks: record.clicks.length,
    createdAt: record.createdAt,
    expiry: record.expiry
  }));
}

module.exports = { getAllStats };
