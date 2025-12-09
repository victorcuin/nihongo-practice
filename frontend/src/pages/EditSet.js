import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
      <div className="App">
        <header className="App-header">
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header" style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
        <h1>Edit Practice Set</h1>
        
        <div style={{ marginTop: '20px', width: '600px' }}>
          <div style={{ margin: '10px' }}>
            <input
              type="text"
              placeholder="Set name"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', width: '580px' }}
            />
          </div>
          
          <h3 style={{ marginTop: '30px' }}>Words ({words.length})</h3>
          
          {words.map((word, index) => (
            <div key={index} style={{ 
              border: '1px solid white', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Word {index + 1}</span>
                <button 
                  type="button"
                  onClick={() => removeWord(index)}
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                  Remove
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Kanji"
                value={word.kanji}
                onChange={(e) => handleWordChange(index, 'kanji', e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '540px', margin: '5px 0' }}
              />
              
              <input
                type="text"
                placeholder="Hiragana"
                value={word.hiragana_reading}
                onChange={(e) => handleWordChange(index, 'hiragana_reading', e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '540px', margin: '5px 0' }}
              />
              
              <input
                type="text"
                placeholder="English meaning"
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
            <button onClick={handleSave} style={{ padding: '15px 40px', fontSize: '16px' }}>
              Save Changes
            </button>
          </div>
        </div>
        
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

export default EditSet;