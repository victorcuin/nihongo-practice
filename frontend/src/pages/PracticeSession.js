import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState } from 'react';

function PracticeSession(){
    const navigate = useNavigate();
    const { setId } = useParams();
    const location = useLocation();
    const mode = location.state?.mode; //reading or meaning 

    //fake word for now
    const [currentWord] = useState({
        kanji: "勉強",
        hiragana: "べんきょう",
        meaning: "study"
    });

    const[userAnswer, setUserAnswer] = useState("");
    const[feedback, setFeedback] = useState("");

    const handleSubmit = () => {
        const correctAnswer = mode === 'reading' ? currentWord.hiragana : currentWord.meaning;

        if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()){
            setFeedback("✓ Correct!");
        } else {
            setFeedback(`✗ Wrong. Correct answer: ${correctAnswer}`);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Practice Session</h1>
                <p>SetL {setId} | Mode: {mode}</p>

                <div style={{marginTop: '40px', fontSize:'48px'}}>
                    {currentWord.kanji}
                </div>

                <div style={{marginTop: '20px'}}>
                    <p>{mode === 'reading' ? 'Type the hiragana reading:' : 'Type the English meaning:'}</p>
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => {
                            if(e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        style={{ padding: '10px', fontSize: '18px', width: '300px'}}
                        placeholder={mode === 'reading' ? 'べんきょう': 'study'}
                    />
                </div>

                <button onClick={handleSubmit} style ={{marginTop:'20px', padding:'10px 30px'}}>
                    Submit Answer
                </button>

                {feedback && (
                    <div style={{ marginTop: '20px', fontSize:'24px'}}>
                        {feedback}
                    </div>
                )}

                <button onClick={()=> navigate('/practice-sets')} style={{ marginTop: '40px'}}>
                    End Practice
                </button>
            </header>
        </div>
    );
}

export default PracticeSession;