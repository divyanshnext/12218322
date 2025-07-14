import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/shorturls/stats", {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px", textDecoration: "none", background: "#28a745", color: "white", padding: "8px 16px", borderRadius: "4px" }}>
          🏠 Back to Home
        </Link>
      </div>
      
      <h1>📊 Stats Page</h1>
      {error ? (
        <div style={{ color: "red" }}>❌ Error: {JSON.stringify(error)}</div>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short Link</th>
              <th>Created At</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => (
              <tr key={idx}>
                <td>{s.originalUrl}</td>
                <td>
                  <a href={s.shortUrl} target="_blank" rel="noopener noreferrer">{s.shortUrl}</a>
                </td>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td>{new Date(s.expiry).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Stats;
