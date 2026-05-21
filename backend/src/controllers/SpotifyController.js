const spotifyService = require('../services/spotify');

module.exports = {
  // 1. Pesquisa Geral
  async search(req, res) {
    const searchTerm = req.query.q || req.query.query;

    if (!searchTerm) {
      return res.status(400).json({ error: 'É obrigatório enviar um termo de pesquisa (query).' });
    }

    try {
      const data = await spotifyService.searchItems(searchTerm);

      const albumsRaw = data.albums?.items || [];
      const tracksRaw = data.tracks?.items || [];

      const albums = albumsRaw.map(album => ({
        ...album,
        type: 'album'
      }));

      const tracks = tracksRaw.map(track => ({
        ...track,
        type: 'track',
        images: track.album?.images 
      }));
      
      const mixedResults = [...albums, ...tracks];
     
      return res.json(mixedResults);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao comunicar com o Spotify.' });
    }
  },

  // 2. Busca Detalhes de UM Item (Pode ser ID de álbum ou de música)
  async getAlbum(req, res) {
    const id = req.params.id || req.params.albumId || req.params.spotifyId;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'O ID do item não foi recebido.' });
    }

    try {
      // 1. Tenta buscar como Álbum completo
      const albumData = await spotifyService.getAlbumDetails(id);
      
      // Monta o objeto perfeitamente padronizado
      const normalizedAlbum = {
        id: albumData.id,
        name: albumData.name,
        cover_url: albumData.images?.[0]?.url || '',
        artists: albumData.artists || [],
        release_date: albumData.release_date || '',
        total_tracks: albumData.total_tracks || 0,
        type: 'album',
        // Transforma a lista de músicas numa array direta e limpa para o front
        tracks: (albumData.tracks?.items || []).map(track => ({
          id_spotify: track.id,
          name: track.name,
          track_number: track.track_number,
          duration_ms: track.duration_ms,
          artists: track.artists || []
        }))
      };

      return res.json(normalizedAlbum);

    } catch (albumError) {
      try {
        // 2. Se falhar como Álbum, significa que o ID é de uma Música (Track)!
        const trackData = await spotifyService.getTrackDetails(id);
        
        // Disfarça a música criando uma estrutura idêntica à de um Álbum Single
        const normalizedTrackAsAlbum = {
          id: trackData.id,
          name: trackData.name, // Nome da música vira o título principal
          cover_url: trackData.album?.images?.[0]?.url || '', // Pega a capa do álbum original dela
          artists: trackData.artists || [],
          release_date: trackData.album?.release_date || '',
          total_tracks: 1,
          type: 'track',
          // Cria uma array de músicas contendo apenas ela mesma
          tracks: [{
            id_spotify: trackData.id,
            name: trackData.name,
            track_number: 1,
            duration_ms: trackData.duration_ms || 0,
            artists: trackData.artists || []
          }]
        };

        return res.json(normalizedTrackAsAlbum);

      } catch (trackError) {
        console.error(`Falhou ao buscar detalhes do ID ${id}.`);
        return res.status(404).json({ error: 'Item não encontrado no Spotify.' });
      }
    }
  }
};