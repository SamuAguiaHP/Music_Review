const express = require('express');
const AuthController = require('./controllers/AuthController');
const authMiddleware = require('./middlewares/auth');
const SpotifyController = require('./controllers/SpotifyController');
const AlbumController = require('./controllers/AlbumController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ResetPasswordController = require('./controllers/ResetPasswordController');

const routes = express.Router();

// ==========================
// Rotas Públicas (Não precisam de login)
// ==========================
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/forgot-password', ForgotPasswordController.recover);
routes.post('/reset-password', ResetPasswordController.reset);
routes.get('/api/search', SpotifyController.search);

// ==========================
// Rotas Privadas (authMiddleware)
// ==========================
routes.post('/albums', authMiddleware, AlbumController.create);
routes.get('/albums', authMiddleware, AlbumController.index);  
routes.delete('/albums/:id_spotify', authMiddleware, AlbumController.remove);

module.exports = routes;