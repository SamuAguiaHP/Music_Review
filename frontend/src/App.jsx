import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal: A Home com os álbuns */}
        <Route path="/" element={<Home />} />
        
        {/* Nova rota: Página de Login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;