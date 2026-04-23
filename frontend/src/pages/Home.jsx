import { useEffect, useState } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import AlbumCard from '../components/AlbumCard';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="bg-light min-vh-100">
      {/* 1. Header fixo no topo */}
      <Header />

      {/* 2. Container principal com padding-top para não ficar "atrás" do header */}
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        
        <h1 className="mb-4 text-center">Explore os Álbuns 🎵</h1>
        <h2 className="mb-4 h4 text-muted">Álbuns em Destaque</h2>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2">Carregando...</p>
          </div>
        ) : (
          <div className="row g-4">
            {/* 3. Mapeamento dos álbuns vindo da API */}
            {albums.length > 0 ? (
              albums.map((album) => (
                <div key={album.id} className="col-12 col-sm-6 col-md-4 col-lg-4">
                  <AlbumCard album={album} />
                </div>
              ))
            ) : (
              <div className="text-center w-100 mt-5">
                <p>Nenhum álbum encontrado no momento. 🎸</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;