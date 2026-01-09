import { useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';
import './ViewWords.css';

function ViewWords() {
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/words')
        .then(response => response.json())
        .then(data => {
            setWords(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching words:', error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="view-words-page">
                <div className="loading">
                    <p>Loading words...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-words-page">
            <div className="page-header">
                <h1>All Words ({words.length})</h1>
                <p>Your complete vocabulary collection</p>
            </div>

            <div className="words-list">
                {words.map(word => (
                    <div key={word.id} className="word-card">
                        <div className="word-main">
                            <div className="word-kanji">{word.kanji}</div>
                            <div className="word-reading">{word.hiragana_reading}</div>
                            <div className="word-meaning">{word.english_meaning}</div>
                        </div>
                        <div className="word-meta">
                            Type: {word.word_type || 'vocab'}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={() => navigate('/')} className="back-btn">
                ← Back to Home
            </button>
        </div>
    );
}

export default ViewWords;