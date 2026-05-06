import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AlbumDetails from './pages/AlbumDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas*/}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/album/:id" element={<AlbumDetails />} />
      </Routes>
    </Router>
  );
}

export default App;