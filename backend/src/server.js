require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const prisma = require('./prisma'); // Importa a conexão centralizada

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

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

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar usuários' }); }
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

// ==========================================
// 4. ROTAS DE AVALIAÇÕES (REVIEWS)
// ==========================================
app.post('/reviews', async (req, res) => {
  try {
    const { rating, comment, user_id, track_id } = req.body;
    
    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        user_id,
        track_id
      }
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar avaliação. Verifique user_id e track_id.' });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        track: { include: { album: true } } // Traz a música E o álbum dela!
      }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
});

// LIGANDO O MOTOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});