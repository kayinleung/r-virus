
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme, type SelectChangeEvent } from '@mui/material';
import { useSignals } from "@preact/signals-react/runtime";
import { archetypeCorollaries, archetypeOptions, currentForm, MAX_INDEX, MIN_INDEX, updateArchetypeCorollaries } from "@state/form-controls";
import styles from "./InputControls.module.css";


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
    
    if (name === "archetype") {
      // Use the specialized function for archetype changes
      // The value must be one of the options in archetypeOptions
      updateArchetypeCorollaries(value as typeof archetypeOptions[number]);
      return;
    }
    // Handle other select changes normally
    currentForm.value = {
      ...currentForm.value,
      [name]: value,
    };
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const hasReproductionNumberError = !!currentForm.value.reproductionNumber && (!Number(currentForm.value.reproductionNumber) || currentForm.value.reproductionNumber < archetypeCorollaries.value.reproductionNumber.range[MIN_INDEX] ||
    currentForm.value.reproductionNumber > archetypeCorollaries.value.reproductionNumber.range[MAX_INDEX]);
  const hasSerialIntervalError = !!currentForm.value.serialInterval && (!Number(currentForm.value.serialInterval) || currentForm.value.serialInterval < archetypeCorollaries.value.serialInterval.range[MIN_INDEX] ||
    currentForm.value.serialInterval > archetypeCorollaries.value.serialInterval.range[MAX_INDEX]);

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
        <InputLabel id="archetype-label">Archetype</InputLabel>
        <Select
          name="archetype"
          labelId="archetype-label"
          value={currentForm.value.archetype}
          label="Archetype"
          onChange={handleSelectChange}
        >
          {archetypeOptions.map((archetype) => (
            <MenuItem key={archetype} value={archetype}>{archetype}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl hiddenLabel={matches}>
        <TextField
          error={hasReproductionNumberError}
          helperText={hasReproductionNumberError ? `Must be between ${archetypeCorollaries.value.reproductionNumber.range[MIN_INDEX]} and ${archetypeCorollaries.value.reproductionNumber.range[MAX_INDEX]}` : ''}
          className={styles.textField}
          label="Basic reproduction number"
          name="reproductionNumber"
          type="number"
          value={currentForm.value.reproductionNumber}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: archetypeCorollaries.value.reproductionNumber.range[MIN_INDEX],
              max: archetypeCorollaries.value.reproductionNumber.range[MAX_INDEX],
              step: 0.01,
            },
          }}
          required
        />
      </FormControl>
      <FormControl hiddenLabel={matches}>
        <TextField
          error={hasSerialIntervalError}
          helperText={hasSerialIntervalError ? `Must be between ${archetypeCorollaries.value.serialInterval.range[MIN_INDEX]} and ${archetypeCorollaries.value.serialInterval.range[MAX_INDEX]}` : ''}
          className={styles.textField}
          label="Serial Interval"
          name="serialInterval"
          type="number"
          value={currentForm.value.serialInterval}
          onChange={handleTextChange}
          slotProps={{
            htmlInput: {
              min: archetypeCorollaries.value.serialInterval.range[MIN_INDEX],
              max: archetypeCorollaries.value.serialInterval.range[MAX_INDEX],
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
    </Box>
  )
};

export { InputControls };
