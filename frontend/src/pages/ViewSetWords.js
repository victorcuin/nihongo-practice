import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ViewSetWords.css';

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
      <div className="view-set-words-page">
        <div className="loading">
          <p>Loading words...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-set-words-page">
      <div className="page-header">
        <div>
          <h1>{setName}</h1>
          <p>{words.length} words in this set</p>
        </div>
        <button onClick={() => navigate(`/practice-sets/${setId}`)} className="back-btn-header">
          Back to Set
        </button>
      </div>

      <div className="words-grid">
        {words.map((word, index) => (
          <div key={word.id} className="word-card">
            <div className="word-number">#{index + 1}</div>
            <div className="word-kanji">{word.kanji}</div>
            <div className="word-reading">{word.hiragana_reading}</div>
            <div className="word-meaning">{word.english_meaning}</div>
            <div className="word-type">
              {word.word_type || 'vocab'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewSetWords;