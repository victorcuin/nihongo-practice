import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ModeSelection() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    // Fetch word count for this set
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}/words`)
      .then(response => response.json())
      .then(data => {
        setWordCount(data.length);
      })
      .catch(error => console.error('Error fetching words:', error));
  }, [setId]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Choose Practice Mode</h1>
        <p>This set has {wordCount} words</p>
        
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => navigate(`/practice-sets/${setId}/practice`, { state: { mode: 'reading' } })}
            style={{ margin: '10px', padding: '20px 40px', fontSize: '18px' }}
          >
            Practice by Reading
            <br />
            <small>(See kanji → Type hiragana)</small>
          </button>
          
          <button 
            onClick={() => navigate(`/practice-sets/${setId}/practice`, { state: { mode: 'meaning' } })}
            style={{ margin: '10px', padding: '20px 40px', fontSize: '18px' }}
          >
            Practice by Meaning
            <br />
            <small>(See kanji → Type English)</small>
          </button>
        </div>

        <button 
          onClick={() => navigate(`/practice-sets/${setId}/view-words`)} 
          style={{ marginTop: '30px' }}
        >
          View All Words
        </button>
        
        <button 
          onClick={() => navigate(`/practice-sets/${setId}/edit`)} 
          style={{ marginTop: '10px' }}
        >
          Edit This Set
        </button>
        
        <button onClick={() => navigate('/practice-sets')} style={{ marginTop: '10px' }}>
          Back to Sets
        </button>
      </header>
    </div>
  );
}

export default ModeSelection;