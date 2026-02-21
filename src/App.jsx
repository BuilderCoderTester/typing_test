// client/src/App.js
import React, { useState } from 'react';
import TypingTest from './client/components/TypingTest';
import Leaderboard from './client/components/Leaderboard';
import History from './client/components/History';
import './App.css';
function App() {
  const [currentView, setCurrentView] = useState('test');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleSetUsername = (e) => {
    e.preventDefault();
    const name = e.target.username.value.trim();
    if (name) {
      setUsername(name);
      localStorage.setItem('username', name);
    }
  };

  if (!username) {
    return (
      <div className="app">
        <div className="username-setup">
          <h1>⚡ SpeedType</h1>
          <p>Enter your username to start typing</p>
          <form onSubmit={handleSetUsername}>
            <input 
              type="text" 
              name="username" 
              placeholder="Your username" 
              maxLength="20"
              required 
            />
            <button type="submit">Start Typing</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 onClick={() => setCurrentView('test')}>⚡ SpeedType</h1>
        <nav>
          <button 
            className={currentView === 'test' ? 'active' : ''} 
            onClick={() => setCurrentView('test')}
          >
            Typing Test
          </button>
          {/* <button 
            className={currentView === 'leaderboard' ? 'active' : ''} 
            onClick={() => setCurrentView('leaderboard')}
          >
            Leaderboard
          </button> */}
          <button 
            className={currentView === 'history' ? 'active' : ''} 
            onClick={() => setCurrentView('history')}
          >
            My History
          </button>
        </nav>
        <div className="user-info">
          <span>Welcome, <strong>{username}</strong></span>
          <button onClick={() => {
            localStorage.removeItem('username');
            setUsername('');
          }}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'test' && <TypingTest username={username} />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'history' && <History username={username} />}
      </main>

      <footer className="footer">
        <p>Built with React, Node.js, Express & MySQL</p>
      </footer>
    </div>
  );
}

export default App;