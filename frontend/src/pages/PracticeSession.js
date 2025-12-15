import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PracticeSession() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const location = useLocation();
  const mode = location.state?.mode;
  
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch words when component loads
  useEffect(() => {
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

  if (words.length === 0) {
    return (
      <div className="App">
        <header className="App-header">
          <p>No words found in this set!</p>
          <button onClick={() => navigate('/practice-sets')}>Back to Sets</button>
        </header>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleSubmit = () => {
    const correctAnswer = mode === 'reading' 
      ? currentWord.hiragana_reading 
      : currentWord.english_meaning;
    
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback({
        isCorrect: true,
        message: "✓ Correct!"
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: mode === 'reading'
          ? `✗ Wrong. Correct reading: ${currentWord.hiragana_reading} (${currentWord.english_meaning})`
          : `✗ Wrong. Correct meaning: ${currentWord.english_meaning} (${currentWord.hiragana_reading})`
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setFeedback("");
    } else {
      alert("You've completed all words!");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Practice Session</h1>
        <p>Set: {setId} | Mode: {mode} | Word {currentIndex + 1} of {words.length}</p>
        
        <div style={{ marginTop: '40px', fontSize: '48px' }}>
          {currentWord.kanji}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <p>{mode === 'reading' ? 'Type the hiragana reading:' : 'Type the English meaning:'}</p>
          <input 
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                if (feedback) {
                  handleNext();
                }else {
                  handleSubmit();
                }
              }
            }}
            style={{ padding: '10px', fontSize: '18px', width: '300px' }}
          />
        </div>
        
        <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 30px' }}>
          Submit Answer
        </button>
        
        {feedback && (
          <>
            <div style={{ 
              marginTop: '20px', 
              fontSize: '24px',
              color: feedback.isCorrect ? 'lightgreen' : '#ff6b6b'
            }}>
              {feedback.message}
            </div>
            <button onClick={handleNext} style={{ marginTop: '20px', padding: '10px 30px' }}>
              Next Word →
            </button>
          </>
        )}
        
        <button onClick={() => navigate('/practice-sets')} style={{ marginTop: '40px' }}>
          End Practice
        </button>
      </header>
    </div>
  );
}

export default PracticeSession;