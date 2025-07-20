
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useSignals } from "@preact/signals-react/runtime";
import { currentForm } from "@state/form-controls";
import styles from "./InputControls.module.css";

const degreeDistributions = [
  'poisson',
  'negative_binomial'
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

  // TODO: Add architype dropdown inputs for reproduction number and serial interval
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
        <TextField
          className={styles.textField}
          label="Basic reproduction number"
          name="reproductionNumber"
          type="number"
          value={currentForm.value.reproductionNumber}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1,
              step: 0.01,
            },
          }}
          required
        />
      </FormControl>
      <FormControl hiddenLabel={matches}>
        <TextField
          className={styles.textField}
          label="Serial Interval"
          name="serialInterval"
          type="number"
          value={currentForm.value.serialInterval}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 3.08,
              max: 10,
              step: 0.1,
            },
          }}
          required
        />
      </FormControl>
      <FormControl hiddenLabel={matches}>
        <TextField
          className={styles.textField}
          label="Mean degree"
          name="mu"
          type="number"
          value={currentForm.value.mu}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 100,
              step: 1,
            },
          }}
          required
        />
      </FormControl>
      <FormControl hiddenLabel={matches}>
        <TextField
          className={styles.textField}
          label="Dispersion"
          name="dispersion"
          type="number"
          value={currentForm.value.dispersion}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 10,
              step: 0.1,
            },
          }}
          required
        />
      </FormControl>
      { /* TODO: Hide these */ }
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
        />
      </FormControl>
    </Box>
  )
};

export { InputControls };
