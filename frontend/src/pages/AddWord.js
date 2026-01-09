import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AddWord.css';

function AddWord() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    kanji: '',
    hiragana_reading: '',
    english_meaning: '',
    word_type: 'vocab',
    set_id: ''
  });
  
  const [practiceSets, setPracticeSets] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch practice sets when component loads
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/practice-sets')
      .then(response => response.json())
      .then(data => {
        setPracticeSets(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, set_id: data[0].id }));
        }
      })
      .catch(error => console.error('Error fetching sets:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/words/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setMessage(data.message);
      
      // Clear form after successful submission
      setFormData({
        kanji: '',
        hiragana_reading: '',
        english_meaning: '',
        word_type: 'vocab',
        set_id: practiceSets.length > 0 ? practiceSets[0].id : ''
      });
    } catch (error) {
      setMessage('Error adding word: ' + error.message);
    }
  };

  if (practiceSets.length === 0) {
    return (
      <div className="add-word-page">
        <div className="empty-state">
          <h1>Add New Word</h1>
          <p>You need to create a practice set first!</p>
          <button onClick={() => navigate('/add-set')} className="primary-btn">
            Create Practice Set
          </button>
          <button onClick={() => navigate('/')} className="secondary-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-word-page">
      <div className="page-header">
        <h1>Add New Word</h1>
        <p>Add vocabulary to your practice sets</p>
      </div>

      <form onSubmit={handleSubmit} className="add-word-form">
        <div className="form-group">
          <label>Practice Set</label>
          <select
            name="set_id"
            value={formData.set_id}
            onChange={handleChange}
            required
          >
            {practiceSets.map(set => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Kanji</label>
          <input
            type="text"
            name="kanji"
            placeholder="勉強"
            value={formData.kanji}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Hiragana Reading</label>
          <input
            type="text"
            name="hiragana_reading"
            placeholder="べんきょう"
            value={formData.hiragana_reading}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>English Meaning</label>
          <input
            type="text"
            name="english_meaning"
            placeholder="study"
            value={formData.english_meaning}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Word Type</label>
          <select
            name="word_type"
            value={formData.word_type}
            onChange={handleChange}
          >
            <option value="vocab">Vocabulary</option>
            <option value="kanji">Kanji</option>
            <option value="onomatopoeia">Onomatopoeia</option>
          </select>
        </div>

        <button type="submit" className="primary-btn">
          Add Word
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <button onClick={() => navigate('/')} className="secondary-btn">
        Back to Home
      </button>
    </div>
  );
}

export default AddWord;