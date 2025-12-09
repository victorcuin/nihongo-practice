import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    <div className="App">
      <header className="App-header" style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
        <h1>Create New Practice Set</h1>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', width: '600px' }}>
          <div style={{ margin: '10px' }}>
            <input
              type="text"
              placeholder="Set name (e.g., Work Vocabulary Ch. 1)"
              value={setName}
              onChange={handleSetNameChange}
              required
              style={{ padding: '10px', fontSize: '16px', width: '580px' }}
            />
          </div>
          
          <h3 style={{ marginTop: '30px' }}>Words</h3>
          
          {words.map((word, index) => (
            <div key={index} style={{ 
              border: '1px solid white', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Word {index + 1}</span>
                {words.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeWordRow(index)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <input
                type="text"
                placeholder="Kanji (勉強)"
                value={word.kanji}
                onChange={(e) => handleWordChange(index, 'kanji', e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '540px', margin: '5px 0' }}
              />
              
              <input
                type="text"
                placeholder="Hiragana (べんきょう)"
                value={word.hiragana_reading}
                onChange={(e) => handleWordChange(index, 'hiragana_reading', e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '540px', margin: '5px 0' }}
              />
              
              <input
                type="text"
                placeholder="English meaning (study)"
                value={word.english_meaning}
                onChange={(e) => handleWordChange(index, 'english_meaning', e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '540px', margin: '5px 0' }}
              />
              
              <select
                value={word.word_type}
                onChange={(e) => handleWordChange(index, 'word_type', e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '558px', margin: '5px 0' }}
              >
                <option value="vocab">Vocabulary</option>
                <option value="kanji">Kanji</option>
                <option value="onomatopoeia">Onomatopoeia</option>
              </select>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addWordRow}
            style={{ marginTop: '10px', padding: '10px 20px' }}
          >
            + Add Another Word
          </button>
          
          <div style={{ marginTop: '30px' }}>
            <button type="submit" style={{ padding: '15px 40px', fontSize: '16px' }}>
              Create Set with Words
            </button>
          </div>
        </form>
        
        {message && (
          <div style={{ marginTop: '20px', color: message.includes('Error') ? 'red' : 'lightgreen' }}>
            {message}
          </div>
        )}
        
        <button onClick={() => navigate('/practice-sets')} style={{ marginTop: '20px' }}>
          Cancel
        </button>
      </header>
    </div>
  );
}

export default AddSet;