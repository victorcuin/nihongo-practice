import { useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';

function ViewWords() {
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/words')
        .then(response => response.json())
        .then(data =>{
            setWords(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching words: ', error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Loading words...</p>
                </header>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>All words ({words.length})</h1>

                <div style={{ marginTop: '20px', maxHeight: '500px', overflowY: 'scroll'}}>
                    {words.map(word => (
                        <div
                            key={word.id}
                            style={{
                                border: '1px solid white',
                                padding: '10px',
                                margin: '10px',
                                textAlign: 'left',
                                width: '400px'
                            }}
                        >
                            <div style={{ fontSize: '24px'}}>{word.kanji}</div>
                            <div>{word.hiragana_readining}</div>
                            <div>{word.english_readining}</div>
                            <div style={{ fontSize: '12px', marginTop:'5px'}}>
                                Category: {word.categories || 'none'} | Type: {word.word_type || 'vocab'}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate('/')} style={{marginTop: '20px'}}>
                    Back to Home
                </button>
            </header>
        </div>
    );
}

export default ViewWords;