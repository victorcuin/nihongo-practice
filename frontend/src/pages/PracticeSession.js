import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './PracticeSession.css';

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
    // Check if practicing mastered words (passed via state)
    const masteredWords = location.state?.words;
    
    if (masteredWords) {
      setAllWords(masteredWords);
      setCurrentWords(masteredWords);
      setLoading(false);
      return;
    }
    // otherwise, fetch from set as usual
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
      <div className="practice-session-page">
        <div className="completion-screen">
          <div className="completion-card">
            <div className="completion-icon">🎉</div>
            <h1>Practice Complete!</h1>
            <p className="completion-message">
              You mastered all {allWords.length} words!
            </p>
            <p className="rounds-info">Rounds needed: {round}</p>
            
            <div className="completion-actions">
              <button 
                onClick={() => {
                  setCurrentWords(allWords);
                  setMissedWords([]);
                  setCurrentIndex(0);
                  setUserAnswer("");
                  setFeedback(null);
                  setRound(1);
                }} 
                className="primary-btn"
              >
                Practice Again
              </button>
              
              <button 
                onClick={() => navigate('/practice-sets')} 
                className="secondary-btn"
              >
                Back to Sets
              </button>
            </div>
          </div>
        </div>
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
    <div className="practice-session-page">
      {/* Shuffle button */}
      <button 
        onClick={handleToggleShuffle}
        className={`shuffle-btn ${isShuffled ? 'active' : ''}`}
      >
        {isShuffled ? '🔀 Shuffled' : '📋 In Order'}
      </button>

      <div className="practice-container">
        {/* Progress header */}
        <div className="practice-header">
          <div className="progress-info">
            <span className="round-badge">Round {round}</span>
            <span className="word-counter">Word {currentIndex + 1} of {currentWords.length}</span>
          </div>
          <div className="mode-info">
            {mode === 'reading' ? 'Practice by Reading' : 'Practice by Meaning'}
          </div>
        </div>

        {/* Main card */}
        <div className="practice-card">
          <div className="kanji-display">
            {currentWord.kanji}
          </div>

          <div className="word-progress">
            ✓ {currentWord.correct_count || 0} | ✗ {currentWord.incorrect_count || 0}
            {currentWord.is_mastered && <span className="mastered-tag">⭐ Mastered</span>}
            {currentWord.is_struggling && <span className="struggling-tag">⚠️ Struggling</span>}
          </div>

          <div className="input-section">
            <label>
              {mode === 'reading' ? 'Type the hiragana reading:' : 'Type the English meaning:'}
            </label>
            <input 
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (feedback) {
                    handleNext();
                  } else {
                    handleSubmit();
                  }
                }
              }}
              placeholder={mode === 'reading' ? 'べんきょう' : 'study'}
              autoFocus
            />
          </div>

          <button onClick={handleSubmit} className="submit-btn">
            Submit Answer
          </button>

          {feedback && (
            <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-message">{feedback.message}</div>
              <button onClick={handleNext} className="next-btn">
                Next Word →
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/practice-sets')} className="end-practice-btn">
          End Practice
        </button>
      </div>
    </div>
  );
}

export default PracticeSession;