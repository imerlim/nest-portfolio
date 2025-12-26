import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// A mesma lógica que você tinha no Vue 3, agora centralizada aqui:
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      // Exemplo: Se der erro de não autorizado, limpa o token e vai pro login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (status === 404) {
      console.warn('Recurso não encontrado:', error.config.url);
    }

    if (status === 500) {
      alert('Erro interno no servidor do NestJS!');
    }

    return Promise.reject(error);
  }
);

export default api;