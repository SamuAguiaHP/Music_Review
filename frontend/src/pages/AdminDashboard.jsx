import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/admin/users'); // Busca a nossa nova rota!
        setUsers(response.data);
      } catch (err) {
        // Se der erro (ex: não for admin), manda de volta pra Home
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/');
        } else {
          setError('Erro ao carregar a lista de usuários.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId, userName) => {
    // Alerta de confirmação nativo do navegador
    if (window.confirm(`Tem certeza que deseja excluir permanentemente a conta de ${userName}? Essa ação não pode ser desfeita.`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        
        // Remove o usuário da tabela instantaneamente sem precisar recarregar a página
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao excluir usuário.');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Header />
      <Sidebar />

      <main style={{ marginLeft: '260px', paddingTop: '100px', paddingRight: '40px', paddingLeft: '40px', paddingBottom: '40px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold"><i className="bi bi-shield-lock-fill text-warning me-2"></i> Painel Administrativo</h2>
          <span className="badge bg-secondary p-2">Total de Usuários: {users.length}</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive rounded shadow-sm">
            <table className="table table-dark table-hover mb-0" style={{ backgroundColor: '#181818' }}>
              <thead style={{ borderBottom: '2px solid #333' }}>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cargo</th>
                  <th>Data de Cadastro</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ verticalAlign: 'middle' }}>
                    <td className="fw-bold">{user.name}</td>
                    <td className="text-secondary">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-secondary">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" title="Excluir usuário" onClick={() => handleDeleteUser(user.id, user.name)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;