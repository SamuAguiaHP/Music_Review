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
      
      // Recarrega as avaliações após o envio para exibir instantaneamente
      const reviewsRes = await api.get(`/reviews?album_id=${id}`);
      setReviews(reviewsRes.data.reviews || []);
      setAverage(reviewsRes.data.average || 0);
    } catch (err) {
      console.error("Erro ao enviar review:", err);
      alert("Erro ao enviar review. Você já está logado?");
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <Header />
        <Sidebar />
        <main style={{ marginLeft: '260px', paddingTop: '100px', padding: '40px' }}>
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#a855f7' }} role="status"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!album) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <Header />
        <Sidebar />
        <main style={{ marginLeft: '260px', paddingTop: '100px', padding: '40px' }}>
          <div className="text-center py-5 text-secondary">Item não encontrado.</div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Header />
      <Sidebar />
      
      <main style={{ marginLeft: '260px', paddingTop: '100px', paddingRight: '40px', paddingLeft: '40px', paddingBottom: '40px' }}>
        
        <button className="btn btn-outline-light mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Voltar
        </button>

        {/* Bloco de exibição Normalizado */}
        <div className="d-flex align-items-center mb-5 bg-dark p-4" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          
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

          <div className="ms-4">
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {rev.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold" style={{ color: '#a855f7' }}>{rev.user?.name}</span>
                    </div>
                    <div className="text-warning">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <i key={i} className="bi bi-star-fill small ms-1"></i>
                      ))}
                    </div>
                  </div>
                  <p className="mb-1 text-white">{rev.comment}</p>
                  <small className="text-muted">{new Date(rev.created_at).toLocaleDateString()}</small>
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