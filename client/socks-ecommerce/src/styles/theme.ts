import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#c94401', //orange
      light: '#fecd95', //product card orange
      dark: '#1976d2'
    },
    secondary: {
      main: '#1B1833', //blue
      light: '#F7C566',
      dark: '#c51162'
    },
    background: {
      default: '#fee7be' //yellow
    }
  },
  typography: {
    fontFamily: [
      'Sour Gummy',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    }
  }
});