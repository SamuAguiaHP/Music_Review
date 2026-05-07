const prisma = require('../prisma');
const { getAlbumDetails } = require('../services/spotify');

module.exports = {
  // Criar ou Atualizar Avaliação
  async createOrUpdate(req, res) {
    const { rating, comment, album_id } = req.body;
    const user_id = req.userId || req.usuarioId;

    try { //  Verificar se o álbum já existe no banco
      let album = await prisma.album.findFirst({
        where: { id_spotify: album_id }
      });

      if (!album) {
        const spotifyData = await getAlbumDetails(album_id);
        album = await prisma.album.create({
          data: {
            id_spotify: album_id,
            title: spotifyData.name,
            artist: spotifyData.artists[0].name,
            cover_url: spotifyData.images[0].url,
            userId: user_id
          }
        });
      }
      // Verificar se o usuário já avaliou este álbum
      const existingReview = await prisma.review.findFirst({
        where: { 
          user_id, 
          album_id: album.id 
        }
      });

      let review;
      if (existingReview) {
        review = await prisma.review.update({
          where: { id: existingReview.id },
          data: { rating: Number(rating), comment }
        });
      } else {
        review = await prisma.review.create({
          data: { 
            rating: Number(rating), 
            comment, 
            user_id, 
            album_id: album.id
          },
          include: { user: { select: { name: true } } }
        });
      }

      return res.status(201).json(review);
    } catch (error) {
      console.error("Erro no ReviewController:", error);
      return res.status(500).json({ error: "Erro ao processar avaliação." });
    }
  },

  // Listar Avaliações
  async index(req, res) {
    const { album_id } = req.query;

    try {
      // 1. Achar o álbum no nosso banco primeiro
      const album = await prisma.album.findFirst({
        where: { id_spotify: album_id }
      });

      // Se o álbum não existe no banco, ainda não tem reviews
      if (!album) {
        return res.json({ reviews: [], average: 0 });
      }

      // 2. Buscar reviews usando o ID interno
      const reviews = await prisma.review.findMany({
        where: { album_id: album.id },
        include: { user: { select: { name: true } } },
        orderBy: { created_at: 'desc' }
      });

      const average = reviews.length > 0 
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
        : 0;

      return res.json({ reviews, average });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar avaliações." });
    }
  }
};