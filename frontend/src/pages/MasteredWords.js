import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MasteredWords.css';

function MasteredWords() {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/mastered-words')
      .then(response => response.json())
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mastered-words-page">
        <div className="loading">
          <p>Loading mastered words...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mastered-words-page">
      <div className="page-header">
        <div>
          <h1>⭐ Mastered Words</h1>
          <p>{words.length} words mastered across all sets</p>
        </div>
        {words.length > 0 && (
          <button 
            onClick={() => navigate('/mastered-practice', { state: { words, mode: 'reading' } })}
            className="practice-btn"
          >
            Practice Mastered Words
          </button>
        )}
      </div>

      {words.length === 0 ? (
        <div className="empty-state">
          <p>No mastered words yet. Keep practicing to reach 10+ correct!</p>
        </div>
      ) : (
        <div className="words-list">
          {words.map((word) => (
            <div key={word.id} className="word-card">
              <div className="mastered-badge">⭐ Mastered</div>
              <div className="word-main">
                <div className="word-kanji">{word.kanji}</div>
                <div className="word-reading">{word.hiragana_reading}</div>
                <div className="word-meaning">{word.english_meaning}</div>
              </div>
              <div className="word-stats">
                <span className="stat correct">✓ {word.correct_count}</span>
                <span className="stat incorrect">✗ {word.incorrect_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Home
      </button>
    </div>
  );
}

export default MasteredWords;