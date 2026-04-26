import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const userString = localStorage.getItem('@MusicReview:user');
  const user = userString ? JSON.parse(userString) : null;

// NOVO: Função que dispara ao dar "Enter" na pesquisa
  const handleSearch = (e) => {
    e.preventDefault(); // Evita que a página recarregue
    if (!search.trim()) return; // Não faz nada se estiver vazio
    navigate(`/?q=${search}`); // Muda a URL para /?q=texto
  };

  const handleLogout = () => {
    localStorage.removeItem('@MusicReview:token');
    localStorage.removeItem('@MusicReview:user');
    navigate('/login');
  };

  // Estilos inline para garantir a consistência visual
  const styles = {
    nav: {
      background: 'linear-gradient(to right, #121212, #2b1055)',
      borderBottom: '1px solid rgba(168, 85, 247, 0.2)', // Borda roxa sutil
      backdropFilter: 'blur(10px)',
    },
    searchWrapper: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '35%',
    },
    loginBtn: {
      background: 'linear-gradient(45deg, #a855f7, #6366f1)',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      transition: '0.3s',
    },
    dropdownMenu: {
      backgroundColor: '#1e1e1e',
      border: '1px solid #a855f7',
      borderRadius: '12px',
      marginTop: '10px',
    },
    searchInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={styles.nav}>
      <div className="container-fluid px-4 position-relative d-flex align-items-center justify-content-between">
        
        {/* LOGO (Lado Esquerdo) */}
        <Link className="navbar-brand fw-bold" to="/" style={{ zIndex: 2 }}>
          <span style={{ color: '#a855f7' }}>🎵 MusicReview</span>
        </Link>

       {/* BUSCA (Centro absoluto) */}
        <form className="d-none d-lg-flex" style={styles.searchWrapper} onSubmit={handleSearch}>
          <input 
            className="form-control px-4 rounded-pill border-0 text-white w-100" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', boxShadow: 'none' }}
            type="search" 
            placeholder="Pesquisar artistas ou álbuns..." 
            value={search} // Conecta o input ao estado
            onChange={(e) => setSearch(e.target.value)} // Atualiza o estado ao digitar
          />
        </form>

        <div className="d-flex align-items-center">
          {user ? (
            /* DROPDOWN CUSTOMIZADO */
            <div className="dropdown">
              <button 
                className="btn btn-link p-0 border-0 dropdown-toggle d-flex align-items-center text-decoration-none" 
                data-bs-toggle="dropdown"
              >
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=a855f7&color=fff`} 
                  alt="Perfil" 
                  className="rounded-circle border border-2 shadow"
                  style={{ width: '42px', height: '42px', borderColor: '#a855f7' }} 
                />
              </button>
             <ul className="dropdown-menu dropdown-menu-end shadow-lg" style={styles.dropdownMenu}>
                <li><h6 className="dropdown-header text-secondary">Olá, {user.name}</h6></li>
                {/* Opções solicitadas */}
                <li><Link className="dropdown-item py-2 text-white" to="/opcoes">⚙️ Opções</Link></li>
                <li><Link className="dropdown-item py-2 text-white" to="/perfil">👤 Gerenciar conta</Link></li>
                <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>🚪 Sair</button></li>
              </ul>
            </div>
          ) : (
            /* BOTÃO ENTRAR NO PADRÃO DA TELA DE LOGIN */
            <Link 
              to="/login" 
              className="btn rounded-pill px-4 shadow-sm"
              style={styles.loginBtn}
              onMouseOver={(e) => e.target.style.filter = 'brightness(1.2)'}
              onMouseOut={(e) => e.target.style.filter = 'brightness(1.0)'}
            >
              Entrar
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Header;