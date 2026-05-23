import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Estado para abrir/fechar busca mobile

  const userString = localStorage.getItem('@MusicReview:user') || sessionStorage.getItem('@MusicReview:user');
  const user = userString ? JSON.parse(userString) : null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setIsSearchOpen(false);
    navigate(`/?q=${search}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Barra de Pesquisa Mobile (Overlay) - Só aparece quando isSearchOpen é true */}
      {isSearchOpen && (
        <div className="fixed-top d-lg-none d-flex align-items-center px-3" 
             style={{ height: '80px', backgroundColor: '#121212', zIndex: 1060 }}>
          <button className="btn btn-link text-white p-0 me-3" onClick={() => setIsSearchOpen(false)}>
            <i className="bi bi-x-lg fs-4"></i>
          </button>
          <form className="flex-grow-1" onSubmit={handleSearch}>
            <input 
              autoFocus
              className="form-control rounded-pill border-0 text-white shadow-none" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              placeholder="Pesquisar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      )}

      {/* Navbar Principal */}
      <nav className="navbar navbar-dark fixed-top px-4" style={{ background: 'linear-gradient(to right, #121212, #2b1055)', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', zIndex: 1050 }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button className="btn btn-link text-white d-lg-none me-3 p-0" onClick={toggleSidebar}>
              <i className="bi bi-list fs-2"></i>
            </button>
            <Link className="navbar-brand fw-bold" to="/">
              <span style={{ color: '#a855f7' }}>🎵 MusicReview</span>
            </Link>
          </div>

          {/* Pesquisa Desktop (esconde em telas pequenas) */}
          <form className="d-none d-lg-flex" style={{ width: '35%' }} onSubmit={handleSearch}>
            <input 
              className="form-control rounded-pill border-0 text-white shadow-none" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
              placeholder="Pesquisar artistas ou álbuns..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="d-flex align-items-center">
            {/* Ícone de lupa para mobile (esconde em telas grandes) */}
            <button className="btn btn-link text-white d-lg-none p-0 me-3" onClick={() => setIsSearchOpen(true)}>
              <i className="bi bi-search fs-4"></i>
            </button>

            {user ? (
              <div className="dropdown">
                <button className="btn btn-link p-0 border-0 dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=a855f7&color=fff`} alt="Perfil" className="rounded-circle border border-2 shadow" style={{ width: '42px', height: '42px', borderColor: '#a855f7' }} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ backgroundColor: '#1e1e1e', border: '1px solid #a855f7' }}>
                  <li><h6 className="dropdown-header text-secondary">Olá, {user.name}</h6></li>
                  <li><Link className="dropdown-item py-2 text-white" to="/profile">👤 Gerenciar conta</Link></li>
                  <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>🚪 Sair</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn rounded-pill px-4 shadow-sm" style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', color: 'white' }}>Entrar</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;