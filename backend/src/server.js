const express = require('express');
const cors = require('cors');

// Inicializa o aplicativo Express
const app = express();

// Configurações (Middlewares)
app.use(cors()); // Permite que o Front-end faça requisições para cá
app.use(express.json()); // Permite que a nossa API entenda dados em formato JSON

// Rota de Teste Básica
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'API do MelodyRate rodando perfeitamente! 🎧' 
  });
});

// Define a porta e liga o servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});