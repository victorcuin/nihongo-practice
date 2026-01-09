import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './PracticeSets.css';

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
    <div className="practice-sets-page">
      <div className="sets-header">
        <div>
          <h1>Practice Sets</h1>
          <p>Your organized vocabulary collections</p>
        </div>
        <button onClick={() => navigate('/add-set')} className="add-set-btn">
          + New Set
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <p>Loading sets...</p>
        </div>
      ) : practiceSets.length === 0 ? (
        <div className="empty-state">
          <p>No practice sets yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="sets-grid">
          {practiceSets.map(set => (
            <div 
              key={set.id} 
              onClick={() => navigate(`/practice-sets/${set.id}`)}
              className="set-card"
            >
              <h3>{set.name}</h3>
              <p className="set-date">
                Created {new Date(set.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Home
      </button>
    </div>
  );
}

export default PracticeSets;
