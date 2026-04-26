import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AlbumCard from '../components/AlbumCard';

function Home() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  useEffect(() => {
    async function loadAlbums() {
      setLoading(true);
      try {
        if (query) {
          // Se tiver pesquisa, chama o Spotify
          const response = await api.get(`/api/search?q=${query}`);
          setAlbums(response.data);
        } else {
          // Se não, carrega os do banco de dados (seu CRUD)
          const response = await api.get('/albums');
          setAlbums(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar álbuns:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, [query]); // O React vai rodar isso de novo toda vez que a URL mudar!

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Header /> 
      <Sidebar /> 

      <main style={{ marginLeft: '260px', paddingTop: '100px', paddingRight: '40px', paddingLeft: '40px', paddingBottom: '40px' }}>
        
        <header className="mb-5">
          <h1 className="display-5 fw-bold">
            {/* O Título muda se você estiver pesquisando */}
            {query ? `Resultados para ` : 'Explorar ' }
            <span style={{ color: '#a855f7' }}>{query ? `"${query}"` : 'Música'}</span>
          </h1>
          <p className="text-secondary fs-5">
            {query ? 'Resultados diretos do Spotify.' : 'Dados reais direto do seu banco de dados PostgreSQL.'}
          </p>
        </header>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#a855f7' }} role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {albums.length > 0 ? (
              albums.map((album) => (
                <div className="col-12 col-sm-6 col-md-4 col-xl-3" key={album.id_spotify || album.id}>
                  <AlbumCard album={album} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-secondary">Nenhum álbum encontrado.</p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Home;