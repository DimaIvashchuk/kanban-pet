import api from '../../core/services/axios';

export default async (code: string, state: string, callback: () => void) => {
  const { data } = await api.post('/api/v1/auth/oauth/exchange', {
    code,
    state,
  });

  console.log(data);

  callback();
};
