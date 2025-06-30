import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { displayedRunId, simulationRuns } from '@state/simulation-runs';

const SimulationSelector = () => {
  const selectedRunNumber = String(displayedRunId.value);
  const runs = Object.entries(simulationRuns.value);

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { value: runNumber } = event.target;
    displayedRunId.value = Number(runNumber);
  };

  return (
    <FormControl>
      <InputLabel id="simulation-selector-label">Select Simulation Run</InputLabel>
      
      <Select
        name="selectedRun"
        labelId="simulation-selector-label"
        value={selectedRunNumber}
        label="Model Type"
        onChange={handleSelectChange}
      >
        {runs.map(([runId, simulation]) => (
          <MenuItem key={runId} value={runId}>
            {`Run #${runId}: serial interval=${simulation.formValues.serialInterval}, reproduction number=${simulation.formValues.reproductionNumber}, mean degree=${simulation.formValues.mu}, dispersion=${simulation.formValues.dispersion}, population size=${simulation.formValues.populationSize}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { SimulationSelector };
