import React, { useState } from 'react';
import api from '../services/api';

// 1. Recebemos a função onRemove do pai (Home)
function AlbumCard({ album, isLibrary = false, onRemove }) {
  
  const [isSaved, setIsSaved] = useState(isLibrary);

  const handleToggleAlbum = async () => {
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
        // ADICIONAR
        await api.post('/albums', {
          id_spotify: album.id_spotify,
          title: album.title,
          artist: album.artist,
          cover_url: album.cover_url
        });
        setIsSaved(true);
        alert(`Álbum "${album.title}" salvo com sucesso no banco de dados!`);
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
          
          {/* 3. O botão agora muda de cor e de ícone dependendo do estado! */}
          <button 
            className="btn btn-link p-0" 
            style={{ color: isSaved ? '#ef4444' : '#a855f7' }} // Vermelho (remover) ou Roxo (salvar)
            onClick={handleToggleAlbum}
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