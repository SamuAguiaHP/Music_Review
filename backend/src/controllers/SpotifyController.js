const { searchAlbums, getAlbumDetails } = require('../services/spotify');

module.exports = {
  // 1. Pesquisa Geral
  async search(req, res) {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'É obrigatório enviar um termo de pesquisa (q).' });
    }

    try {
      const albums = await searchAlbums(q);
      return res.json(albums);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao comunicar com o Spotify.' });
    }
  },

  // 2. Busca Detalhes de UM Álbum (com as músicas)
  async getAlbum(req, res) {
    const { id_spotify } = req.params;
    try {
      const albumFullData = await getAlbumDetails(id_spotify);
      return res.json(albumFullData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar detalhes do álbum no Spotify.' });
    }
  }
};