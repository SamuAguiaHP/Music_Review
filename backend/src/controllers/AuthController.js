const prisma = require('../prisma'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_music_review';

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Busca o usuário no banco
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      // Compara a senha digitada com a senha criptografada do banco
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      // Gera o Token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Retorna o token e os dados básicos do usuário
      delete user.password;
      return res.json({ user, token });

    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor ao fazer login.' });
    }
  }
};