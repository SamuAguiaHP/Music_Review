require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Configuração de Conexão (Prisma 7)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. ROTAS DE ÁLBUNS
// ==========================================
app.post('/albums', async (req, res) => {
  try {
    const { title, artist, release_year, cover_url } = req.body;
    const newAlbum = await prisma.album.create({ data: { title, artist, release_year, cover_url } });
    res.status(201).json(newAlbum);
  } catch (error) { res.status(500).json({ error: 'Erro ao criar álbum' }); }
});

app.get('/albums', async (req, res) => {
  try {
    const albums = await prisma.album.findMany();
    res.json(albums);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar álbuns' }); }
});

// ==========================================
// 2. ROTAS DE USUÁRIOS
// ==========================================
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await prisma.user.create({ data: { name, email, password } });
    res.status(201).json(newUser);
  } catch (error) { res.status(500).json({ error: 'Erro ao criar usuário' }); }
});

// ==========================================
// 3. ROTAS DE MÚSICAS (TRACKS)
// ==========================================
app.post('/tracks', async (req, res) => {
  try {
    const { title, duration, album_id, track_number } = req.body;
    
    const newTrack = await prisma.track.create({
      data: { 
        title, 
        duration: Number(duration),
        track_number: Number(track_number), 
        album_id
      }
    });
    
    res.status(201).json(newTrack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a música. Verifique os campos obrigatórios.' });
  }
});

app.get('/tracks', async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({ include: { album: true } });
    res.json(tracks);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar músicas' }); }
});

// LIGANDO O MOTOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});