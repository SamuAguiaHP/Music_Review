function AlbumCard({ album }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      {/* Imagem com altura fixa para garantir que ela apareça */}
      <img 
        src={album.cover_url || 'https://via.placeholder.com/300'} 
        className="card-img-top w-100" 
        alt={album.title}
        style={{ 
          height: '260px',     // Forçamos uma altura fixa
          objectFit: 'cover',   // Garante que a foto não estique
          display: 'block',
          backgroundColor: '#eee' // Fundo cinza caso a imagem demore a carregar
        }}
      />
      
      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title h6 fw-bold text-truncate mb-1">{album.title}</h5>
        <p className="card-text text-muted small mb-3">{album.artist}</p>
        
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="badge rounded-pill bg-primary">⭐ {album.rating || 'N/A'}</span>
          <button className="btn btn-sm btn-dark">
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;