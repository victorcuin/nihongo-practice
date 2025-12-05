import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PracticeSets(){
    const navigate = useNavigate();

    //fake data to practice with
    const [practiceSets, setPracticeSets] = useState([
        { id: 1, name: "week 1", word_count:50},
        { id: 2, name: "Diffictult Verbs", word_count: 30},
    ])

    return (
        <div className="App">
            <header className="App-header">
                <h1> Practice Sets </h1>

                <button>+ Add New Set</button>

                <div style={{marginTop: '20px'}}>
                    {practiceSets.map(set => (
                        <div 
                            key={set.id} 
                            onClick={() => navigate(`/practice-sets/${set.id}`)}
                            style={{
                                border: '1px solid white',
                                padding: '10px',
                                margin:'10px',
                                cursor:'pointer'
                        }}>
                            <h3>{set.name}</h3>
                            <p>{set.word_count}</p>
                        </div>
                    ))}
                </div>
                
                <button onClick={() => navigate('/')}>Back to Home</button>
            </header>
        </div>
    );
}

export default PracticeSets;