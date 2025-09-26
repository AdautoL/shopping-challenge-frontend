import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación al localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Verifica si se está ejecutando en el navegador (para evitar errores en SSR)
    if (typeof window !== 'undefined') {
    //@ts-ignore
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        config.headers.Authorization = `Bearer ${user.access}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
