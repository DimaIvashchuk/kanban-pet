import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import exchangeCodeForToken from '../api/exchangeCodeForToken';

const Sso = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams);
    const code = searchParams.get('code') || '';
    const state = searchParams.get('state') || '';
    exchangeCodeForToken(code, state);
  }, [searchParams]);
  return <div>Sso</div>;
};

export default Sso;
