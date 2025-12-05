import { useNavigat, useNavigate, useParams } from "react-router-dom";

function ModeSelection(){
    const navigate = useNavigate();
    const { setId } = useParams();

    return (
        <div className="App">
            <header className="App-header">
                <h1>Choose Practice mode</h1>
                <p>Practice Set ID: {setId}</p>

                <div style={{marginTop: '30px'}}>
                    <button 
                        onClick={() => navigate(`/practice-sets/${setId}/practice`, {state: {mode: 'reading'}})}
                        style={{margin: '10px',padding:'20px 40px', fontSize:'18px'}}>
                            Practice by Reading
                            <br />
                            <small>(See kanji → type hiragana)</small>
                    </button>

                    <button 
                        onClick={() => navigate(`/practice-sets/${setId}/practice`, {state: {mode: 'meaning'}})}
                        style={{margin:'10px', padding:'20px 40px', fontSize:'18px'}}>
                            Practice by Meaning
                            <br />
                            <small>(See kanji → type english meaning) </small>
                    </button>
                </div>

                <button onClick={() => navigate('/practice-sets')} style={{ marginTop: '30px'}}>
                    Back to Sets
                </button>
            </header>
        </div>
    );
}

export default ModeSelection;