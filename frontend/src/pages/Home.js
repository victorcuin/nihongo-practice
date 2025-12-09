import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();

    return (
        <div className="App">
            <header className="App-header">
                <h1>日本語 Practice</h1>
                <p>Learn N2 vocab</p>
                <button onClick={() => navigate('/practice-sets')}>
                    Practice Sets
                </button>

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