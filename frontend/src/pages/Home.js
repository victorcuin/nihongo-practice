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
            </header>
        </div>
    );
}

export default Home;