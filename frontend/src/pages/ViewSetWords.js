import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ViewSetWords() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [words, setWords] = useState([]);
  const [setName, setSetName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch set name
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}`)
      .then(response => response.json())
      .then(data => setSetName(data.name));

    // Fetch words
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}/words`)
      .then(response => response.json())
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching words:', error);
        setLoading(false);
      });
  }, [setId]);

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Loading words...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{setName}</h1>
        <p>{words.length} words in this set</p>
        
        <div style={{ marginTop: '20px', maxHeight: '500px', overflowY: 'scroll', width: '500px' }}>
          {words.map((word, index) => (
            <div 
              key={word.id}
              style={{ 
                border: '1px solid white', 
                padding: '15px', 
                margin: '10px',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '12px', color: '#888' }}>#{index + 1}</div>
              <div style={{ fontSize: '24px', marginTop: '5px' }}>{word.kanji}</div>
              <div style={{ fontSize: '18px', marginTop: '5px' }}>{word.hiragana_reading}</div>
              <div style={{ fontSize: '16px', marginTop: '5px' }}>{word.english_meaning}</div>
              <div style={{ fontSize: '12px', marginTop: '10px', color: '#aaa' }}>
                Type: {word.word_type}
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={() => navigate(`/practice-sets/${setId}`)} style={{ marginTop: '20px' }}>
          Back to Set
        </button>
      </header>
    </div>
  );
}

export default ViewSetWords;