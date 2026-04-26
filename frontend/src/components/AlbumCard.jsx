import React from 'react';
import api from '../services/api'; // NOVO: Importamos o Axios configurado

function AlbumCard({ album }) {
  
  // Função que é chamada ao clicar no botão "+"
  const handleSaveAlbum = async () => {
    try {
      // Enviamos para o nosso backend os dados do álbum que veio do Spotify
      await api.post('/albums', {
        id_spotify: album.id_spotify,
        title: album.title,
        artist: album.artist,
        cover_url: album.cover_url
      });

      // Feedback de sucesso para o usuário
      alert(`Álbum "${album.title}" salvo com sucesso no banco de dados!`);
      
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o álbum. Tente novamente.');
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
    // ... Mantenha o restante dos seus styles (imageContainer, albumImage, badge)
  };

  return (
    <div 
      className="card shadow-hover" 
      style={styles.card}
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
          <span className="badge rounded-pill" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.5)' }}>
            ⭐ {album.rating || 'Novo'}
          </span>
          <button className="btn btn-link p-0" style={{ color: '#a855f7' }} onClick={handleSaveAlbum}>
            <i className="bi bi-plus-circle-fill fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;