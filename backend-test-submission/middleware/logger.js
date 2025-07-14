// middleware/logger.js
const axios = require('axios');

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaXZ5YW5zaGt1bWFyQGxwdS5pbiIsImV4cCI6MTc1MjQ3MjkzMSwiaWF0IjoxNzUyNDcyMDMxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjY5NmYwOGMtYjZiZC00OTg4LWEzZGItOWJhZGIxM2I2YTU0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGl2eWFuc2gga3VtYXIgY2hhdHVydmVkaSIsInN1YiI6ImNkYjg5ODk1LTk2ODQtNDYyMC05Zjk2LTdiYmJjNWQ4NjUwNiJ9LCJlbWFpbCI6ImRpdnlhbnNoa3VtYXJAbHB1LmluIiwibmFtZSI6ImRpdnlhbnNoIGt1bWFyIGNoYXR1cnZlZGkiLCJyb2xsTm8iOiIxMjIxODMyMiIsImFjY2Vzc0NvZGUiOiJDWnlwUUsiLCJjbGllbnRJRCI6ImNkYjg5ODk1LTk2ODQtNDYyMC05Zjk2LTdiYmJjNWQ4NjUwNiIsImNsaWVudFNlY3JldCI6IlFBVmZTaENqaHBHV2poRWoifQ.IsRqRy0HtZtNYaOcXdolBiyNZ4zUMZXZqsM_TDnRUDg"; // Replace this

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
