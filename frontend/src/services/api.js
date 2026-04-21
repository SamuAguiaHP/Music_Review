import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Certifique-se de que o backend está rodando nesta porta
});

export default api;