const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    // O authMiddleware já colocou o ID do usuário no req.userId
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Área restrita para administradores.' });
    }

    // Se for admin, pode passar para a próxima função!
    next();
  } catch (error) {
    console.error("Erro no middleware de admin:", error);
    return res.status(500).json({ error: 'Erro ao verificar permissões de acesso.' });
  }
};