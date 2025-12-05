import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import PracticeSets from './pages/PracticeSets';
import ModeSelection from './pages/ModeSelection';
import PracticeSession from './pages/PracticeSession';

function App(){
  return(
    <Router>
      <Routes>
        <Route path ="/" element ={<Home />} />
        <Route path ="/practice-sets" element={<PracticeSets />} />
        <Route path ="/practice-sets/:setId" element={<ModeSelection />} />
        <Route path="/practice-sets/:setId/practice" element={<PracticeSession />} />
      </Routes>
    </Router>
  );
}
export default App;
