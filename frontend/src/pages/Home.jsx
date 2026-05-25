import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AlbumCard from '../components/AlbumCard';

function Home() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();

  // ESTADOS DA SIDEBAR RESPONSIVA
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // Monitora o tamanho da tela em tempo real
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 992;
      setIsMobile(mobileView);
      if (!mobileView) setIsSidebarOpen(true); // Sempre aberta no PC
      if (mobileView && isSidebarOpen) setIsSidebarOpen(false); // Esconde ao encolher a tela
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const loadLibrary = async () => {
    try {
      const response = await api.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
    }
  };

  useEffect(() => {
    async function loadAlbums() {
      setLoading(true);
      try {
        if (query) {
          const response = await api.get(`/api/search?q=${query}`);
          const dadosValidos = response.data.filter(item => item !== null && item !== undefined);
          setAlbums(dadosValidos);
        } else {
          const response = await api.get('/albums');
          setAlbums(response.data);
        }
      } catch (err) {
        console.error(err);
        // 👇 FEEDBACK DE ERRO: Avisa se o token expirou ou se o usuário foi deslogado (401)
        if (err.response?.status === 401) {
          alert("Sua sessão expirou! Por favor, faça login novamente.");
          navigate('/login');
        } else { alert("Erro ao publicar avaliação. Tente novamente."); }
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, [query, navigate]);

  const handleRemoveAlbum = (id_spotify) => {
    setAlbums(prevAlbums => prevAlbums.filter(album => album.id_spotify !== id_spotify));
    alert("Álbum removido com sucesso!");
  };

  // DIVISÃO DE CATEGORIAS
  const listaTracks = albums.filter(item => item.type === 'track');
  const listaAlbums = albums.filter(item => item.type === 'album');

  const renderGrid = (items) => {
    if (items.length === 0) {
      return (
        <div className="p-4 text-center bg-dark rounded border border-secondary" style={{ borderRadius: '12px' }}>
          <p className="text-secondary mb-0">Nenhum item encontrado nesta categoria.</p>
        </div>
      );
    }

    return (
      <div className="row g-4">
        {items.map((item) => (
          <div className="col-12 col-md-6 col-xxl-4" key={item.id_spotify || item.id}>
            <AlbumCard
              album={item}
              isLibrary={!query}
              onRemove={handleRemoveAlbum}
              onSaveSuccess={loadLibrary}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>

      {/* INTEGRAÇÃO DO TOGGLE */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <main style={{
        marginLeft: !isMobile && isSidebarOpen ? '260px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
        paddingTop: '100px',
        paddingRight: '30px',
        paddingLeft: '30px',
        paddingBottom: '40px'
      }}>

        <header className="mb-5">
          <h1 className="display-5 fw-bold">
            {query ? `Resultados para ` : 'Sua '}
            <span style={{ color: '#a855f7' }}>{query ? `"${query}"` : 'Biblioteca'}</span>
          </h1>
        </header>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#a855f7' }} role="status"></div>
          </div>
        ) : (
          /* COLUNAS LADO A LADO */
          <div className="row g-5">

            {/* Lado Esquerdo: MÚSICAS */}
            <div className="col-12 col-xl-6 border-end-xl border-secondary">
              <h3 className="fw-bold mb-4" style={{ color: '#0dcaf0', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <i className="bi bi-music-note-beamed me-2"></i>
                {query ? 'Músicas Encontradas' : 'Músicas Salvas'}
              </h3>
              {renderGrid(listaTracks)}
            </div>

            {/* Lado Direito: ÁLBUNS */}
            <div className="col-12 col-xl-6">
              <h3 className="fw-bold mb-4" style={{ color: '#a855f7', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <i className="bi bi-disc me-2"></i>
                {query ? 'Álbuns Encontrados' : 'Álbuns Salvos'}
              </h3>
              {renderGrid(listaAlbums)}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default Home;