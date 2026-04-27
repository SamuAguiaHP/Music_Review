const express = require('express');
const AuthController = require('./controllers/AuthController');
const SpotifyController = require('./controllers/SpotifyController');
const AlbumController = require('./controllers/AlbumController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ResetPasswordController = require('./controllers/ResetPasswordController');

const routes = express.Router();

// ==========================
// Rotas de Autenticação
// ==========================
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.get('/api/search', SpotifyController.search);
routes.post('/albums', AlbumController.create);
routes.post('/forgot-password', ForgotPasswordController.recover);
routes.post('/reset-password', ResetPasswordController.reset);

module.exports = routes;