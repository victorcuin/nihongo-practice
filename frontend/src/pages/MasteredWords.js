import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
      <div className="App">
        <header className="App-header">
          <p>Loading mastered words...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>⭐ Mastered Words</h1>
        <p>{words.length} words mastered across all sets</p>
        
        {words.length > 0 && (
          <>
            <button 
              onClick={() => navigate('/mastered-practice', { state: { words, mode: 'reading' } })}
              style={{ marginTop: '20px', padding: '15px 30px', backgroundColor: '#4CAF50', border: 'none' }}
            >
              Practice Mastered Words
            </button>
            
            <div style={{ marginTop: '30px', maxHeight: '400px', overflowY: 'scroll', width: '500px' }}>
              {words.map((word, index) => (
                <div 
                  key={word.id}
                  style={{ 
                    border: '1px solid #4CAF50', 
                    padding: '15px', 
                    margin: '10px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#4CAF50' }}>⭐ Mastered</div>
                  <div style={{ fontSize: '24px', marginTop: '5px' }}>{word.kanji}</div>
                  <div style={{ fontSize: '18px', marginTop: '5px' }}>{word.hiragana_reading}</div>
                  <div style={{ fontSize: '16px', marginTop: '5px' }}>{word.english_meaning}</div>
                  <div style={{ fontSize: '12px', marginTop: '10px', color: '#aaa' }}>
                    ✓ {word.correct_count} | ✗ {word.incorrect_count}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Back to Home
        </button>
      </header>
    </div>
  );
}

export default MasteredWords;