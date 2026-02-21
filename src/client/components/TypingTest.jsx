// client/src/components/TypingTest.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Results from './Results';
import VirtualKeyboard from './VirtualKeyboard';
const TypingTest = ({ username }) => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [errors, setErrors] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  
  // Keyboard state
  const [activeKey, setActiveKey] = useState(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const inputRef = useRef(null);
  const intervalRef = useRef(null);
  const keyTimeoutRef = useRef(null);

  // Fetch random text
  const fetchText = useCallback(async () => {
    try {
      console.log("reacj");
      const response = await fetch(`/api/text?difficulty=${difficulty}`);
      const data = await response.json();
      console.log("the data is ",data);
      setText(data.text);
    } catch (error) {
      console.error('Error fetching text:', error);
      setText('The quick brown fox jumps over the lazy dog. Programming is fun and challenging.');
    }
  }, [difficulty]);

  useEffect(() => {
    fetchText();
  }, [fetchText]);

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Update shift state
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setIsShiftPressed(true);
      }

      // Set active key
      setActiveKey({
        key: e.key,
        code: e.code
      });

      // Clear previous timeout
      if (keyTimeoutRef.current) {
        clearTimeout(keyTimeoutRef.current);
      }

      // Remove active state after 150ms for visual feedback
      keyTimeoutRef.current = setTimeout(() => {
        setActiveKey(null);
      }, 150);
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setIsShiftPressed(false);
      }
      
      // Keep the key highlighted briefly on keyup too
      setTimeout(() => {
        setActiveKey(null);
      }, 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (keyTimeoutRef.current) {
        clearTimeout(keyTimeoutRef.current);
      }
    };
  }, []);

  // Calculate WPM in real-time
  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60;
        const wordsTyped = userInput.trim().split(/\s+/).length;
        const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
        setWpm(currentWpm);
        
        const totalChars = userInput.length;
        const correctChars = userInput.split('').filter((char, idx) => char === text[idx]).length;
        const currentAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        setAccuracy(currentAccuracy);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, startTime, userInput, text]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (value.length > userInput.length) {
      const newChar = value[value.length - 1];
      const expectedChar = text[value.length - 1];
      if (newChar !== expectedChar) {
        setErrors(prev => prev + 1);
      }
    }

    setUserInput(value);
    setCurrentIndex(value.length);

    if (value.length >= text.length) {
      finishTest(value);
    }
  };

  const finishTest = async (finalInput) => {
    setIsActive(false);
    setEndTime(Date.now());
    clearInterval(intervalRef.current);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const wordsTyped = finalInput.trim().split(/\s+/).length;
    const timeInMinutes = timeTaken / 60;
    const finalWpm = Math.round(wordsTyped / timeInMinutes) || 0;
    
    const correctChars = finalInput.split('').filter((char, idx) => char === text[idx]).length;
    const finalAccuracy = Math.round((correctChars / text.length) * 100);

    const resultData = {
      username,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      time_taken: timeTaken,
      words_typed: wordsTyped,
      errors: errors
    };

    setResultsData(resultData);
    setShowResults(true);

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setErrors(0);
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
    setShowResults(false);
    setResultsData(null);
    setActiveKey(null);
    fetchText();
    inputRef.current?.focus();
  };

  const getCharClass = (char, index) => {
    if (index < userInput.length) {
      return userInput[index] === char ? 'correct' : 'incorrect';
    } else if (index === userInput.length) {
      return 'current';
    }
    return '';
  };

  if (showResults && resultsData) {
    return (
      <Results 
        data={resultsData} 
        onRetry={resetTest} 
        text={text}
      />
    );
  }

  return (
    <div className="typing-test">
      <div className="test-controls">
        <div className="difficulty-selector">
          <label>Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isActive}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="live-stats">
          <div className="stat">
            <span className="stat-label">WPM</span>
            <span className="stat-value">{wpm}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Errors</span>
            <span className="stat-value errors">{errors}</span>
          </div>
        </div>
      </div>

      <div className="text-display" onClick={() => inputRef.current?.focus()}>
        {text.split('').map((char, index) => (
          <span 
            key={index} 
            className={`char ${getCharClass(char, index)}`}
          >
            {char}
          </span>
        ))}
      </div>

      <textarea
        ref={inputRef}
        className="input-field"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        spellCheck={false}
        autoFocus
      />

      <div className="test-actions">
        <button className="btn-reset" onClick={resetTest}>
          ↻ Restart Test
        </button>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard activeKey={activeKey} isShiftPressed={isShiftPressed} />

      <div className="instructions">
        <p>Click on the text or start typing to begin. Type the text above as fast and accurately as possible.</p>
      </div>
    </div>
  );
};

export default TypingTest;