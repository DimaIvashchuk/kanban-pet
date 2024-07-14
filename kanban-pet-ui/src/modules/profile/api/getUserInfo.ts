import api from '../../core/services/axios';

export default async () => {
  const { data } = await api.get('/api/v1/user');

  return data;
};
