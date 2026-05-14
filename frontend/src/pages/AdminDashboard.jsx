import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Estados para criação de novo Admin
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [createLoading, setCreateLoading] = useState(false);

  const navigate = useNavigate();

  // Estilos seguindo o padrão da sua Sidebar
  const styles = {
    container: {
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: 'white',
    },
    main: {
      marginLeft: '260px',
      padding: '100px 40px 40px',
    },
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      marginBottom: '20px'
    },
    input: {
      backgroundColor: '#121212',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white',
      borderRadius: '8px',
      padding: '12px'
    },
    btnPrimary: {
      backgroundColor: '#2b1055', // Roxo do seu padrão
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      padding: '10px 20px'
    }
  };

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/');
        } else {
          setError('Erro ao carregar a lista de usuários.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [navigate, refreshTrigger]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      // Enviando isAdmin: true como solicitado
      await api.post('/users', { ...newAdmin, isAdmin: true });
      
      alert('Novo administrador cadastrado com sucesso!');
      setNewAdmin({ name: '', email: '', password: '' });
      setRefreshTrigger(prev => prev + 1);

      const modalElement = document.getElementById('createAdminModal');
      const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]');
      closeBtn?.click();

    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar administrador.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Tens a certeza que desejas excluir permanentemente a conta de ${userName}?`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao excluir usuário.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <Sidebar />

      <main style={styles.main}>
        {/* Cabeçalho do Painel */}
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold m-0 text-white">Gestão de Contas</h2>
            <p className="text-secondary m-0">Administra os utilizadores e permissões do sistema</p>
          </div>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2" 
            style={styles.btnPrimary}
            data-bs-toggle="modal" 
            data-bs-target="#createAdminModal"
          >
            <i className="bi bi-person-plus-fill"></i> Novo Admin
          </button>
        </div>

        {/* Tabela de Utilizadores */}
        <div style={styles.card}>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-light"></div></div>
          ) : error ? (
            <div className="alert alert-danger bg-danger text-white border-0">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead>
                  <tr className="text-secondary" style={{ fontSize: '0.85rem' }}>
                    <th className="border-0 pb-3">NOME</th>
                    <th className="border-0 pb-3">E-MAIL</th>
                    <th className="border-0 pb-3">CARGO</th>
                    <th className="border-0 pb-3 text-end">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ verticalAlign: 'middle' }}>
                      <td className="border-0 py-3 fw-bold">{user.name}</td>
                      <td className="border-0 py-3 text-secondary">{user.email}</td>
                      <td className="border-0 py-3">
                        <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'} opacity-75`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="border-0 py-3 text-end">
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="btn btn-sm btn-outline-danger border-0"
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Modal de Criação de Admin */}
        <div className="modal fade" id="createAdminModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ ...styles.card, border: '1px solid #333', padding: '10px' }}>
              <div className="modal-header border-0">
                <h5 style={{ color: 'white' }} className="modal-title fw-bold">Criar Administrador</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <form onSubmit={handleCreateAdmin}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">NOME COMPLETO</label>
                    <input 
                      type="text" className="form-control" style={styles.input} required
                      value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">E-MAIL</label>
                    <input 
                      type="email" className="form-control" style={styles.input} required
                      value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">SENHA TEMPORÁRIA</label>
                    <input 
                      type="password" className="form-control" style={styles.input} required
                      value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-link text-white text-decoration-none" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={styles.btnPrimary} disabled={createLoading}>
                    {createLoading ? 'A guardar...' : 'Confirmar Registro'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;