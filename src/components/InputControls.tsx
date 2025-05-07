
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Box, InputLabel, Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';
import styles from "./InputControls.module.css";
import type { FormValues } from "@state/input-controls";
import { simulationRuns, currentForm } from "@state/input-controls";
import { useSignals } from "@preact/signals-react/runtime";


const InputControls = () => {

  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    const { name, value } = event.currentTarget;
    currentForm.value = {
      ...currentForm.value,
      [name]: value,
    };
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    currentForm.value = {
      ...currentForm.value,
      [name]: value,
    };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formValues = Object.fromEntries(new FormData(event.currentTarget).entries()) as unknown as FormValues;

    simulationRuns.value = [...simulationRuns.value, {
      id: uuidv4(),
      formValues: {
        ...formValues,
      },
    }];
  };

  useSignals();

  return (
    <Box
      className={styles.root}
      component="form"
      onSubmit={handleSubmit}>

      <FormControl>
        <TextField
          className={styles.textField}
          label="Population"
          name="population"
          type="number"
          value={currentForm.value.population}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 10,
              max: 18e6
            },
          }}
          required
          helperText="Population size (10-18e6)"
        />
      </FormControl>
      <FormControl>
        <TextField
          className={styles.textField}
          label="Time End"
          name="timeEnd"
          type="number"
          value={currentForm.value.timeEnd}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 10,
              max: 1000
            },
          }}
          required
          helperText="Time the simulation ends(10-1e3)"
        />
      </FormControl>
      <FormControl>
        <TextField
          className={styles.textField}
          label="Transmission Rate"
          name="transmisstionRate"
          type="number"
          value={currentForm.value.transmissionRate}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1,
              step: 0.01,
            },
          }}
          required
          helperText="Transmission rate (0-1)"
        />
      </FormControl>
      <FormControl>
        <InputLabel id="model-type-label">Model Type</InputLabel>
        <Select
          name="modelType"
          labelId="model-type-label"
          id="demo-simple-select"
          value={currentForm.value.modelType}
          label="Model Type"
          onChange={handleSelectChange}
        >
          <MenuItem value={'model_reference'}>model_reference</MenuItem>
          <MenuItem value={'model_network'}>model_network</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained">Submit</Button>
    </Box>
  )
};

export { InputControls };
