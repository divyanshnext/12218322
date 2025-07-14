// middleware/logger.js
const axios = require('axios');

const AUTH_TOKEN = "***REMOVED***"; // Replace this

async function log(stack, level, _package, message) {
  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: _package,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      }
    );
    console.log(`✅ Log sent: ${message}`);
  } catch (error) {
    console.error("❌ Failed to send log", error.message);
  }
}

module.exports = log;
