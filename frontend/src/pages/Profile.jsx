import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Senha que ele quer mudar
  const [currentPassword, setCurrentPassword] = useState(''); // Senha para validar
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: 'white' },
    main: { marginLeft: '260px', paddingTop: '100px', padding: '100px 40px 40px' },
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '30px',
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
      marginBottom: '15px'
    },
    btnSave: {
      backgroundColor: '#2b1055',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      padding: '12px',
      width: '100%',
      marginTop: '10px'
    }
  };

  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await api.get('/users/profile');
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao carregar dados do perfil.');
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Enviamos currentPassword para validação e password (a nova) caso ele queira mudar
      const response = await api.put('/users/profile', { 
        name, 
        email, 
        password: newPassword, 
        currentPassword 
      });
      
      // Atualiza o storage com os novos dados (exceto a senha que o back não envia)
      if (localStorage.getItem('@MusicReview:user')) {
        localStorage.setItem('@MusicReview:user', JSON.stringify(response.data));
      } else {
        sessionStorage.setItem('@MusicReview:user', JSON.stringify(response.data));
      }

      alert('Perfil atualizado com sucesso!');
      setNewPassword('');
      setCurrentPassword('');
      
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao atualizar perfil.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={styles.container}><Header /><Sidebar /></div>;

  return (
    <div style={styles.container}>
      <Header />
      <Sidebar />

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 className="fw-bold mb-4 text-center">Editar Perfil</h2>
          <form onSubmit={handleUpdate}>
            
            <label className="form-label small fw-bold text-secondary">NOME COMPLETO</label>
            <input type="text" className="form-control" style={styles.input} required
              value={name} onChange={e => setName(e.target.value)} />

            <label className="form-label small fw-bold text-secondary">E-MAIL</label>
            <input type="email" className="form-control" style={styles.input} required
              value={email} onChange={e => setEmail(e.target.value)} />

            <hr className="my-4 opacity-25" />

            <label style={{ color: 'rgb(136, 66, 248)' }} className="form-label small fw-bold">NOVA SENHA (OPCIONAL)</label>
            <input type="password" placeholder="Deixe em branco para não alterar" className="form-control" style={styles.input}
              value={newPassword} onChange={e => setNewPassword(e.target.value)} />

            <label className="form-label small fw-bold" style={{ color: 'rgb(127, 48, 255)' }}>SENHA ATUAL (OBRIGATÓRIO)</label>
            <input type="password" placeholder="Digite sua senha para confirmar" className="form-control" 
              style={{ ...styles.input, marginBottom: 0 }} required
              value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={styles.btnSave} disabled={updating}>
              {updating ? 'Processando...' : 'Confirmar Alterações'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;