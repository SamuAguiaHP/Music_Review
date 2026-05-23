import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('@MusicReview:user') || sessionStorage.getItem('@MusicReview:user');
  const loggedUser = storedUser ? JSON.parse(storedUser) : {};
  const user_id = loggedUser.id;

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
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Busca os detalhes do item normalizado (Música ou Álbum)
        const albumRes = await api.get(`/api/spotify/albums/${id}`);
        setAlbum(albumRes.data);

        // 2. Busca as avaliações no seu banco de dados
        const reviewsRes = await api.get(`/reviews?album_id=${id}`);
        setReviews(reviewsRes.data.reviews || []);
        setAverage(reviewsRes.data.average || 0);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  // Dentro do seu componente React
  const handleDeleteReview = async (reviewId) => {
    // Uma boa prática de UX é pedir confirmação antes de ações destrutivas
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta avaliação?");
    
    if (!confirmDelete) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      alert("Avaliação excluída com sucesso!");
      setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewId));
      
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert(error.response?.data?.error || "Erro ao excluir a avaliação.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Escreva um comentário!");
      return;
    }
    try {
      await api.post('/reviews', {
        album_id: id,
        rating,
        comment
      });
      setComment('');
      setRating(5);
      alert("Avaliação enviada com sucesso!");
      // Recarrega as avaliações após o envio para exibir instantaneamente
      const reviewsRes = await api.get(`/reviews?album_id=${id}`);
      setReviews(reviewsRes.data.reviews || []);
      setAverage(reviewsRes.data.average || 0);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Sua sessão expirou! Por favor, faça login novamente.");
        navigate('/login');
      } else {
        alert("Erro ao publicar avaliação. Tente novamente.");
      }
    }
  };

  const styles = {
    main: { 
      marginLeft: !isMobile && isSidebarOpen ? '260px' : '0', 
      transition: 'margin-left 0.3s ease-in-out',
      paddingTop: '100px', 
      paddingRight: isMobile ? '15px' : '40px', 
      paddingLeft: isMobile ? '15px' : '40px', 
      paddingBottom: '40px' 
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} closeSidebar={() => setIsSidebarOpen(false)} />
        <main style={styles.main} className="text-center py-5">
          <div className="spinner-border" style={{ color: '#a855f7' }} role="status"></div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobile} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />
      
      <main style={styles.main}>
        <button className="btn btn-outline-light mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Voltar
        </button>

        {/* Bloco de exibição Normalizado */}
        <div className={`d-flex ${isMobile ? 'flex-column text-center align-items-center' : 'align-items-center'} mb-5 bg-dark p-4`} style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          
          {/* Capa Clicável */}
          <img
            src={album.cover_url || "https://placehold.co/300x300/1e1e1e/ffffff?text=Sem+Capa"}
            alt={album.name}
            onClick={() => navigate(`/album/${album.id}`)}
            className="img-fluid shadow"
            style={{ 
              width: '150px', 
              height: '150px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          <div className={isMobile ? 'mt-3' : 'ms-4'}>
            <span className="text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: album.type === 'track' ? '#0dcaf0' : '#a855f7' }}>
              Avaliação de {album.type === 'track' ? 'Música' : 'Álbum'}
            </span>
            <h2 className="fw-bold text-white mb-2">{album.name}</h2>
            <p className="text-secondary mb-0">
              {album.artists?.map(a => a.name).join(', ') || 'Artista Desconhecido'}
            </p>
            <div className="mt-2">
              <span className="badge bg-secondary me-2">Média: {Number(average).toFixed(1)} <i className="bi bi-star-fill text-warning"></i></span>
              <span className="text-secondary small">{reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}</span>
            </div>
          </div>
        </div>

        {/* Zona das Reviews (Formulário e Lista) */}
        <div className="row">
          <div className="col-md-5 mb-4">
            <div className="card bg-dark border-secondary p-4" style={{ borderRadius: '12px' }}>
              <h5 className="mb-4 text-white">Deixe a sua avaliação</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary">Nota</label>
                  <select 
                    className="form-select bg-dark text-white border-secondary" 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="5">5 - Obra-prima</option>
                    <option value="4">4 - Muito bom</option>
                    <option value="3">3 - Bom</option>
                    <option value="2">2 - Regular</option>
                    <option value="1">1 - Ruim</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary">Comentário</label>
                  <textarea 
                    className="form-control bg-dark text-white border-secondary" 
                    rows="4" 
                    placeholder="O que achou deste lançamento?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn w-100" style={{ backgroundColor: '#a855f7', color: 'white', fontWeight: 'bold' }}>
                  Publicar Avaliação
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
          <h5 className="mb-4 text-white">Avaliações da Comunidade</h5>
          {reviews.length === 0 ? (
            <div className="p-4 text-center bg-dark rounded border border-secondary text-secondary">
              Ninguém avaliou este item ainda. Seja o primeiro!
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="card bg-dark border-secondary mb-3 p-3" style={{ borderRadius: '12px' }}>
                
                {/* CABEÇALHO DA REVIEW AJUSTADO COM ELEMENTOS FLUTUANDO NAS EXTREMIDADES */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  
                  {/* Lado Esquerdo: Info do Usuário */}
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                      {rev.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="d-flex flex-column">
                      <span className="fw-bold" style={{ color: '#a855f7' }}>{rev.user?.name}</span>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {new Date(rev.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  
                  {/* Lado Direito: Estrelas + Botão de Excluir */}
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-warning">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <i key={i} className="bi bi-star-fill small ms-1"></i>
                      ))}
                    </div>

                    {/* BOTÃO DE EXCLUSÃO CONDICIONAL */}
                    {/* O botão só renderiza se o ID do dono da review bater com o ID do usuário logado */}
                    {rev.user_id === user_id && (
                      <button
                        className="btn btn-sm btn-link p-0 text-secondary"
                        onClick={() => handleDeleteReview(rev.id)}
                        style={{ 
                          transition: 'color 0.2s ease', 
                          outline: 'none', 
                          boxShadow: 'none' 
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#6c757d')}
                        title="Excluir Avaliação"
                      >
                        <i className="bi bi-trash-fill fs-6"></i>
                      </button>
                    )}
                  </div>

                </div>

                {/* CORPO DO COMENTÁRIO */}
                <p className="mb-0 mt-2 text-white" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {rev.comment}
                </p>

              </div>
            ))
          )}
        </div>
        </div>
      </main>
    </div>
  );
}

export default ReviewPage;