function AlbumCard({ album }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 shadow-sm border-0">
        <img 
          src={album.cover_url} 
          className="card-img-top" 
          alt={album.title} 
          style={{ height: '250px', objectFit: 'cover' }} 
        />
        <div className="card-body">
          <h5 className="card-title text-dark">{album.title}</h5>
          <p className="card-text text-secondary">{album.artist} • {album.release_year}</p>
          <button className="btn btn-primary w-100">Avaliar</button>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;