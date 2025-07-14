// src/pages/Home.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [urls, setUrls] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAdd = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    
    const validUrls = urls.filter(u => u.url.trim() !== '');
    
    if (validUrls.length === 0) {
      setError('Please enter at least one URL');
      setLoading(false);
      return;
    }
    
    const responses = [];
    for (let data of validUrls) {
      try {
        const res = await axios.post(
          "http://localhost:5000/shorturls",
          {
            url: data.url.trim(),
            validity: data.validity ? parseInt(data.validity) : undefined,
            shortcode: data.shortcode.trim() || undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`, // ✅ Fixed: Added Bearer prefix
            },
          }
        );
        responses.push({ success: true, data: res.data });
      } catch (err) {
        responses.push({ 
          success: false, 
          error: err.response?.data?.error || err.message,
          originalUrl: data.url 
        });
      }
    }
    setResults(responses);
    setLoading(false);
  };


  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/stats" style={{ marginRight: "10px", textDecoration: "none", background: "#007bff", color: "white", padding: "8px 16px", borderRadius: "4px" }}>
          📊 View Stats
        </Link>
      </div>
      
      <h1>🔗 URL Shortener</h1>

      {urls.map((input, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <input
            placeholder="Enter Long URL"
            value={input.url}
            onChange={(e) => handleChange(idx, "url", e.target.value)}
            required
            style={{ width: "300px", marginRight: "10px" }}
          />
          <input
            placeholder="Validity (min)"
            type="number"
            value={input.validity}
            onChange={(e) => handleChange(idx, "validity", e.target.value)}
            style={{ width: "120px", marginRight: "10px" }}
          />
          <input
            placeholder="Custom Shortcode"
            value={input.shortcode}
            onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
            style={{ width: "150px" }}
          />
        </div>
      ))}

      <button onClick={handleAdd} disabled={urls.length >= 5}>
        ➕ Add another
      </button>
      <br />
      <br />
      <button onClick={handleSubmit} disabled={urls.length >= 5 || loading}>
        {loading ? '⏳ Processing...' : '🚀 Shorten URLs'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          ❌ {error}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h2>Results:</h2>
        {results.map((res, idx) => (
          <div key={idx} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            {res.success ? (
              <>
                ✅ <strong>Success:</strong><br/>
                <a href={res.data.shortLink} target="_blank" rel="noopener noreferrer">
                  {res.data.shortLink}
                </a><br/>
                <small>Expires: {new Date(res.data.expiry).toLocaleString()}</small>
              </>
            ) : (
              <>
                ❌ <strong>Error for {res.originalUrl}:</strong><br/>
                <span style={{ color: 'red' }}>{res.error}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
