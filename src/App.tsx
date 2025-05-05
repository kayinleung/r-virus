import styles from './App.module.css'
import { InputControls } from './components/InputControls'
import { WebRComponent } from './components/WebRComponent'

function App() {

  return (
    <div className={styles.Root}>
      <InputControls />
      <WebRComponent />
    </div>
  )
}

export default App
