const { searchAlbums } = require('../services/spotify');

module.exports = {
  async search(req, res) {
    // Apanhamos o que o utilizador digitou na barra de pesquisa (?q=artista)
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'É obrigatório enviar um termo de pesquisa (q).' });
    }

    try {
      // Pedimos ao motor do Spotify para fazer a magia
      const albums = await searchAlbums(q);
      
      // Devolvemos a lista limpa para o Front-end
      return res.json(albums);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao comunicar com o Spotify.' });
    }
  }
};