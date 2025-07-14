const axios = require('axios');
require('dotenv').config();
const AUTH_TOKEN = process.env.AUTH_TOKEN; // ✅ Fixed

const log = async (stack, level, pkg, message) => {
  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Log sent:", res.data); // Optional: Confirm it worked
  } catch (error) {
    console.error("❌ Logging Error →", error?.response?.data || error.message);
  }
};

// ✅ This is the key part you missed
module.exports = log;
