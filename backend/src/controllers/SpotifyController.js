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

  // 2. Busca Detalhes de UM Álbum (com as músicas)
  async getAlbum(req, res) {
    const id = req.params.id || req.params.albumId || req.params.spotifyId;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'O ID do item não foi recebido.' });
    }

    try {
      const data = await spotifyService.getAlbumDetails(id);
      data.type = 'album'; 
      return res.json(data);
    } catch (albumError) {
      try {
        const trackData = await spotifyService.getTrackDetails(id);
        trackData.type = 'track';
        return res.json(trackData);
      } catch (trackError) {
        console.error(`Falhou ao buscar detalhes do ID ${id}.`);
        return res.status(404).json({ error: 'Item não encontrado no Spotify.' });
      }
    }
  },

async getTrack(req, res) {
  const { id_spotify } = req.params;

  if (!id_spotify || id_spotify === 'undefined') {
      return res.status(400).json({ error: 'O ID da música não foi recebido.' });
    }

  try {
    const track = await spotifyService.getTrackDetails(id_spotify);
    return res.json(track);
  } catch (error) {
    console.error("Erro ao buscar detalhes da música:", error);
    return res.status(500).json({ error: 'Erro ao buscar detalhes da música no Spotify.' });
  }
}
};