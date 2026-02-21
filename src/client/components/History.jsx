// client/src/components/History.js
import React, { useState, useEffect } from 'react';

const History = ({ username }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [username]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/results/user/${username}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setHistory(data);
      
      // Calculate stats
      if (data.length > 0) {
        const totalWpm = data.reduce((sum, r) => sum + r.wpm, 0);
        const totalAccuracy = data.reduce((sum, r) => sum + parseFloat(r.accuracy), 0);
        setStats({
          avgWpm: Math.round(totalWpm / data.length),
          avgAccuracy: Math.round(totalAccuracy / data.length),
          bestWpm: Math.max(...data.map(r => r.wpm)),
          totalTests: data.length
        });
      }
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading your history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="history">
      <h2>📊 Your Typing History</h2>

      {stats && (
        <div className="personal-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.avgWpm}</span>
            <span className="stat-label">Avg WPM</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.avgAccuracy}%</span>
            <span className="stat-label">Avg Accuracy</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.bestWpm}</span>
            <span className="stat-label">Best WPM</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalTests}</span>
            <span className="stat-label">Tests Taken</span>
          </div>
        </div>
      )}

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>WPM</th>
              <th>Accuracy</th>
              <th>Time</th>
              <th>Words</th>
              <th>Errors</th>
            </tr>
          </thead>
          <tbody>
            {history.map((result) => (
              <tr key={result.id}>
                <td>{new Date(result.created_at).toLocaleDateString()}</td>
                <td className="wpm-cell">{result.wpm}</td>
                <td>{result.accuracy}%</td>
                <td>{result.time_taken}s</td>
                <td>{result.words_typed}</td>
                <td>{result.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length === 0 && (
        <p className="no-data">You haven't taken any tests yet. Go to the Typing Test tab to start!</p>
      )}
    </div>
  );
};

export default History;