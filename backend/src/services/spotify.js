const axios = require('axios');

// 1. Função para pedir o "Crachá Temporário" ao Spotify
async function getSpotifyToken() {
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao autenticar no Spotify:", error.response?.data || error.message);
    throw new Error("Falha na autenticação com a API do Spotify");
  }
}

// 2. Função para pesquisar álbuns
async function searchAlbums(query) {
  try {
    const token = await getSpotifyToken();
    const searchUrl = 'https://api.spotify.com/v1/search';
    const response = await axios.get(searchUrl, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      params: { 
        q: query, 
        type: 'album'
      }
    });

    // O Spotify devolve 20 álbuns por padrão. Vamos pegar apenas os 12 primeiros (slice)
    const albums = response.data.albums.items.slice(0, 12);

    // Filtra e devolve os dados de forma limpa para o Front-end
    return albums.map(album => ({
      id_spotify: album.id,
      title: album.name,
      // Usamos o '?' para evitar erros caso um álbum não tenha artista ou imagem cadastrada
      artist: album.artists[0]?.name || 'Artista Desconhecido',
      cover_url: album.images[0]?.url || 'https://via.placeholder.com/300', 
      release_date: album.release_date,
      spotify_url: album.external_urls.spotify
    }));

  } catch (error) {
    console.error("Erro ao buscar álbuns:", error.response?.data || error.message);
    throw new Error("Falha ao buscar dados no Spotify");
  }
}

module.exports = { searchAlbums };