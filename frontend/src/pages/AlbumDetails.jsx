import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function AlbumDetails() {
  const { id } = useParams(); // Pega o id_spotify da URL
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlbumDetails() {
      try {
        // Usamos aquela rota que criámos no passo anterior para buscar tudo!
        const response = await api.get(`/api/spotify/albums/${id}`);
        setAlbum(response.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes do álbum:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbumDetails();
  }, [id]);

  // Função para formatar milissegundos para minutos:segundos (ex: 3:45)
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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
          <div className="text-center py-5 text-secondary">Álbum não encontrado.</div>
        ) : (
          <>
            {/* Cabeçalho do Álbum */}
            <div className="d-flex align-items-end mb-5">
              <img 
                src={album.images?.[0]?.url || "https://via.placeholder.com/300"} 
                alt={album.name} 
                style={{ width: '230px', height: '230px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} 
              />
              <div className="ms-4">
                <span className="text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Álbum</span>
                <h1 className="display-3 fw-bold mb-3" style={{ lineHeight: '1.2' }}>{album.name}</h1>
                <div className="d-flex align-items-center">
                  <span className="fw-bold">{album.artists?.[0]?.name}</span>
                  <span className="mx-2">•</span>
                  <span className="text-secondary">{album.release_date?.substring(0, 4)}</span>
                  <span className="mx-2">•</span>
                  <span className="text-secondary">{album.total_tracks} músicas</span>
                </div>
              </div>
            </div>

            {/* Lista de Músicas */}
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
                  {album.tracks?.items.map((track, index) => (
                    <tr key={track.id} style={{ borderBottom: 'none' }}>
                      <td style={{ backgroundColor: 'transparent', color: '#b3b3b3', verticalAlign: 'middle' }}>
                        {index + 1}
                      </td>
                      <td style={{ backgroundColor: 'transparent', verticalAlign: 'middle' }}>
                        <div className="fw-bold text-white">{track.name}</div>
                        <div className="small text-secondary">{track.artists.map(a => a.name).join(', ')}</div>
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