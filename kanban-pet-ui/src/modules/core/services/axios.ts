import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENV,
  withCredentials: true,
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const expiredTokenStatuses = [401, 498];

//     if (
//       expiredTokenStatuses.includes(error.response?.status) &&
//       !originalRequest._retry
//     ) {
//       try {
//         originalRequest._retry = true;

//         const refreshToken = localStorage.getItem('refresh_token');

//         if (!refreshToken) {
//           originalRequest._retry = false;
//           return Promise.reject(error);
//         }

//         const { data } = await apiV2.post('/api/v1/auth/access_token/refresh', {
//           refreshToken,
//         });

//         if (data?.data?.accessToken?.token) {
//           setAccessToken(data?.data?.accessToken?.token);
//         }

//         axios.defaults.headers.common.Authorization = `Bearer ${getAccessToken()}`;

//         return apiV2(originalRequest);
//       } catch (err) {
//         Sentry.captureException(err);
//         window.location.href = '/signin';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
