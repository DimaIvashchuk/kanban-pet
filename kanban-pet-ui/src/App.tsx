import { Route, Routes } from 'react-router-dom';
import Profile from './modules/profile/pages';
import { AuthScreenPage, SsoPage } from './modules/auth';
import Layout from './modules/core/components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Hello !</div>} />
        <Route path="/auth" element={<AuthScreenPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sso/google/callback" element={<SsoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
