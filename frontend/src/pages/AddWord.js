import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function AddWord() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        kanji: '',
        hiragana_reading: '',
        english_meaning:'',
        word_type: 'vocab',
        category: 'work'
    });

    const [message, setMessage] = useState('');

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

            //Clear form after successful submission
            setFormData({
                kanji:'',
                hiragana_reading:'',
                english_meaning:'',
                word_type:'vocab',
                category:''
            });
        } catch (error) {
            setMessage('Error adding a word: ' + error.message);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Add New Word</h1>
                <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                    <div style={{margin: '10px'}}>
                        <input
                            type="text"
                            name="kanji"
                            placeholder="Kanji (勉強)"
                            value={formData.kanji}
                            onChange={handleChange}
                            required
                            style={{padding: '10px', fontSize: '16px', width: '300px'}}
                        />
                    </div>

                    <div style={{ margin : '10px'}}>
                        <input
                            type="text"
                            name="hiragana_reading"
                            placeholder="Hiragana (べんきょう)"
                            value={formData.hiragana_reading}
                            onChange={handleChange}
                            required
                            style={{padding:'10px', fontSize: '16px', width:'300px'}}
                        />
                    </div>

                    <div style={{ margin : '10px'}}>
                        <input
                            type="text"
                            name="english_meaning"
                            placeholder="English meaning (study)"
                            value={formData.english_meaning}
                            onChange={handleChange}
                            required
                            style={{padding:'10px', fontSize: '16px', width:'300px'}}
                        />
                    </div>

                    <div style={{ margin : '10px'}}>
                        <select
                            name="word_type"
                            value={formData.word_type}
                            onChange={handleChange}
                            style={{padding:'10px', fontSize:'16px', width:'324px'}}
                        >
                            <option value="vocab">Vocabulary</option>
                            <option value="kanji">Kanji</option>
                            <option value="onomatopoeia">Onomatopoeia</option>
                        </select>
                    </div>

                    <div style={{ margin : '10px'}}>
                        <input
                            type="text"
                            name="category"
                            placeholder="Category (work, family, school,, etc.)"
                            value={formData.category}
                            onChange={handleChange}
                            style={{padding: '10px', fontSize:'16px',width:'300px'}}
                        />
                    </div>

                    <button type="submit" style={{marginTop: '20px', padding:'10px 30px'}}>
                        Add word
                    </button>
                </form>

                {message && (
                    <div style={{ marginTop: '20px', color: message.includes('Error') ? 'red' : 'lightgreen' }}>
                        {message}
                    </div>
                )}

                <button onClick={() => navigate('/')} style={{ marginTop: '30px' }}>
                    Back to Home
                </button>
            </header>
        </div>
    );
}

export default AddWord;