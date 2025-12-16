import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PracticeSession() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const location = useLocation();
  const mode = location.state?.mode;
  
  const [allWords, setAllWords] = useState([]); // all words in the set
  const [currentWords, setCurrentWords] = useState([]); // words currently being practiced
  const [missedWords, setMissedWords] = useState([]); // words answered incorrectly
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1); // Track which round were on

  const[isShuffled, setIsShuffled] = useState(false);

  // Fetch words when component loads
  useEffect(() => {
    const strugglingOnly = location.state?.strugglingOnly;
    const endpoint = strugglingOnly 
      ? `http://127.0.0.1:5000/api/practice-sets/${setId}/struggling-words`
      : `http://127.0.0.1:5000/api/practice-sets/${setId}/words`;
    
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        setAllWords(data);
        setCurrentWords(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching words:', error);
        setLoading(false);
      });
  }, [setId, location.state?.strugglingOnly]);

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Loading words...</p>
        </header>
      </div>
    );
  }

  if (allWords.length === 0) {
    return (
      <div className="App">
        <header className="App-header">
          <p>No words found in this set!</p>
          <button onClick={() => navigate('/practice-sets')}>Back to Sets</button>
        </header>
      </div>
    );
  }

  const currentWord = currentWords[currentIndex];

  const handleSubmit = async () => {
    const correctAnswer = mode === 'reading' 
      ? currentWord.hiragana_reading 
      : currentWord.english_meaning;
    
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    // Record the answer in the database
    try{
      await fetch('http://127.0.0.1:5000/api/practice/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word_id: currentWord.id,
          set_id: setId,
          is_correct: isCorrect
        })
      });
    } catch (error) {
      console.error('Error recording answer:', error);
    }
    
    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: mode === 'reading'
          ? `✓ Correct! ${currentWord.hiragana_reading} = ${currentWord.english_meaning}`
          : `✓ Correct! ${currentWord.english_meaning} (${currentWord.hiragana_reading})`
      });
    } else {

      //add to missed words if not there
      if(!missedWords.find(w=> w.id === currentWord.id)){
        setMissedWords([...missedWords,currentWord])
      }
      setFeedback({
        isCorrect: false,
        message: mode === 'reading'
          ? `✗ Wrong. Correct reading: ${currentWord.hiragana_reading} (${currentWord.english_meaning})`
          : `✗ Wrong. Correct meaning: ${currentWord.english_meaning} (${currentWord.hiragana_reading})`
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setFeedback(null);
    } else {
      // Finished current round
      if (missedWords.length > 0) {
        // Start new round with only missed words
        setCurrentWords(missedWords);
        setMissedWords([]);
        setCurrentIndex(0);
        setUserAnswer("");
        setFeedback(null);
        setRound(round + 1);
      } else {
        // All words correct! Show completion
        setFeedback({
          isCorrect: true,
          message: "🎉 Perfect! You got all words correct!"
        });
      }
    }
  };

  // Show completion screen
  if (currentIndex >= currentWords.length && missedWords.length === 0 && feedback?.message.includes("Perfect")) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Practice Complete!</h1>
          <p style={{ fontSize: '48px', marginTop: '20px' }}>🎉</p>
          <p style={{ fontSize: '24px', marginTop: '20px' }}>
            You mastered all {allWords.length} words!
          </p>
          <p style={{ marginTop: '10px' }}>Rounds needed: {round}</p>
          
          <button 
            onClick={() => {
              // Reset everything to practice again
              setCurrentWords(allWords);
              setMissedWords([]);
              setCurrentIndex(0);
              setUserAnswer("");
              setFeedback(null);
              setRound(1);
            }} 
            style={{ marginTop: '30px', padding: '15px 30px' }}
          >
            Practice Again
          </button>
          
          <button 
            onClick={() => navigate('/practice-sets')} 
            style={{ marginTop: '10px', padding: '15px 30px' }}
          >
            Back to Sets
          </button>
        </header>
      </div>
    );
  }


  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i> 0; i--){
      const j = Math.floor(Math.random() *  (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const handleToggleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled){
      setCurrentWords(shuffleArray(currentWords));
    } else {
      setCurrentWords([...allWords]);
    }
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback(null);
  };


  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={handleToggleShuffle}
          style={{
            position: 'absolute', 
            top: '20px', 
            right: '20px',
            padding: '10px 20px',
            backgroundColor: isShuffled ? '#4CAF50' : '#888',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isShuffled ? 'Shuffled' : 'In Order'}
        </button>

        <h1>Practice Session - Round {round}</h1>
        <p>Set: {setId} | Mode: {mode} | Word {currentIndex + 1} of {currentWords.length}</p>
        {missedWords.length > 0 && currentIndex === 0 && round > 1 && (
          <p style={{ color: '#ff6b6b' }}>Practicing missed words from previous round</p>
        )}
        <div style={{ marginTop: '40px', fontSize: '48px' }}>
          {currentWord.kanji}
        </div>

        <div style={{ marginTop: '10px', fontSize: '16px', color: '#aaa' }}>
          Progress: ✓ {currentWord.correct_count || 0} | ✗ {currentWord.incorrect_count || 0}
          {currentWord.is_mastered && <span style={{ color: '#4CAF50', marginLeft: '10px' }}>⭐ Mastered</span>}
          {currentWord.is_struggling && <span style={{ color: '#ff6b6b', marginLeft: '10px' }}>⚠️ Struggling</span>}
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