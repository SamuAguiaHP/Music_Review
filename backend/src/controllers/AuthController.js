const prisma = require('../prisma'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_music_review';

module.exports = {
  // ==========================================
  // 1. ROTA DE CADASTRO (REGISTER)
  // ==========================================
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Verifica se o email já está em uso
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // Criptografa a senha (o '10' é o "custo" do hash, padrão seguro da indústria)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Salva no banco de dados
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Retorna o usuário criado, mas deleta a senha do objeto de resposta por segurança!
      delete user.password;
      return res.status(201).json(user);

    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor ao registrar.' });
    }
  },

  // ==========================================
  // 2. ROTA DE LOGIN
  // ==========================================
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

      // Se tudo estiver certo, gera o Token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role }, // Dados que vão dentro do token (Payload)
        JWT_SECRET,
        { expiresIn: '1h' } // O token expira em 1 hora
      );

      // Retorna o token e os dados básicos do usuário
      delete user.password;
      return res.json({ user, token });

    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor ao fazer login.' });
    }
  }
};