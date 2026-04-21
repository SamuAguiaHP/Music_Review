import { useEffect, useState } from 'react';
import api from '../services/api';
import AlbumCard from '../components/AlbumCard';

function Home() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/albums')
      .then((response) => {
        setAlbums(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar álbuns:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Explore os Álbuns 🎵</h1>
      
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="row g-4"> {}
          
          {}
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
          {}

        </div>
      )}
    </div>
  );
}

export default Home;