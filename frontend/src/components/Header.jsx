import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionamos a navegação do React Router
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Header() {
  const navigate = useNavigate();

  // 1. Verificamos se há um utilizador no LocalStorage
  const userString = localStorage.getItem('@MusicReview:user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Criamos a função para Deslogar
  const handleLogout = () => {
    localStorage.removeItem('@MusicReview:token');
    localStorage.removeItem('@MusicReview:user');
    navigate('/login'); // Força a ida para a página de Login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid px-4">
        
        {/* LADO ESQUERDO: Botão Home */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fs-4 fw-bold text-primary">🎵 MusicReview</span>
        </Link>

        {/* CENTRO: Barra de Pesquisa */}
        <form className="d-flex mx-auto" style={{ width: '40%' }}>
          <input 
            className="form-control bg-secondary text-white border-0 shadow-none px-3" 
            type="search" 
            placeholder="O que você quer procurar?" 
            aria-label="Pesquisar"
          />
        </form>

        {/* LADO DIREITO: Condicional (Logado vs Não Logado) */}
        <div className="d-flex align-items-center">
          {user ? (
            /* ==========================================
               SE O UTILIZADOR ESTIVER LOGADO (Mostra o Dropdown)
               ========================================== */
            <div className="dropdown">
              <button 
                className="btn btn-link p-0 border-0 dropdown-toggle d-flex align-items-center text-decoration-none" 
                type="button" 
                id="userMenu" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Perfil" 
                  className="rounded-circle border border-2 border-primary"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow" aria-labelledby="userMenu">
                {/* O nome do utilizador aparece dinamicamente aqui! */}
                <li><h6 className="dropdown-header">Olá, {user.name}!</h6></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/perfil">Gerenciar Conta</Link></li>
                <li><Link className="dropdown-item" to="/configuracoes">Configurações</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  {/* Transformámos a tag <a> num botão para usar o onClick */}
                  <button className="dropdown-item text-danger w-100 text-start" onClick={handleLogout}>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* ==========================================
               SE O UTILIZADOR FOR VISITANTE (Mostra botão Entrar)
               ========================================== */
            <Link to="/login" className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm">
              Entrar
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Header;