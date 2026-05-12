import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AlbumCard({ album, isLibrary = false, onRemove, onSaveSuccess}) {  
  const [isSaved, setIsSaved] = useState(isLibrary);
  const navigate = useNavigate();
  const spotifyId = album.id_spotify || album.id;

  const isVisualTrack = album.type === 'track' || album.album_type === 'single';
  const typeLabel = isVisualTrack ? 'Música' : 'Álbum';
  const badgeColor = isVisualTrack ? '#0dcaf0' : '#a855f7'; // Azul para música, Roxo para álbum
  const typeIcon = isVisualTrack ? 'bi-music-note-beamed' : 'bi-disc';

  const apiRouteType = album.type === 'track' ? 'tracks' : 'albums';
const handleToggleAlbum = async (e) => {
  e.stopPropagation();
  try {
    if (isSaved) {
      await api.delete(`/albums/${spotifyId}`);
      setIsSaved(false); 
      if (isLibrary && onRemove) {
        onRemove(spotifyId);
      }
    } else {
      let formattedTracks = [];

      // Se for música, busca na rota de músicas!
      if (apiRouteType === 'tracks') {
        const spotifyResponse = await api.get(`/api/spotify/tracks/${spotifyId}`);
        const trackData = spotifyResponse.data;

        // Uma música única equivale a uma "lista" de 1 faixa para o nosso banco
        formattedTracks = [{
          id_spotify: trackData.id,
          title: trackData.name,
          track_number: trackData.track_number || 1,
          duration: trackData.duration_ms || 0,
        }];
      } else {
        // Se for álbum, busca na rota de álbuns
        const spotifyResponse = await api.get(`/api/spotify/albums/${spotifyId}`);
        const fullAlbumData = spotifyResponse.data;
        const rawTracks = fullAlbumData.tracks?.items || [];

        formattedTracks = rawTracks.map(track => ({
          id_spotify: track.id,
          title: track.name,
          track_number: track.track_number || 1,
          duration: track.duration_ms || 0,
        }));
      }

      // Se veio do Spotify, ele usa 'name' e 'artists[0].name'
      const payload = {
        id_spotify: spotifyId,
        title: album.title || album.name || 'Título Desconhecido',
        artist: album.artist || (album.artists && album.artists.length > 0 ? album.artists[0].name : 'Artista Desconhecido'), 
        cover_url: album.cover_url || (album.images && album.images.length > 0 ? album.images[0].url : 'https://via.placeholder.com/300'),
        type: isVisualTrack ? 'track' : 'album',
        tracks: formattedTracks 
      };

      // 3. Salva no banco!
      await api.post('/albums', payload);
      
      setIsSaved(true);

      if (onSaveSuccess) {
          onSaveSuccess(); 
        }
        
        alert(`"${payload.title}" adicionado à sua biblioteca!`);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      setIsSaved(true);
    } else {
      console.error("Erro ao salvar:", error);
    }
  }
};

  const handleReviewClick = (e) => {
    e.stopPropagation(); 
    const idParaReview = album.id_spotify || album.id;
    navigate(`/review/${idParaReview}`);
  };

  const renderRating = () => {
    if (album.average > 0) {
      return `${Number(album.average).toFixed(1)} ★`;
    }
    return "Novo";
  };

  const styles = {
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    },
    typeBadge: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: badgeColor,
      color: 'white',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '0.65rem',
      fontWeight: 'bold',
      zIndex: 10,
      textTransform: 'uppercase',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }
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
      {/* BADGE DE TIPO */}
      <div style={styles.typeBadge}>
        <i className={`bi ${typeIcon} me-1`}></i>
        {typeLabel}
      </div>

      <div style={{ padding: '12px' }}>
        <img 
          src={album.cover_url || album.images?.[0]?.url || "https://via.placeholder.com/300"} 
          className="card-img-top" 
          alt={album.title} 
          style={{ borderRadius: '12px', aspectRatio: '1/1', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body pt-0 d-flex flex-column">
        <h6 className="card-title fw-bold text-white mb-1 text-truncate">{album.title || album.name}</h6>
        <p className="card-text text-secondary small mb-3 text-truncate">
          {album.artist || album.artists?.[0]?.name}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <button 
            className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center gap-1"
            onClick={handleReviewClick}
            style={{ 
              borderRadius: '12px', 
              fontSize: '0.7rem', 
              fontWeight: 'bold',
              padding: '2px 8px',   
              width: 'fit-content'  
            }}
          >
            <i className="bi bi-star-fill" style={{ fontSize: '0.65rem' }}></i>
            {renderRating()}
          </button>
          
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