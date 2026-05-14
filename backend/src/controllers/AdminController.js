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
  },

  // Deleta um usuário específico (exceto ele mesmo)
  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      // Um admin não deve conseguir deletar a si mesmo
      if (id === req.userId) {
        return res.status(400).json({ error: 'Você não pode excluir sua própria conta de administrador por aqui.' });
      }

      await prisma.user.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      return res.status(500).json({ error: 'Erro interno ao tentar excluir o usuário.' });
    }
}
};