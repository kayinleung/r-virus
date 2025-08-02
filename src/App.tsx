import styles from './App.module.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

// https://mantine.dev/styles/global-styles/#add-global-styles-in-your-application
import './global.css';
import { LeftNavigation } from '@components/Navigation';
import { WebRComponent } from '@components/WebRComponent';
import { useSearchParams } from 'react-router-dom';
import { InputControls } from '@components/InputControls';
import { About } from '@components/About';
import { Legend } from '@components/Legend';

const theme = createTheme({
  headings: {
    // properties for all headings
    fontWeight: '400',
    fontFamily: 'Roboto',

    // properties for individual headings, all of them are optional
    sizes: {
      h2: { lineHeight: '1.2' },
    },
  },
});

function App() {
  const [search] = useSearchParams();
  const tab = search.get('tab') || 'simulations';

  return (
    <div className={styles.appRoot}>
      <MantineProvider
        defaultColorScheme="auto"
        theme={theme}>

          <div className={styles.navBar} >
            <div>
              <LeftNavigation />
              {tab === 'simulations' && <InputControls />}
              {tab === 'about' && <About />}
            </div>
            <Legend />
          </div>

          <WebRComponent />
      </MantineProvider>
    </div>
  )
}

export default App
