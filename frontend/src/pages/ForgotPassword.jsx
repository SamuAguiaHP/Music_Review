import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      return setError('Por favor, informe seu e-mail.');
    }

    setLoading(true);
    try {
      // Dispara para a futura rota do Back-end que enviará o e-mail
      await api.post('/forgot-password', { email });
      setMessage('Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.');
      setEmail(''); // Limpa o campo após o sucesso
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao tentar enviar o e-mail. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: '#121212' }}>
      
      <div className="row g-0 min-vh-100">
        
        {/* LADO ESQUERDO: Imagem/Brand (Empilhado no topo no mobile) */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-5 position-relative mb-5 mb-lg-0 pb-4 pb-lg-0" 
             style={{ 
               background: 'linear-gradient(45deg, #121212 0%, #2b1055 100%)',
               borderRight: '1px solid rgba(168, 85, 247, 0.2)' 
             }}>
          <div className="position-absolute top-50 start-50 translate-middle opacity-25" style={{ fontSize: '15rem' }}>🎵</div>
          <h1 className="display-3 fw-bold position-relative z-1 text-center">Não se preocupe.</h1>
          <p className="fs-5 text-secondary position-relative z-1 text-center mt-3" style={{ maxWidth: '400px' }}>
            Acontece com os melhores. Vamos ajudar você a recuperar o acesso à sua conta.
          </p>
        </div>

        {/* LADO DIREITO: Formulário de Recuperação */}
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center pb-5 pb-lg-0">
          <div className="w-100" style={{ maxWidth: '450px', padding: '20px' }}>
            
            <div className="text-center mb-5">
              <h2 className="fw-bold text-white mb-2">Recuperar Senha</h2>
              <p className="text-secondary">Digite o e-mail associado à sua conta</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 border-0" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }} role="alert">
                {error}
              </div>
            )}

            {message && (
              <div className="alert alert-success py-2 border-0" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }} role="alert">
                {message}
              </div>
            )}

            <form onSubmit={handleRecover}>
              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">E-MAIL</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-dark text-white border-secondary shadow-none" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-lg w-100 text-white fw-bold mb-3 shadow"
                style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
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

export default ForgotPassword;