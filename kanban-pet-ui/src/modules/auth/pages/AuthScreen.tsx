import redirectToOauthUri from '../api/redirectToOauthUri';

const AuthScreen = () => {
  const onLogin = () => {
    redirectToOauthUri();
  };
  return <button onClick={onLogin}>Login</button>;
};

export default AuthScreen;
