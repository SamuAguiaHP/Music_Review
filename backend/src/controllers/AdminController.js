const prisma = require('../prisma');

module.exports = {
  // Lista todos os usuários cadastrados
  async listUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return res.json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ error: 'Erro interno ao buscar a lista de usuários.' });
    }
  }
};