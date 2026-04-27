const prisma = require('../prisma');
const bcrypt = require('bcryptjs'); // Precisamos criptografar a nova senha!

module.exports = {
  async reset(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'E-mail e nova senha são obrigatórios.' });
    }

    try {
      // 1. Confirma se o utilizador realmente existe
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        return res.status(404).json({ error: 'Conta não encontrada.' });
      }

      // 2. Criptografa a nova senha com padrão de mercado
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 3. Atualiza o banco de dados
      await prisma.user.update({
        where: { email: email },
        data: { password: hashedPassword } // Sobrescreve a senha antiga
      });

      return res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
    }
  }
};