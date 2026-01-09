import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './EditSet.css';

function EditSet() {
  const navigate = useNavigate();
  const { setId } = useParams();
  
  const [setName, setSetName] = useState('');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch set details
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}`)
      .then(response => response.json())
      .then(data => {
        setSetName(data.name);
      });
    
    // Fetch words in this set
    fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}/words`)
      .then(response => response.json())
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [setId]);


  const handleWordChange = (index, field, value) => {
    const newWords = [...words];
    newWords[index][field] = value;
    setWords(newWords);
  };

  const addWordRow = () => {
    setWords([...words, { 
      kanji: '', 
      hiragana_reading: '', 
      english_meaning: '', 
      word_type: 'vocab',
      isNew: true // Flag to indicate this is a new word
    }]);
  };

  const removeWord = (index) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/practice-sets/${setId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: setName,
          words: words.filter(w => w.kanji && w.hiragana_reading && w.english_meaning)
        })
      });
      
      const data = await response.json();
      setMessage(data.message);
      
      setTimeout(() => {
        navigate('/practice-sets');
      }, 1000);
      
    } catch (error) {
      setMessage('Error updating set: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="edit-set-page">
        <div className="loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-set-page">
      <div className="edit-set-container">
        <div className="page-header">
          <h1>Edit Practice Set</h1>
          <p>Update set name and vocabulary words</p>
        </div>

        <div className="edit-set-form">
          <div className="set-name-section">
            <label>Set Name</label>
            <input
              type="text"
              placeholder="Set name"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </div>

          <div className="words-section">
            <div className="words-header">
              <h3>Words ({words.length})</h3>
              <button 
                type="button" 
                onClick={addWordRow}
                className="add-word-btn"
              >
                + Add Word
              </button>
            </div>

            <div className="words-list">
              {words.map((word, index) => (
                <div key={index} className="word-input-card">
                  <div className="word-card-header">
                    <span className="word-number">#{index + 1}</span>
                    <button 
                      type="button"
                      onClick={() => removeWord(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="word-inputs">
                    <input
                      type="text"
                      placeholder="Kanji"
                      value={word.kanji}
                      onChange={(e) => handleWordChange(index, 'kanji', e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Hiragana"
                      value={word.hiragana_reading}
                      onChange={(e) => handleWordChange(index, 'hiragana_reading', e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="English meaning"
                      value={word.english_meaning}
                      onChange={(e) => handleWordChange(index, 'english_meaning', e.target.value)}
                    />

                    <select
                      value={word.word_type}
                      onChange={(e) => handleWordChange(index, 'word_type', e.target.value)}
                    >
                      <option value="vocab">Vocabulary</option>
                      <option value="kanji">Kanji</option>
                      <option value="onomatopoeia">Onomatopoeia</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="submit-btn">
            Save Changes
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button onClick={() => navigate('/practice-sets')} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditSet;