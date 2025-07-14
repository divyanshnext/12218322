// src/pages/Home.jsx
import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [urls, setUrls] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);
  const [results, setResults] = useState([]);

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
    const responses = [];
    for (let data of urls) {
      try {
        const res = await axios.post("http://localhost:5000/shorturls", {
          url: data.url,
          validity: data.validity ? parseInt(data.validity) : undefined,
          shortcode: data.shortcode || undefined,
        });
        responses.push(res.data);
      } catch (err) {
        responses.push({ error: err.response?.data || err.message });
      }
    }
    setResults(responses);
  };

  return (
    <div style={{ padding: "20px" }}>
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
      <button onClick={handleSubmit}>🚀 Shorten URLs</button>

      <div style={{ marginTop: "20px" }}>
        <h2>Results:</h2>
        {results.map((res, idx) => (
          <div key={idx}>
            {res.shortLink ? (
              <>
                ✅ <a href={res.shortLink}>{res.shortLink}</a>  
                (Expires at: {res.expiry})
              </>
            ) : (
              <div>❌ Error: {JSON.stringify(res.error)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
