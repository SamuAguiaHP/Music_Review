const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Tenta pegar a "pulseira VIP" (token) no cabeçalho da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Nenhum token fornecido. Faça login para continuar.' });
  }

  // O padrão do token é "Bearer dkasjdaslk...", então dividimos em duas partes
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro de formato no Token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  // 2. Verifica se o token é verdadeiro usando a sua chave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado. Faça login novamente.' });
    }

    // 3. A pulseira é válida! Pegamos o ID do usuário que estava escondido dentro dela
    // e guardamos no 'req' para o AlbumController poder ler!
    req.userId = decoded.id; 

    // Pode entrar! (Passa o controle para o AlbumController)
    return next();
  });
};