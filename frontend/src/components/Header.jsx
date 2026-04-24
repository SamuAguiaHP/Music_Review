import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Necessário para o dropdown funcionar

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid px-4">
        
        {/* LADO ESQUERDO: Botão Home */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <span className="fs-4 fw-bold text-primary">🎵 MusicReview</span>
        </a>

        {/* CENTRO: Barra de Pesquisa */}
        <form className="d-flex mx-auto" style={{ width: '40%' }}>
          <input 
            className="form-control bg-secondary text-white border-0 shadow-none px-3" 
            type="search" 
            placeholder="O que você quer ouvir?" 
            aria-label="Pesquisar"
          />
        </form>

        {/* LADO DIREITO: Dropdown de Usuário */}
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
            <li><h6 className="dropdown-header">Olá, Samuel!</h6></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Gerenciar Conta</a></li>
            <li><a className="dropdown-item" href="#">Configurações</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="/login">Sair</a></li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;