require('dotenv').config();

const express = require('express');
const cors = require('cors');
// 1. Importa as novas ferramentas do Prisma 7
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// 2. Configura a nova conexão exigida pelo Prisma 7
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Inicializa o cliente passando o adapter
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// ROTAS DE USUÁRIOS (CRUD)
// ==========================================

// 1. CREATE - Cadastrar um novo usuário (POST)
app.post('/users', async (req, res) => {
  try {
    // Adicionamos o password aqui para o Express extrair do corpo da requisição
    const { name, email, password } = req.body;
    
    const newUser = await prisma.user.create({
      // Adicionamos o password aqui para o Prisma salvar no banco
      data: { name, email, password }
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o usuário.' });
  }
});

// 2. READ - Listar todos os usuários (GET)
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os usuários.' });
  }
});

// 3. UPDATE - Atualizar os dados de um usuário (PUT)
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Adicionamos o password aqui também
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { name, email, password }
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
  }
});

// 4. DELETE - Apagar um usuário (DELETE)
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: id }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o usuário.' });
  }
});

// ==========================================
// LIGANDO O SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});