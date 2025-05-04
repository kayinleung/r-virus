import { Form } from "radix-ui";
import styles from "./InputControls.module.css";
import { population } from "../state/input-controls";

/* Application State */
import { useSignals } from "@preact/signals-react/runtime";

const InputControls = () => {

  useSignals();

  return (
    <Form.Root className={styles.Root}>
      <Form.Field className={styles.Field} name="population">
        <Form.Label className={styles.Label}>Population</Form.Label>
        <Form.Control value={String(population.value)} onChange={(e) => population.value = Number(e.target.value)} required />
        <Form.Message className={styles.InputError} match={(value) => Number(value) < 100 || Number(value) > 1e10}>
          Please provide a population between 100 and 10 billion
        </Form.Message>
      </Form.Field>
      
      <Form.Submit asChild>
        <button className={styles.Button} style={{ marginTop: 10 }}>
          Rerun simulation
        </button>
      </Form.Submit>
    </Form.Root>
  )
};

export { InputControls };
