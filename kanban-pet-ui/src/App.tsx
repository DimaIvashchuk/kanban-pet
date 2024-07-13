import { Route, Routes } from 'react-router-dom';
import Profile from './modules/profile/pages';
import { AuthScreenPage, SsoPage } from './modules/auth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Hello</div>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/sso/google/callback" element={<SsoPage />} />
      <Route path="/auth" element={<AuthScreenPage />} />
    </Routes>
  );
}

export default App;
