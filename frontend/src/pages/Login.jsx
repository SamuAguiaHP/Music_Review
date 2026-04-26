import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importa a nossa config

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      const response = await api.post('/login', { email, password });
      
      // Se chegamos aqui, o login foi um sucesso!
      const { token, user } = response.data;

      // Guardamos o "Crachá" (Token) e o nome do utilizador
      localStorage.setItem('@MusicReview:token', token);
      localStorage.setItem('@MusicReview:user', JSON.stringify(user));

      alert(`Bem-vindo, ${user.name}!`);
      navigate('/'); // Redireciona para a Home
      
    } catch (err) {
      // Se o backend devolver erro (401, 500, etc)
      setError(err.response?.data?.error || 'Erro ao ligar ao servidor');
    }
  };

  return (
    /* FUNDO TOTAL: Ocupa toda a tela e centraliza o conteúdo interno (o container) */
    <div className="vw-100 min-vh-100 m-0 p-0 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(to bottom, #2b164d 0%, #0d0614 100%)', overflowX: 'hidden' }}>
      
      {/* CONTAINER: A grande "mágica" aqui. Ele impede que os itens se afastem infinitamente em telas grandes. */}
      <div className="container">
        
        {/* ROW: g-4/g-lg-5 cria um espaçamento amigável entre os lados, e o justify-content-center junta os dois no meio */}
        <div className="row align-items-center justify-content-center gy-5 gx-lg-5">
          
          {/* LADO DA MARCA: Reduzido de col-lg-6 para col-lg-5 para ficarem mais próximos do centro */}
          <div className="col-12 col-lg-5 d-flex flex-column justify-content-center align-items-center position-relative mb-5 pb-4 mb-lg-0 pb-lg-0">
            
            <div className="position-absolute top-50 start-50 translate-middle opacity-10 pointer-events-none" 
                 style={{ fontSize: 'clamp(8rem, 15vw, 15rem)', zIndex: 0 }}>
              🎵
            </div>
            
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <h1 className="display-4 fw-bold mb-2" style={{ color: '#c084fc', textShadow: '0 0 20px rgba(192,132,252,0.3)' }}>
                MusicReview
              </h1>
              <p className="lead text-white-50 d-none d-lg-block">Sua jornada musical começa aqui.</p>
            </div>
          </div>

          {/* LADO DO FORMULÁRIO: Também col-lg-5 para manter simetria */}
          <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
            
            <div className="p-4 p-md-5 shadow-lg w-100" 
                 style={{ 
                   maxWidth: '420px', 
                   backgroundColor: 'rgba(0, 0, 0, 0.25)', 
                   backdropFilter: 'blur(12px)',
                   WebkitBackdropFilter: 'blur(12px)', /* Suporte para Safari */
                   borderRadius: '24px'
                 }}>
              
              <h2 className="fw-bold mb-2 text-white">Bem-vindo de volta</h2>
              <p className="mb-4 small text-white-50">Por favor, insira seus dados para entrar.</p>

              <form onSubmit={handleLogin}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-white-50">E-mail</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg shadow-none text-white" 
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ 
                      borderRadius: '10px', 
                      fontSize: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase text-white-50">Senha</label>
                  <input 
                    type="password" 
                    className="form-control form-control-lg shadow-none text-white" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                      borderRadius: '10px', 
                      fontSize: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input bg-dark border-secondary shadow-none" type="checkbox" id="remember" />
                    <label className="form-check-label small text-white-50" htmlFor="remember">Lembrar de mim</label>
                  </div>
                  <a href="#" className="small text-decoration-none fw-bold" style={{ color: '#c084fc' }}>Esqueceu a senha?</a>
                </div>

                <button type="submit" className="btn btn-lg w-100 fw-bold shadow-sm text-white" 
                        style={{ background: '#a855f7', borderRadius: '12px', padding: '14px', border: 'none' }}>
                  Entrar
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top border-secondary">
                <span className="text-white-50 small">Não tem uma conta? </span>
                <a href="/register" className="text-decoration-none fw-bold" style={{ color: '#c084fc' }}>Crie uma agora</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;