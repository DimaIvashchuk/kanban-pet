import api from '../../core/services/axios';

export default async () => {
  const { data } = await api.get('/api/v1/auth/oauth/request-uri');

  console.log(data);

  window.location.href = data.redirectUri;

  return data;
};
