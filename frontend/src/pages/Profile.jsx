import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  const [currentPassword, setCurrentPassword] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ESTADOS DA SIDEBAR RESPONSIVA
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 992;
      setIsMobile(mobileView);
      if (!mobileView) setIsSidebarOpen(true); 
      if (mobileView && isSidebarOpen) setIsSidebarOpen(false); 
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    async function loadUserData() {
      try {
        const storedUser = localStorage.getItem('@MusicReview:user') || sessionStorage.getItem('@MusicReview:user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setName(user.name);
          setEmail(user.email);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const payload = { name, email, currentPassword };
      if (newPassword.trim() !== '') {
        payload.newPassword = newPassword;
      }

      const response = await api.put('/users/profile', payload);
      const storage = localStorage.getItem('@MusicReview:user') ? localStorage : sessionStorage;
      storage.setItem('@MusicReview:user', JSON.stringify(response.data));

      alert('Perfil atualizado com sucesso!');
      setNewPassword('');
      setCurrentPassword('');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erro ao atualizar perfil.');
    } finally {
      setUpdating(false);
    }
  };

  const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: 'white', overflowX: 'hidden' },
    main: { 
      marginLeft: !isMobile && isSidebarOpen ? '260px' : '0', 
      transition: 'margin-left 0.3s ease-in-out',
      paddingTop: '100px', 
      paddingRight: isMobile ? '15px' : '40px', 
      paddingLeft: isMobile ? '15px' : '40px', 
      paddingBottom: '40px' 
    },
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: isMobile ? '20px' : '30px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    input: {
      backgroundColor: '#121212',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '20px'
    },
    btnSave: {
      backgroundColor: '#a855f7',
      border: 'none',
      borderRadius: '8px',
      padding: '12px',
      fontWeight: 'bold',
      width: '100%',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobile} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />

      <main style={styles.main}>
        <header className="mb-5 text-center text-lg-start">
          <h1 className="display-5 fw-bold text-center">Seu <span style={{ color: '#a855f7' }}>Perfil</span></h1>
        </header>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#a855f7' }} role="status"></div>
          </div>
        ) : (
          <div style={styles.card}>
            <form onSubmit={handleUpdateProfile}>
              <label className="form-label small fw-bold text-secondary">NOME COMPLETO</label>
              <input type="text" className="form-control" style={styles.input} required
                value={name} onChange={e => setName(e.target.value)} />

              <label className="form-label small fw-bold text-secondary">E-MAIL</label>
              <input type="email" className="form-control" style={styles.input} required
                value={email} onChange={e => setEmail(e.target.value)} />

              <hr className="my-4 opacity-25" />

              <label style={{ color: '#a855f7' }} className="form-label small fw-bold">NOVA SENHA (OPCIONAL)</label>
              <input type="password" placeholder="Deixe em branco para não alterar" className="form-control" style={styles.input}
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />

              <label className="form-label small fw-bold" style={{ color: '#a855f7' }}>SENHA ATUAL (OBRIGATÓRIO)</label>
              <input type="password" placeholder="Digite sua senha para confirmar" className="form-control" 
                style={{ ...styles.input, marginBottom: 0 }} required
                value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />

              <button type="submit" className="btn btn-primary" style={styles.btnSave} disabled={updating}>
                {updating ? 'Processando...' : 'Salvar Alterações'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;