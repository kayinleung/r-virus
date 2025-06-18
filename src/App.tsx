import styles from './App.module.css';
import { InputControls } from './components/InputControls';
import { theme as browserTheme } from '@utils/browser';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { WebRComponent } from '@components/WebRComponent';
import { Refresh } from '@components/Refresh';

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
            minWidth: '6rem',
          },
        },
      },
    },
  },
});

function App() {

  return (
    <div className={styles.appRoot}>
      <ThemeProvider theme={theme}>
        <div className={styles.simulationControls}>
          <InputControls />
          <Refresh />
        </div>
        <WebRComponent />
      </ThemeProvider>
    </div>
  )
}

export default App
