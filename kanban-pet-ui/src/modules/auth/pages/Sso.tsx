import { useEffect } from 'react';
import {
  redirect,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import exchangeCodeForToken from '../api/exchangeCodeForToken';

const Sso = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onLogin = () => {
    console.log('onLogin');
    navigate('/profile');
  };

  useEffect(() => {
    console.log(searchParams);
    const code = searchParams.get('code') || '';
    const state = searchParams.get('state') || '';
    exchangeCodeForToken(code, state, onLogin);
  }, [searchParams]);
  return <div>Sso</div>;
};

export default Sso;
