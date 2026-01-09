import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [masteredCount, setMasteredCount] = useState(0);

  useEffect(() => {
    // Fetch mastered word count
    fetch('http://127.0.0.1:5000/api/mastered-words')
      .then(response => response.json())
      .then(data => setMasteredCount(data.length))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="home-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>日本語 Practice</h1>
          <p>Your Japanese Workshop</p>
        </div>

        <div className="sidebar-nav">
          <button onClick={() => navigate('/practice-sets')} className="nav-button">
            <span className="nav-icon">📚</span>
            <span>Practice Sets</span>
          </button>

          {masteredCount > 0 && (
            <button onClick={() => navigate('/mastered-words')} className="nav-button mastered">
              <span className="nav-icon">⭐</span>
              <span>Mastered Words</span>
              <span className="badge">{masteredCount}</span>
            </button>
          )}

          <button onClick={() => navigate('/add-word')} className="nav-button">
            <span className="nav-icon">➕</span>
            <span>Add New Word</span>
          </button>

          <button onClick={() => navigate('/view-words')} className="nav-button">
            <span className="nav-icon">📖</span>
            <span>View All Words</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="content-header">
          <h2>Featured Content</h2>
          <p>Your magazine into Japanese culture</p>
        </div>

        <div className="content-grid">
        {/* Big featured card */}
        <div className="content-card featured">
            <div className="card-image-placeholder">
            <p>🎵</p>
            </div>
            <div className="card-content">
            <h3>Music of the Week</h3>
            <p>Discover the latest Japanese tracks and artists making waves</p>
            </div>
        </div>

        {/* Smaller cards below */}
        <div className="small-cards-grid">
            <div className="content-card">
            <div className="card-image-placeholder">
                <p>📰</p>
            </div>
            <h3>Culture</h3>
            <p>Latest from Japan</p>
            </div>

            <div className="content-card">
            <div className="card-image-placeholder">
                <p>🚗</p>
            </div>
            <h3>JDM</h3>
            <p>Car culture</p>
            </div>

            <div className="content-card">
            <div className="card-image-placeholder">
                <p>👔</p>
            </div>
            <h3>Fashion</h3>
            <p>Streetwear</p>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;