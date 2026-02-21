// client/src/components/Results.js
import React from 'react';

const Results = ({ data, onRetry, text }) => {
  const { wpm, accuracy, time_taken, words_typed, errors } = data;

  const getRating = () => {
    if (wpm >= 80 && accuracy >= 95) return { text: 'Excellent!', class: 'excellent' };
    if (wpm >= 60 && accuracy >= 90) return { text: 'Great Job!', class: 'great' };
    if (wpm >= 40 && accuracy >= 85) return { text: 'Good!', class: 'good' };
    return { text: 'Keep Practicing!', class: 'practice' };
  };

  const rating = getRating();

  return (
    <div className="results-container">
      <h2>Test Complete! 🎉</h2>
      
      <div className={`rating-badge ${rating.class}`}>
        {rating.text}
      </div>

      <div className="results-grid">
        <div className="result-card primary">
          <div className="result-value">{wpm}</div>
          <div className="result-label">Words Per Minute</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{accuracy}%</div>
          <div className="result-label">Accuracy</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{time_taken}s</div>
          <div className="result-label">Time Taken</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{words_typed}</div>
          <div className="result-label">Words Typed</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{errors}</div>
          <div className="result-label">Errors</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">
            {Math.round((words_typed / time_taken) * 60) || 0}
          </div>
          <div className="result-label">Chars/Min</div>
        </div>
      </div>

      <div className="text-preview">
        <h3>Text You Typed:</h3>
        <p>{text}</p>
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={onRetry}>
          Try Again
        </button>
      </div>

      <div className="performance-tips">
        <h3>💡 Tips for Improvement</h3>
        <ul>
          {accuracy < 90 && <li>Focus on accuracy before speed - slow down to avoid errors</li>}
          {wpm < 40 && <li>Practice touch typing to build muscle memory</li>}
          {errors > 5 && <li>Review the keys where you made mistakes</li>}
          <li>Practice regularly with different texts</li>
          <li>Use all fingers and maintain proper hand position</li>
        </ul>
      </div>
    </div>
  );
};

export default Results;