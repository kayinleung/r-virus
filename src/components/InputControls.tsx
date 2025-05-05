import { Form } from "radix-ui";
import { v4 as uuidv4 } from 'uuid';
import styles from "./InputControls.module.css";
import { population, simulationRuns } from "../state/input-controls";

/* Application State */
import { useSignals } from "@preact/signals-react/runtime";


const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
  /* Query parameters are uploaded and page reloads without this :( */
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  population.value = Number(data.population);
  simulationRuns.value = [...simulationRuns.value, { id: uuidv4() }];
};

const InputControls = () => {

  useSignals();

  return (
    <Form.Root
      className={styles.Root}
			onSubmit={handleOnSubmit}>
      <Form.Field className={styles.Field} name="population">
        <Form.Label className={styles.Label}>Population</Form.Label>
        <Form.Control value={String(population.value)} onChange={(e) => population.value = Number(e.target.value)} required />
        <Form.Message className={styles.InputError} match={(value) => Number(value) < 100 || Number(value) > 1e10}>
          Please provide a population between 100 and 10 billion
        </Form.Message>
      </Form.Field>
      
      <Form.Submit asChild>
        <button className={styles.Button} style={{ marginTop: 10 }}>
          {simulationRuns.value.length > 0 ? 'Rerun' : 'Run'} simulation
        </button>
      </Form.Submit>
    </Form.Root>
  )
};

export { InputControls };
