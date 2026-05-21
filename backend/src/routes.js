const express = require('express');
const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const authMiddleware = require('./middlewares/auth');
const SpotifyController = require('./controllers/SpotifyController');
const AlbumController = require('./controllers/AlbumController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
const ReviewController = require('./controllers/ReviewController');
const adminMiddleware = require('./middlewares/adminMiddleware');
const AdminController = require('./controllers/AdminController');

const routes = express.Router();

// ==========================
// Rotas Públicas (Não precisam de login)
// ==========================
routes.post('/register', UserController.register);
routes.post('/login', AuthController.login);
routes.post('/forgot-password', ForgotPasswordController.recover);
routes.post('/reset-password', ResetPasswordController.reset);
routes.get('/api/search', SpotifyController.search);
routes.get('/api/spotify/albums/:id', SpotifyController.getAlbum);
routes.get('/reviews', ReviewController.index);

// ==========================
// Rotas Privadas (authMiddleware)
// ==========================
routes.post('/albums', authMiddleware, AlbumController.create);
routes.get('/albums', authMiddleware, AlbumController.index);  
routes.delete('/albums/:id_spotify', authMiddleware, AlbumController.remove);
routes.post('/reviews', authMiddleware, ReviewController.createOrUpdate);
routes.get('/users/profile', authMiddleware, UserController.getProfile);
routes.put('/users/profile', authMiddleware, UserController.updateProfile);

// ==========================
// Rotas de Admin (authMiddleware + adminMiddleware)
// ==========================
routes.get('/admin/users', authMiddleware, adminMiddleware, AdminController.listUsers);
routes.delete('/admin/users/:id', authMiddleware, adminMiddleware, AdminController.deleteUser);

module.exports = routes;