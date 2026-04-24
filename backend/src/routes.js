const express = require('express');
const AuthController = require('./controllers/AuthController');

const routes = express.Router();

// ==========================
// Rotas de Autenticação
// ==========================
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

module.exports = routes;