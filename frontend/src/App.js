import './App.css';
import AddWord from './pages/AddWord';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import PracticeSets from './pages/PracticeSets';
import ModeSelection from './pages/ModeSelection';
import PracticeSession from './pages/PracticeSession';
import ViewWords from './pages/ViewWords';
import AddSet from './pages/AddSet';
import EditSet from './pages/EditSet';
import ViewSetWords from './pages/ViewSetWords';

function App(){
  return(
    <Router>
      <Routes>
        <Route path ="/" element ={<Home />} />
        <Route path ="/practice-sets" element={<PracticeSets />} />
        <Route path ="/practice-sets/:setId" element={<ModeSelection />} />
        <Route path="/practice-sets/:setId/practice" element={<PracticeSession />} />
        <Route path="/add-word" element={<AddWord />} />
        <Route path="/view-words" element={<ViewWords />} />
        <Route path="/add-set" element={<AddSet />} />
        <Route path="/practice-sets/:setId/edit" element={<EditSet />} />
        <Route path="/practice-sets/:setId/view-words" element={<ViewSetWords />} />
      </Routes>
    </Router>
  );
}
export default App;
