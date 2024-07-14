import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import exchangeCodeForToken from '../api/exchangeCodeForToken';
import { useRecoilState } from 'recoil';
import { authState } from '../state/auth';

const Sso = () => {
  const [auth, set$Auth] = useRecoilState(authState);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const exchangeCallback = () => {
    set$Auth(auth ? { ...auth, isLogged: true } : { isLogged: true });
    navigate('/');
  };

  useEffect(() => {
    const code = searchParams.get('code') || '';
    const state = searchParams.get('state') || '';
    exchangeCodeForToken(code, state, exchangeCallback);
  }, [searchParams]);
  return <div>Sso</div>;
};

export default Sso;
