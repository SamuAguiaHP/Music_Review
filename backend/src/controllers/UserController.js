const bcrypt = require('bcryptjs');
const prisma = require('../prisma'); 

module.exports = {
  // 1. Registro de Novo Usuário (Create)
  async register(req, res) {
    try {
      const { name, email, password, isAdmin } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
      }

      const userExists = await prisma.user.findUnique({
        where: { email }
      });

      if (userExists) {
        return res.status(400).json({ error: 'Este e-mail já está em uso.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário no banco
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: isAdmin ? 'ADMIN' : 'STANDARD'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true
        }
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro no registro de usuário:", error);
      return res.status(500).json({ error: 'Erro interno ao criar conta.' });
    }
  },

  // 2. Atualização do Próprio Perfil (Update)
async updateProfile(req, res) {
  try {
    const userId = req.userId;
    const { name, email, password, currentPassword } = req.body;

    // 1. Validar se a senha atual foi enviada
    if (!currentPassword) {
      return res.status(400).json({ error: 'A senha atual é obrigatória para confirmar as alterações.' });
    }

    // 2. Buscar o usuário no banco (precisamos da senha dele para comparar)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // 3. Verificar se a senha atual está correta
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    const dataToUpdate = {};

    // 4. Se mudar o nome
    if (name) dataToUpdate.name = name;

    // 5. Se mudar o e-mail, verifica se não pertence a outro
    if (email && email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Este e-mail já está em uso por outra conta.' });
      }
      dataToUpdate.email = email;
    }

    // 6. Se enviou uma NOVA senha, criptografa a nova
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    // 7. Executa a atualização
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true 
      }
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar dados.' });
  }
},

  // 3. Buscar dados do perfil logado (Read)
  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true
        }
      });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar dados do perfil.' });
    }
  }
};