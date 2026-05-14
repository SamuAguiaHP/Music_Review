// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  // 1. Resgata os dados do usuário para verificar o cargo (role)
const userString = localStorage.getItem('@MusicReview:user') || sessionStorage.getItem('@MusicReview:user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === 'ADMIN';
  const styles = {
    container: {
      width: '260px',
      height: 'calc(100vh - 70px)',
      position: 'fixed',
      left: 0,
      top: '70px',
      backgroundColor: '#121212',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1000
    },
    section: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '15px'
    },
    navItem: {
      color: '#b3b3b3',
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
    <aside style={styles.container}>
      {/* Navegação Principal */}
      <div style={styles.section}>
        <Link to="/home" style={styles.navItem} className="hover-white">
          <i className="bi bi-house-door-fill"></i> Início
        </Link>
        <Link to="/explorar" style={styles.navItem} className="hover-white">
          <i className="bi bi-compass"></i> Explorar
        </Link>
      </div>

      {/* 2. Seção da Administração*/}
      {isAdmin && (
        <div style={{ ...styles.section, border: '1px solid rgba(220, 53, 69, 0.3)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="small fw-bold text-danger">ADMINISTRAÇÃO</span>
          </div>
          <Link to="/admin" style={{ ...styles.navItem, color: '#dc3545' }} className="hover-white">
            <i className="bi bi-shield-lock-fill"></i> Gerenciar Contas
          </Link>
        </div>
      )}

      {/* Biblioteca */}
      <div style={styles.section}>
        <div className="d-flex justify-content-between align-items-center mb-3 text-secondary">
          <span className="small fw-bold">SUA BIBLIOTECA</span>
          <i className="bi bi-plus-lg cursor-pointer"></i>
        </div>
        
        {/* Mock de álbuns salvos */}
        {['Favoritos', 'Ouvir Depois', 'Rock 80s'].map(item => (
          <div key={item} style={styles.navItem} className="cursor-pointer hover-white">
            <div style={{ width: '40px', height: '40px', backgroundColor: '#2b1055', borderRadius: '4px' }}></div>
            <span className="text-truncate">{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;