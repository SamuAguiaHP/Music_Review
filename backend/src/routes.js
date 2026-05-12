const express = require('express');
const AuthController = require('./controllers/AuthController');
const authMiddleware = require('./middlewares/auth');
const SpotifyController = require('./controllers/SpotifyController');
const AlbumController = require('./controllers/AlbumController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
const ReviewController = require('./controllers/ReviewController');

const routes = express.Router();

// ==========================
// Rotas Públicas (Não precisam de login)
// ==========================
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/forgot-password', ForgotPasswordController.recover);
routes.post('/reset-password', ResetPasswordController.reset);
routes.get('/api/search', SpotifyController.search);
routes.get('/api/spotify/albums/:id', SpotifyController.getAlbum);
routes.get('/api/spotify/tracks/:id', SpotifyController.getTrack);
routes.get('/reviews', ReviewController.index);

// ==========================
// Rotas Privadas (authMiddleware)
// ==========================
routes.post('/albums', authMiddleware, AlbumController.create);
routes.get('/albums', authMiddleware, AlbumController.index);  
routes.delete('/albums/:id_spotify', authMiddleware, AlbumController.remove);
routes.post('/reviews', authMiddleware, ReviewController.createOrUpdate);


module.exports = routes;