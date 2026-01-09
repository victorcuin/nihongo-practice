import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './AddSet.css';

function AddSet() {
  const navigate = useNavigate();
  const [setName, setSetName] = useState('');
  const [words, setWords] = useState([
    { kanji: '', hiragana_reading: '', english_meaning: '', word_type: 'vocab' }
  ]);
  const [message, setMessage] = useState('');

  const handleSetNameChange = (e) => {
    setSetName(e.target.value);
  };

  const handleWordChange = (index, field, value) => {
    const newWords = [...words];
    newWords[index][field] = value;
    setWords(newWords);
  };

  const addWordRow = () => {
    setWords([...words, { kanji: '', hiragana_reading: '', english_meaning: '', word_type: 'vocab' }]);
  };

  const removeWordRow = (index) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First create the set
      const setResponse = await fetch('http://127.0.0.1:5000/api/practice-sets/create-with-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: setName,
          words: words.filter(w => w.kanji && w.hiragana_reading && w.english_meaning) // Only include filled words
        })
      });
      
      const data = await setResponse.json();
      setMessage(data.message);
      
      // Navigate back to practice sets after 1 second
      setTimeout(() => {
        navigate('/practice-sets');
      }, 1000);
      
    } catch (error) {
      setMessage('Error creating set: ' + error.message);
    }
  };

  return (
    <div className="add-set-page">
      <div className="add-set-container">
        <div className="page-header">
          <h1>Create New Practice Set</h1>
          <p>Add a set name and vocabulary words</p>
        </div>

        <form onSubmit={handleSubmit} className="add-set-form">
          <div className="set-name-section">
            <label>Set Name</label>
            <input
              type="text"
              placeholder="e.g., Work Vocabulary Ch. 1"
              value={setName}
              onChange={handleSetNameChange}
              required
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
                    {words.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeWordRow(index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="word-inputs">
                    <input
                      type="text"
                      placeholder="Kanji (勉強)"
                      value={word.kanji}
                      onChange={(e) => handleWordChange(index, 'kanji', e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Hiragana (べんきょう)"
                      value={word.hiragana_reading}
                      onChange={(e) => handleWordChange(index, 'hiragana_reading', e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="English (study)"
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

          <button type="submit" className="submit-btn">
            Create Set with {words.filter(w => w.kanji && w.hiragana_reading && w.english_meaning).length} Words
          </button>
        </form>

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

export default AddSet;