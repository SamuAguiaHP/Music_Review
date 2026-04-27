import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Captura o e-mail que veio no link do Mailtrap
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    // Validações de segurança
    if (!newPassword || !confirmPassword) return setError('Por favor, preencha todos os campos.');
    if (newPassword !== confirmPassword) return setError('As senhas não coincidem!');
    if (newPassword.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (!email) return setError('Link inválido ou expirado. Tente solicitar a recuperação novamente.');

    setLoading(true);
    try {
      await api.post('/reset-password', { email, newPassword });
      
      alert('Sua senha foi redefinida com sucesso!');
      navigate('/login'); // Manda de volta para o login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ocorreu um erro ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: '#121212' }}>
      <div className="row g-0 min-vh-100">
        
        {/* LADO ESQUERDO: Imagem/Brand */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-5 position-relative mb-5 mb-lg-0 pb-4 pb-lg-0" 
             style={{ 
               background: 'linear-gradient(45deg, #121212 0%, #2b1055 100%)',
               borderRight: '1px solid rgba(168, 85, 247, 0.2)' 
             }}>
          <div className="position-absolute top-50 start-50 translate-middle opacity-25" style={{ fontSize: '15rem' }}>🎵</div>
          <h1 className="display-3 fw-bold position-relative z-1 text-center">Novo começo.</h1>
          <p className="fs-5 text-secondary position-relative z-1 text-center mt-3" style={{ maxWidth: '400px' }}>
            Crie uma senha forte e segura para proteger a sua coleção de músicas e reviews.
          </p>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center pb-5 pb-lg-0">
          <div className="w-100" style={{ maxWidth: '450px', padding: '20px' }}>
            
            <div className="text-center mb-5">
              <h2 className="fw-bold text-white mb-2">Criar Nova Senha</h2>
              <p className="text-secondary">Para a conta: <strong className="text-white">{email}</strong></p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 border-0" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleReset}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">NOVA SENHA</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-dark text-white border-secondary shadow-none" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">CONFIRMAR NOVA SENHA</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-dark text-white border-secondary shadow-none" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-lg w-100 text-white fw-bold shadow"
                style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </button>

                <div className="text-center mt-4">
                    <Link to="/login" className="text-decoration-none fw-bold text-secondary text-hover-white">
                        <i className="bi bi-arrow-left me-2"></i>Voltar para o Login
                    </Link>
                </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;