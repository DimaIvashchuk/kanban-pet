import { experimental_extendTheme } from '@mui/material/styles';

const theme = experimental_extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
        error: {
          main: '#f44336',
        },
        success: {
          main: '#4caf50',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: '#555555',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        error: {
          main: '#ef5350',
        },
        success: {
          main: '#66bb6a',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#bbbbbb',
        },
      },
    },
  },
});

export default theme;
