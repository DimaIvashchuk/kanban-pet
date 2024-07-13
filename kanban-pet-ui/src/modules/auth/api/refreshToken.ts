import api from '../../core/services/axios';

export default async () => {
  const { data } = await api.post('/api/v1/auth/refresh');

  console.log(data);

  return data;
};
