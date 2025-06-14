
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useSignals } from "@preact/signals-react/runtime";
import { currentForm } from "@state/form-controls";
import styles from "./InputControls.module.css";
const modelReferences = [
  'model_reference',
  'model_network',
];
const degreeDistributions = [
  'poisson'
];


const InputControls = () => {

  useSignals();

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

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        '& .MuiBox-root': {
          flexDirection: matches ? 'column' :  'row',
        }
      }}
      className={styles.inputControlRoot}
      component="form">
      <FormControl hiddenLabel={matches}>
        <InputLabel id="model-type-label">Model Type</InputLabel>
        <Select
          name="modelType"
          labelId="model-type-label"
          id="demo-simple-select"
          value={currentForm.value.modelType}
          label="Model Type"
          onChange={handleSelectChange}
        >
          {modelReferences.map((model) => (
            <MenuItem key={model} value={model}>{model}</MenuItem>
          ))}
        </Select>
      </FormControl>
            <FormControl hiddenLabel={matches}>
        <InputLabel id="degree-distribution-label">Degree distribution</InputLabel>
        <Select
          name="degreeDistribution"
          labelId="degree-distribution-label"
          id="demo-simple-select"
          value={currentForm.value.degreeDistribution}
          label="Degree Distribution"
          onChange={handleSelectChange}
        >
          {degreeDistributions.map((distribution) => (
            <MenuItem key={distribution} value={distribution}>{distribution}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl hiddenLabel={matches}>
        <TextField
          className={styles.textField}
          label="Transmission Rate"
          name="transmissionRate"
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
      <FormControl hiddenLabel={matches}>
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
      <FormControl hiddenLabel={matches}>
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
      <FormControl hiddenLabel={matches}>
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
      <FormControl hiddenLabel={matches}>
        <TextField
          className={styles.textField}
          label="Population"
          name="populationSize"
          type="number"
          value={currentForm.value.populationSize}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 10,
              max: 1e10
            },
          }}
          required
          helperText="Population size (10-1e10)"
        />
      </FormControl>
      <FormControl hiddenLabel={matches}>
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
      <FormControl hiddenLabel={matches}>
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
      <FormControl hiddenLabel={matches}>
        <TextField
          className={styles.textField}
          label="1/mean degree (λ)"
          name="lambda"
          type="number"
          value={currentForm.value.lambda}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 100,
              step: 1,
            },
          }}
          required
          helperText={`lamdbda (0-100)`}
        />
      </FormControl>
    </Box>
  )
};

export { InputControls };
