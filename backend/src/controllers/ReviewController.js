const prisma = require('../prisma');

module.exports = {
  /**
   * Cria ou atualiza uma avaliação (Upsert).
   * Garante que o usuário tenha apenas uma avaliação por item.
   */
  async createOrUpdate(req, res) {
    const { rating, comment, album_id, track_id } = req.body;
    const user_id = req.userId || (req.user && req.user.id) || req.usuarioId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "A nota deve estar entre 1 e 5." });
    }

    try {
      // Procuramos se o usuário já avaliou este item específico
      const existingReview = await prisma.review.findFirst({
        where: {
          user_id,
          album_id: album_id || null,
          track_id: track_id || null
        }
      });

      let review;

      if (existingReview) {
        // Se já existe, atualizamos
        review = await prisma.review.update({
          where: { id: existingReview.id },
          data: { rating: Number(rating), comment }
        });
      } else {
        // Se não existe, criamos
        review = await prisma.review.create({
          data: {
            rating: Number(rating),
            comment,
            user_id,
            album_id: album_id || null,
            track_id: track_id || null
          }
        });
      }

      return res.status(201).json(review);
    } catch (error) {
      console.error("Error on Review Upsert:", error);
      return res.status(500).json({ error: "Erro ao processar sua avaliação." });
    }
  },

  /**
   * Busca as avaliações de um item e a média de notas.
   */
  async index(req, res) {
    const { album_id, track_id } = req.query;

    try {
      const reviews = await prisma.review.findMany({
        where: {
          album_id: album_id || undefined,
          track_id: track_id || undefined
        },
        include: {
          user: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });

      // Calculamos a média para exibir as estrelinhas preenchidas no card
      const average = reviews.length > 0 
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
        : 0;

      return res.status(200).json({ reviews, average });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar avaliações." });
    }
  }
};