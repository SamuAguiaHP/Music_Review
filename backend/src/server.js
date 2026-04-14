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

// ... (O resto das rotas de Álbuns continua igualzinho) ...

// ==========================================
// ROTAS DE ÁLBUNS (CRUD)
// ==========================================

// 1. CREATE - Cadastrar um novo álbum (POST)
app.post('/albums', async (req, res) => {
  try {
    const { title, artist, release_year, cover_url } = req.body;
    
    const newAlbum = await prisma.album.create({
      data: { title, artist, release_year, cover_url }
    });
    
    res.status(201).json(newAlbum); // 201 significa "Criado com sucesso"
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o álbum.' });
  }
});

// 2. READ - Listar todos os álbuns (GET)
app.get('/albums', async (req, res) => {
  try {
    const albums = await prisma.album.findMany();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os álbuns.' });
  }
});

// 3. UPDATE - Atualizar os dados de um álbum (PUT)
app.put('/albums/:id', async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID que vem na URL
    const { title, artist, release_year, cover_url } = req.body;

    const updatedAlbum = await prisma.album.update({
      where: { id: id },
      data: { title, artist, release_year, cover_url }
    });
    
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o álbum.' });
  }
});

// 4. DELETE - Apagar um álbum (DELETE)
app.delete('/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.album.delete({
      where: { id: id }
    });
    
    res.status(204).send(); // 204 significa "Sucesso, sem conteúdo para retornar"
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o álbum.' });
  }
});

// ==========================================
// LIGANDO O SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});