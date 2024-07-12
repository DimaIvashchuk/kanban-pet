import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthScreenPage, SsoPage } from './modules/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/sso/google/callback',
    element: <SsoPage />,
  },
  {
    path: '/auth',
    element: <AuthScreenPage />,
  },
]);

export default router;
