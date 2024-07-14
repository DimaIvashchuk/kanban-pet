import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { StrictMode } from 'react';
import { CssBaseline, Experimental_CssVarsProvider } from '@mui/material';
import theme from './theme.tsx';
import { RecoilRoot } from 'recoil';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CssBaseline enableColorScheme />
      <Experimental_CssVarsProvider theme={theme} defaultMode="dark">
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </Experimental_CssVarsProvider>
    </BrowserRouter>
  </StrictMode>
);
