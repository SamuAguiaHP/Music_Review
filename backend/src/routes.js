const express = require('express');
const AuthController = require('./controllers/AuthController');
const SpotifyController = require('./controllers/SpotifyController');
const AlbumController = require('./controllers/AlbumController');

const routes = express.Router();

// ==========================
// Rotas de Autenticação
// ==========================
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.get('/api/search', SpotifyController.search);
routes.post('/albums', AlbumController.create);

module.exports = routes;