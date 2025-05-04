import styles from './App.module.css'
import { InputControls } from './components/InputControls'
import { WebRComponent } from './components/WebRComponent'

function App() {

  return (
    <div className={styles.Root}>
      <WebRComponent />
      <InputControls />
    </div>
  )
}

export default App
