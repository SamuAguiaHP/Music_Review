const prisma = require('../prisma'); // Puxa a nossa conexão otimizada com o banco

module.exports = {
  async create(req, res) {
    // 1. Recebe os dados que o Front-end mandou
    const { id_spotify, title, artist, cover_url } = req.body;

    if (!id_spotify || !title) {
      return res.status(400).json({ error: 'Faltam dados obrigatórios do álbum.' });
    }

    try {
      // 2. Procura se o álbum já existe no nosso banco (usando o id do Spotify)
      let album = await prisma.album.findUnique({
        where: { id_spotify: id_spotify }
      });

      // 3. Se não existir, nós criamos um novo!
      if (!album) {
        album = await prisma.album.create({
          data: {
            id_spotify: id_spotify,
            title: title,
            artist: artist,
            cover_url: cover_url,
            release_year: req.body.release_date ? parseInt(req.body.release_date.substring(0, 4)) : 2024
          }
        });
      }

      // 4. Devolve o álbum salvo (ou o que já existia) com status 201 (Created)
      return res.status(201).json(album);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao salvar o álbum.' });
    }
  }
};