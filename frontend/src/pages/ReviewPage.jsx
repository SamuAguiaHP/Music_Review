import React, { useState, useCallback } from 'react';
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

  const loadData = useCallback(async () => {
    try {
      // 1. Busca detalhes do álbum para exibir a capa/título
      const albumRes = await api.get(`/api/spotify/albums/${id}`);
      setAlbum(albumRes.data);

      // 2. Busca as avaliações
      const reviewsRes = await api.get(`/reviews?album_id=${id}`);
      setReviews(reviewsRes.data.reviews || []);
      setAverage(reviewsRes.data.average || 0);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        rating,
        comment,
        album_id: id
      });
      setComment('');
      loadData();
      alert("Avaliação enviada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avaliação.");
    }
  };

  if (loading) return <div className="text-white p-5">Carregando...</div>;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Header />
      <Sidebar />

      <main style={{ marginLeft: '260px', paddingTop: '100px', padding: '100px 40px' }}>
        <button className="btn btn-outline-light mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>

        <div className="row">
          {/* COLUNA ESQUERDA: Info do Álbum e Formulário */}
          <div className="col-lg-4 mb-5">
            <div className="card bg-dark border-secondary p-4 text-center">
              <img 
                src={album?.images?.[0]?.url} 
                alt={album?.name} 
                className="img-fluid rounded shadow mb-3" 
                style={{ maxWidth: '250px' }}
              />
              <h3 className="fw-bold">{album?.name}</h3>
              <p className="text-secondary">{album?.artists?.[0]?.name}</p>
              <div className="badge bg-primary mb-4" style={{ backgroundColor: '#a855f7' }}>
                Média: {Number(average).toFixed(1)} ★
              </div>

              <form onSubmit={handleSubmit} className="text-start mt-3">
                <label className="form-label text-secondary small text-uppercase fw-bold">Sua Nota</label>
                <div className="mb-3 d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`bi bi-star${star <= rating ? '-fill' : ''}`}
                      style={{ cursor: 'pointer', color: '#f39c12', fontSize: '1.5rem' }}
                      onClick={() => setRating(star)}
                    ></i>
                  ))}
                </div>

                <label className="form-label text-secondary small text-uppercase fw-bold">Seu Comentário</label>
                <textarea 
                  className="form-control bg-dark text-white border-secondary mb-3"
                  rows="4"
                  placeholder="O que achou deste disco?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button type="submit" className="btn btn-primary w-100 fw-bold" style={{ backgroundColor: '#a855f7', border: 'none' }}>
                  Publicar Avaliação
                </button>
              </form>
            </div>
          </div>

          {/* COLUNA DIREITA: Feed de Avaliações */}
          <div className="col-lg-8">
            <h4 className="fw-bold mb-4">Avaliações da Comunidade</h4>
            {reviews.length === 0 ? (
              <div className="p-5 text-center bg-dark rounded border border-secondary text-secondary">
                Ninguém avaliou este álbum ainda. Seja o primeiro!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="card bg-dark border-secondary mb-3 p-3">
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
                  <p className="mb-1">{rev.comment}</p>
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