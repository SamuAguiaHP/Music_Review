const { sendRecoveryEmail } = require('../services/email');
const prisma = require('../prisma');

module.exports = {
  async recover(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'O e-mail é obrigatório.' });
    }

    try {
      // Verifica se o usuário existe no banco de dados
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        return res.status(404).json({ error: 'Nenhuma conta encontrada com este e-mail.' });
      }

      // Cria um link simulado para o Front-end (no futuro, adicionamos um Token real aqui)
      const resetLink = `http://localhost:5173/reset-password?email=${email}`;

      // Dispara o e-mail
      await sendRecoveryEmail(email, resetLink);

      return res.json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao processar recuperação.' });
    }
  }
};