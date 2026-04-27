import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      return setError('Por favor, preencha todos os campos.');
    }
    if (password !== confirmPassword) {
      return setError('As senhas não coincidem!');
    }
    if (password.length < 6) {
      return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    setLoading(true);
    try {
      await api.post('/register', { name, email, password });
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao criar conta. O e-mail já pode estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Alterado para min-vh-100 para permitir scroll no mobile sem cortar a tela
    <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: '#121212' }}>
      
      {/* Adicionado a Row do Bootstrap para empilhar os elementos no mobile */}
      <div className="row g-0 min-vh-100">
        
        {/* LADO ESQUERDO: Imagem/Brand (Agora visível no mobile e empilhado no topo) */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-5 position-relative mb-5 mb-lg-0 pb-4 pb-lg-0" 
             style={{ 
               background: 'linear-gradient(45deg, #121212 0%, #2b1055 100%)',
               borderRight: '1px solid rgba(168, 85, 247, 0.2)' 
             }}>
          <div className="position-absolute top-50 start-50 translate-middle opacity-25" style={{ fontSize: '15rem' }}>🎵</div>
          <h1 className="display-3 fw-bold position-relative z-1 text-center">Junte-se a nós.</h1>
          <p className="fs-5 text-secondary position-relative z-1 text-center mt-3" style={{ maxWidth: '400px' }}>
            Crie sua conta, salve seus álbuns favoritos e compartilhe suas reviews com o mundo.
          </p>
        </div>

        {/* LADO DIREITO: Formulário de Cadastro */}
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center pb-5 pb-lg-0">
          <div className="w-100" style={{ maxWidth: '450px', padding: '20px' }}>
            
            <div className="text-center mb-5">
              <h2 className="fw-bold text-white mb-2">Criar Conta</h2>
              <p className="text-secondary">Preencha seus dados para começar</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 border-0" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">NOME COMPLETO</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-dark text-white border-secondary shadow-none" 
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">E-MAIL</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-dark text-white border-secondary shadow-none" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">SENHA</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-dark text-white border-secondary shadow-none" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">CONFIRMAR SENHA</label>
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
                className="btn btn-lg w-100 text-white fw-bold mb-3 shadow"
                style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </button>

              <div className="text-center mt-4">
                <p className="text-secondary">
                  Já possui uma conta? <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#a855f7' }}>Faça login aqui</Link>
                </p>
              </div>
            </form>

          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Register;