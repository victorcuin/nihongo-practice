import { useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react';

function Home(){
    const navigate = useNavigate();
    const [masteredCount, setMasteredCount] = useState(0);

    useEffect(()=> {
        //fetch mastered word count
        fetch('http://127.0.0.1:5000/api/mastered-words')
            .then(response => response.json())
            .then(data => setMasteredCount(data.length))
            .catch(error => console.error('Error:', error))
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <h1>日本語 Practice</h1>
                <p>Learn N2 vocab</p>
                <button onClick={() => navigate('/practice-sets')}>
                    Practice Sets
                </button>
                {masteredCount > 0 && (
                    <button 
                        onClick={() => navigate('/mastered-words')} 
                        style={{ marginTop: '10px', backgroundColor: '#4CAF50', border: 'none' }}
                    >
                        ⭐ Mastered Words ({masteredCount})
                    </button>
                )}

                <button onClick={() => navigate('/add-word')} style={{ marginTop: '10px'}}>
                    Add New Word
                </button>        

                <button onClick={() => navigate('/view-words')} style={{ marginTop: '10px'}}>
                    View All Words    
                </button>        
            </header>
        </div>
    );
}

export default Home;