import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PracticeSets() {
  const navigate = useNavigate();
  const [practiceSets, setPracticeSets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=> {
    fetch('http://127.0.0.1:5000/api/practice-sets')
      .then(response => response.json())
      .then(data => {
        setPracticeSets(data);
        setLoading(false);
      })
      .catch(error =>{
        console.error('Error fetching sets:', error);
        setLoading(false);
      });
  }, []);

  if (loading){
    return (
      <div className="App">
        <header className="App-header">
          <p>Loading sets...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Practice Sets</h1>
        
        <button onClick={() => navigate('/add-set')}>+ Add New Set</button>
        
        <div style={{ marginTop: '20px' }}>
          {practiceSets.length===0 ? (
            <p>No pratice sets yet. Create one to get Started!</p>
          ):(
            practiceSets.map(set => (
              <div 
                key={set.id} 
                onClick={() => navigate(`/practice-sets/${set.id}`)}
                style={{ 
                  border: '1px solid white', 
                  padding: '10px', 
                  margin: '10px',
                  cursor: 'pointer' 
                }}
              >
                <h3>{set.name}</h3>
                <p>Created: {new Date(set.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
        
        <button onClick={() => navigate('/')}>Back to Home</button>
      </header>
    </div>
  );
}

export default PracticeSets;
