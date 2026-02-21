// client/src/components/Leaderboard.js
import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading leaderboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="leaderboard">
      <h2>🏆 Top Typists</h2>
      
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Best WPM</th>
              <th>Avg WPM</th>
              <th>Avg Accuracy</th>
              <th>Tests Taken</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.username} className={index < 3 ? `top-${index + 1}` : ''}>
                <td className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className="username">{user.username}</td>
                <td className="best-wpm">{user.best_wpm}</td>
                <td>{Math.round(user.avg_wpm)}</td>
                <td>{Math.round(user.avg_accuracy)}%</td>
                <td>{user.tests_taken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <p className="no-data">No data available yet. Be the first to take a test!</p>
      )}
    </div>
  );
};

export default Leaderboard;