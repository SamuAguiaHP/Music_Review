import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
  let token = localStorage.getItem('@MusicReview:token') || sessionStorage.getItem('@MusicReview:token');
  
  if (token) {
    // 1. Limpa o token: remove aspas extras caso o navegador tenha guardado com JSON.stringify
    token = token.replace(/^"|"$/g, '');

    // 2. Garante que os headers existem
    config.headers = config.headers || {};

    // 3. A forma moderna e segura de injetar o token no Axios novo
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;