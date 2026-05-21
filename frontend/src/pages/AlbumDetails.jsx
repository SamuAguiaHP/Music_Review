import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function AlbumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItemDetails() {
      try {
        setLoading(true);
        // Garantimos que bate na rota que você manteve configurada no routes do backend
        const response = await api.get(`/api/spotify/albums/${id}`);
        setAlbum(response.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadItemDetails();
  }, [id]);

  // Função para formatar milissegundos para minutos:segundos (ex: 3:45)
  const formatDuration = (ms) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

  const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: 'white' },
    main: { marginLeft: '260px', paddingTop: '100px', padding: '40px' },
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    btnPrimary: {
      backgroundColor: '#2b1055',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      padding: '8px 16px',
    },
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Header />
      <Sidebar />

      <main style={{ marginLeft: '260px', paddingTop: '100px', paddingRight: '40px', paddingLeft: '40px', paddingBottom: '40px' }}>

        <button className="btn btn-outline-light mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Voltar
        </button>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#a855f7' }} role="status"></div>
          </div>
        ) : !album ? (
          <div className="text-center py-5 text-secondary">Item não encontrado.</div>
        ) : (
          <>
            {/* Cabeçalho do Item Normalizado */}
            <div className="d-flex align-items-end mb-5">
              <img
                src={album.cover_url || "https://placehold.co/300x300/1e1e1e/ffffff?text=Sem+Capa"}
                alt={album.name}
                style={{ width: '230px', height: '230px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
              />
              <div className="ms-4">
                <span className="text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px', color: album.type === 'track' ? '#0dcaf0' : '#a855f7' }}>
                  {album.type === 'track' ? 'Música' : 'Álbum'}
                </span>
                <h1 className="display-3 fw-bold mb-3 text-truncate" style={{ lineHeight: '1.2', maxWidth: '800px' }}>
                  {album.name}
                </h1>
                <div className="d-flex align-items-center flex-wrap">
                  <span className="fw-bold">{album.artists?.map(a => a.name).join(', ')}</span>
                  <span className="mx-2">•</span>
                  <span className="text-secondary">{album.release_date?.substring(0, 4)}</span>
                  <span className="mx-2">•</span>
                  <span className="text-secondary">{album.total_tracks} {album.total_tracks === 1 ? 'música' : 'músicas'}</span>
                  
                  <Link to={`/review/${album.id}`} className="btn btn-primary btn-sm ms-md-3 mt-2 mt-md-0" style={styles.btnPrimary}>
                    <i className="bi bi-chat-left-text-fill me-2"></i> Ver Avaliações
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabela de Músicas Normalizada */}
            <div className="table-responsive">
              <table className="table table-dark table-hover" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ width: '50px', backgroundColor: 'transparent', color: '#b3b3b3' }}>#</th>
                    <th style={{ backgroundColor: 'transparent', color: '#b3b3b3' }}>Título</th>
                    <th style={{ textAlign: 'right', backgroundColor: 'transparent', color: '#b3b3b3' }}>
                      <i className="bi bi-clock"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {album.tracks?.map((track, index) => (
                    <tr 
                      key={track.id_spotify}
                      onClick={() => {
                        if (id === track.id_spotify) return;
                        navigate(`/album/${track.id_spotify}`);
                      }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ backgroundColor: 'transparent', color: '#b3b3b3', verticalAlign: 'middle' }}>
                        {track.track_number || index + 1}
                      </td>
                      <td style={{ backgroundColor: 'transparent', verticalAlign: 'middle' }}>
                        <div className="fw-bold text-white">{track.name}</div>
                        <div className="small text-secondary">{track.artists?.map(a => a.name).join(', ')}</div>
                      </td>
                      <td style={{ backgroundColor: 'transparent', color: '#b3b3b3', verticalAlign: 'middle', textAlign: 'right' }}>
                        {formatDuration(track.duration_ms)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AlbumDetails;