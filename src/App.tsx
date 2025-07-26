import styles from './App.module.css';
import { InputControls } from './components/InputControls';

import { WebRComponent } from '@components/WebRComponent';
import { Refresh } from '@components/Refresh';
import { createTheme, MantineProvider } from '@mantine/core';


const theme = createTheme({});

function App() {

  return (
    <div className={styles.appRoot}>
      <MantineProvider theme={theme}>
        <div className={styles.simulationControls}>
          <InputControls />
          <Refresh />
        </div>
        { /* TODO: Add another page "Info" */}
        <WebRComponent />
      </MantineProvider>
    </div>
  )
}

export default App
