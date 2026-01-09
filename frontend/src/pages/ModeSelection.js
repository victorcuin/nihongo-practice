import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ModeSelection.css';

function ModeSelection() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [wordCount, setWordCount] = useState(0);
  const [strugglingCount, setStrugglingCount] = useState(0);

  useEffect(() => {
    // Fetch word count for this set
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}/words`)
      .then(response => response.json())
      .then(data => {
        setWordCount(data.length);
      })
      .catch(error => console.error('Error fetching words:', error));
    
    // Fetch struggling word count
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}/struggling-words`)
      .then(response => response.json())
      .then(data => {
        setStrugglingCount(data.length);
      })
      .catch(error => console.error('Error fetching struggling words:', error));
  }, [setId]);

  return (
    <div className="mode-selection-page">
      <div className="mode-container">
        <div className="mode-header">
          <h1>Choose Practice Mode</h1>
          <p className="word-count">This set has {wordCount} words</p>
          {strugglingCount > 0 && (
            <p className="struggling-alert">⚠️ {strugglingCount} struggling words</p>
          )}
        </div>

        <div className="mode-options">
          <div className="primary-modes">
            <button 
              onClick={() => navigate(`/practice-sets/${setId}/practice`, { state: { mode: 'reading' } })}
              className="mode-btn primary"
            >
              <div className="mode-title">Practice by Reading</div>
              <div className="mode-desc">See kanji → Type hiragana</div>
            </button>

            <button 
              onClick={() => navigate(`/practice-sets/${setId}/practice`, { state: { mode: 'meaning' } })}
              className="mode-btn primary"
            >
              <div className="mode-title">Practice by Meaning</div>
              <div className="mode-desc">See kanji → Type English</div>
            </button>
          </div>

          {strugglingCount > 0 && (
            <button 
              onClick={() => navigate(`/practice-sets/${setId}/practice`, { state: { mode: 'reading', strugglingOnly: true } })}
              className="mode-btn struggling"
            >
              <div className="mode-title">Practice Struggling Words</div>
              <div className="mode-desc">{strugglingCount} words need practice</div>
            </button>
          )}
        </div>

        <div className="mode-actions">
          <button 
            onClick={() => navigate(`/practice-sets/${setId}/view-words`)} 
            className="action-btn"
          >
            View All Words
          </button>

          <button 
            onClick={() => navigate(`/practice-sets/${setId}/edit`)} 
            className="action-btn"
          >
            Edit This Set
          </button>

          <button 
            onClick={() => navigate('/practice-sets')} 
            className="action-btn secondary"
          >
            Back to Sets
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeSelection;