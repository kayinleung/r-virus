
import { v4 as uuidv4 } from 'uuid';
import { TextField, Box, InputLabel, Select, MenuItem, SelectChangeEvent, FormControl, Fab } from '@mui/material';
import styles from "./InputControls.module.css";
import type { FormValues } from "@state/input-controls";
import type { SimulationRunState } from "@state/input-controls";
import { simulationRuns, currentForm, currentSimulationRunState, SimulaitonRunStates } from "@state/input-controls";
import { useSignals } from "@preact/signals-react/runtime";
import AutoRenewIcon from '@mui/icons-material/AutoRenew';


const InputControls = () => {

  const disableRerun = [
    SimulaitonRunStates.LOADING_R
  ].includes(currentSimulationRunState.value as SimulationRunState);

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
    currentSimulationRunState.value = SimulaitonRunStates.IN_PROGRESS;
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
      <FormControl>
        <TextField
          className={styles.textField}
          label="Infectiousness Rate"
          name="infectiousnessRate"
          type="number"
          value={currentForm.value.infectiousnessRate}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1,
              step: 0.01,
            },
          }}
          required
          helperText="Infectiousness rate (0-1)"
        />
      </FormControl>
      <FormControl>
        <TextField
          className={styles.textField}
          label="Recovery Rate"
          name="recoveryRate"
          type="number"
          value={currentForm.value.recoveryRate}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1,
              step: 0.01,
            },
          }}
          required
          helperText="Recovery rate (0-1)"
        />
      </FormControl>
      <FormControl>
        <TextField
          className={styles.textField}
          label="Time Increment"
          name="increment"
          type="number"
          value={currentForm.value.increment}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: currentForm.value.timeEnd,
              step: 0.01,
            },
          }}
          required
          helperText={`Time increment (0-${currentForm.value.timeEnd})`}
        />
      </FormControl>
      <FormControl>
        <TextField
          className={styles.textField}
          label="Seed Infected"
          name="seedInfected"
          type="number"
          value={currentForm.value.seedInfected}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1,
              step: 1e-3,
            },
          }}
          required
          helperText="Seed infected (0-1)"
        />
      </FormControl>

      <Fab type="submit" disabled={disableRerun} color="primary" aria-label="rerun simulation with current parameters">
        <AutoRenewIcon />
      </Fab>
    </Box>
  )
};

export { InputControls };
