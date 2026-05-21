import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, isMobile, closeSidebar }) {
  const location = useLocation();
  const userString = localStorage.getItem('@MusicReview:user') || sessionStorage.getItem('@MusicReview:user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === 'ADMIN';

  const styles = {
    // 1. Overlay: Fica atrás da sidebar, escurece apenas o conteúdo da página
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro
      zIndex: 1045, // Abaixo da sidebar
      display: isMobile && isOpen ? 'block' : 'none'
    },
    // 2. Sidebar: Conteúdo no topo, opacidade 100% sempre
    aside: {
      width: '260px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      // Se for mobile, fica escondida (-260px) ou aberta (0)
      // Se for desktop, fica sempre em 0
      left: !isMobile || isOpen ? 0 : '-260px',
      backgroundColor: '#121212',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '20px',
      paddingTop: '90px',
      transition: 'left 0.3s ease-in-out',
      zIndex: 1050, // Sidebar no topo, acima do overlay
      overflowY: 'auto'
    },
    section: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '15px'
    },
    navItem: {
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '10px 0',
      transition: '0.2s',
      fontWeight: '600'
    }
  };

  return (
    <>
      {/* O Overlay é um elemento irmão da Aside */}
      <div style={styles.overlay} onClick={closeSidebar}></div>

      <aside style={styles.aside}>
        {/* Navegação Principal */}
        <div style={styles.section}>
          <Link 
            to="/" 
            onClick={closeSidebar} 
            style={{...styles.navItem, color: location.pathname === '/' ? '#fff' : '#b3b3b3'}}
          >
            <i className="bi bi-house-door-fill"></i> Início
          </Link>
          <Link 
            to="/explorar" 
            onClick={closeSidebar} 
            style={{...styles.navItem, color: location.pathname === '/explorar' ? '#fff' : '#b3b3b3'}}
          >
            <i className="bi bi-compass"></i> Explorar
          </Link>
        </div>

        {/* Seção da Administração */}
        {isAdmin && (
          <div style={{ ...styles.section, border: '1px solid rgba(220, 53, 69, 0.3)' }}>
            <span className="small fw-bold text-danger d-block mb-2">ADMINISTRAÇÃO</span>
            <Link 
              to="/admin" 
              onClick={closeSidebar} 
              style={{ ...styles.navItem, color: '#dc3545' }}
            >
              <i className="bi bi-shield-lock-fill"></i> Gerenciar Contas
            </Link>
          </div>
        )}

        {/* Biblioteca */}
        <div style={styles.section}>
          <div className="d-flex justify-content-between align-items-center mb-3 text-secondary">
            <span className="small fw-bold">SUA BIBLIOTECA</span>
          </div>
          
          {['Favoritos', 'Ouvir Depois', 'Rock 80s'].map(item => (
            <div key={item} style={styles.navItem} className="text-secondary">
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2b1055', borderRadius: '4px' }}></div>
              <span className="text-truncate">{item}</span>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;