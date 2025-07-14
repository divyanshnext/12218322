// utils/storage.js
const storage = new Map();

function save(shortcode, url, expiry) {
  storage.set(shortcode, {
    url,
    expiry,
    createdAt: new Date().toISOString(),
    clicks: [],
  });
}

function get(shortcode) {
  return storage.get(shortcode);
}

function getAll() {
  return [...storage.entries()];
}

module.exports = { save, get, getAll };
