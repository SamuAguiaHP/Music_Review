import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReviewPage from '../pages/ReviewPage';

// 1. Recebemos a função onRemove do pai (Home)
function AlbumCard({ album, isLibrary = false, onRemove }) {
  
  const [isSaved, setIsSaved] = useState(isLibrary);
  const navigate = useNavigate();
  const spotifyId = album.id_spotify || album.id;

  const handleToggleAlbum = async (e) => {
    e.stopPropagation();
    try {
      if (isSaved) {
        // REMOVER
        await api.delete(`/albums/${album.id_spotify}`);
        setIsSaved(false); 
        alert(`Álbum "${album.title}" removido da sua biblioteca!`);
        
        // 2. SE ESTIVERMOS NA BIBLIOTECA, MANDAMOS A HOME SUMIR COM ELE DA TELA!
        if (isLibrary && onRemove) {
          onRemove(album.id_spotify);
        }

      } else {
        // 1. Buscamos o álbum COMPLETO no nosso Back-end
        const spotifyResponse = await api.get(`/api/spotify/albums/${album.id_spotify}`);
        const fullAlbumData = spotifyResponse.data;

        // 2. Extraímos a lista de músicas
        const rawTracks = fullAlbumData.tracks?.items || [];

        // 3. Formatamos para o Prisma
        const formattedTracks = rawTracks.map(track => ({
          id_spotify: track.id,
          title: track.name,
          track_number: track.track_number || 1,
          duration: track.duration_ms || 0,
        }));

        // 4. Enviamos para a nossa rota de salvar Álbuns
        await api.post('/albums', {
          id_spotify: album.id_spotify,
          title: album.title,
          artist: album.artist, 
          cover_url: album.cover_url,
          tracks: formattedTracks 
        });
        
        setIsSaved(true);
        alert(`Álbum "${album.title}" e suas músicas salvos com sucesso!`);
      }
    } catch (error) {
      // 3. CAPTURAMOS O ERRO 409 (JÁ EXISTE) AQUI!
      if (error.response && error.response.status === 409) {
        alert('Este álbum já existe na sua biblioteca!');
        setIsSaved(true); // Se já existe, forçamos o botão a virar '-'
      } else {
        console.error(error);
        alert('Erro ao processar a ação. Tente novamente.');
      }
    }
  };

  const styles = {
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%'
    },
  };

  return (
    <div 
      className="card shadow-hover" 
      style={styles.card}
      onClick={() => navigate(`/album/${spotifyId}`)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.borderColor = '#a855f7';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <div style={{ padding: '12px' }}>
        <img 
          src={album.cover_url || "https://via.placeholder.com/300"} 
          className="card-img-top" 
          alt={album.title} 
          style={{ borderRadius: '12px', aspectRatio: '1/1', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body pt-0 d-flex flex-column">
        <h6 className="card-title fw-bold text-white mb-1">{album.title}</h6>
        <p className="card-text text-secondary small mb-3">{album.artist}</p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          {/* Dentro do seu card, onde ficam os botões */}
          <div className="d-flex align-items-center gap-3">
            {/* Botão de Estrela para Review */}
            <button 
              className="btn btn-link p-0 text-warning" 
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                navigate(`/review/${album.id_spotify || album.id}`);
              }}
              title="Avaliar Álbum"
            >
              <i className="bi bi-star-fill" style={{ fontSize: '1.2rem' }}></i>
            </button>
          </div>
          <button 
            className="btn btn-link p-0" 
            style={{ color: isSaved ? '#ef4444' : '#a855f7' }}
            onClick={(e) => handleToggleAlbum(e)}
            title={isSaved ? "Remover da Biblioteca" : "Salvar na Biblioteca"}
          >
            <i className={isSaved ? "bi bi-dash-circle-fill fs-5" : "bi bi-plus-circle-fill fs-5"}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;