import styles from './App.module.css';
import { InputControls } from './components/InputControls';
import { theme as browserTheme } from '@utils/browser';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { WebRComponent } from '@components/WebRComponent';

const theme = createTheme({
  palette: {
    mode: browserTheme,
    text: {
      primary: browserTheme === 'dark' ? '#ffffff' : '#000000',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            'minWidth': '8rem',
          },
        },
      },
    },
  },
});

function App() {

  return (
    <div className={styles.root}>
      <ThemeProvider theme={theme}>
        <InputControls />
        <WebRComponent />
      </ThemeProvider>
    </div>
  )
}

export default App
