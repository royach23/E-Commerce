import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Material Blue
      light: '#64b5f6',
      dark: '#1976d2'
    },
    secondary: {
      main: '#f50057', // Material Pink
      light: '#ff4081',
      dark: '#c51162'
    },
    background: {
      default: '#f4f4f4'
    }
  },
  typography: {
    fontFamily: [
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