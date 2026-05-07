const prisma = require('../prisma');

module.exports = {
  // Cria ou Atualiza uma avaliação (Upsert)
  async createOrUpdate(req, res) {
    const { rating, comment, album_id } = req.body;
    const user_id = req.userId || req.usuarioId;

    try {
      // Procura avaliação anterior deste usuário para este álbum
      const existingReview = await prisma.review.findFirst({
        where: { user_id, album_id }
      });

      let review;
      if (existingReview) {
        review = await prisma.review.update({
          where: { id: existingReview.id },
          data: { rating: Number(rating), comment }
        });
      } else {
        review = await prisma.review.create({
          data: { rating: Number(rating), comment, user_id, album_id },
          include: { user: { select: { name: true } } }
        });
      }

      return res.status(201).json(review);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar avaliação." });
    }
  },

  // Lista avaliações e calcula a média
  async index(req, res) {
    const { album_id } = req.query;

    try {
      const reviews = await prisma.review.findMany({
        where: { album_id },
        include: {
          user: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });

      // Cálculo da média de estrelas
      const average = reviews.length > 0 
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
        : 0;

      return res.json({ reviews, average });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar avaliações." });
    }
  }
};