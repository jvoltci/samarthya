import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { teal, amber } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(223, 120, 52)',
      light: 'rgb(238, 160, 111)',
      dark: 'rgb(191, 95, 40)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'rgb(53, 45, 132)',
      light: 'rgb(91, 85, 168)',
      dark: 'rgb(38, 32, 102)',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { color: 'rgb(53, 45, 132)' },
    h2: { color: 'rgb(223, 120, 52)' },
  },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
