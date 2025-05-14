import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { plottedSimulationId, SimulationRun, simulationRuns } from '../state/input-controls';

const SimulationSelector = () => {
  // const runs = simulationRun.value; // Assuming simulationRun contains an array of runs
  const selectedRunUuid = plottedSimulationId.value;
  const plottedSimulation = simulationRuns.value[selectedRunUuid];
  const selectedRunNumber = String(plottedSimulation?.runNumber);

  const runs = Object.entries(simulationRuns.value);

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { value: runNumber } = event.target;
    const [plottedSimulationUuid, _] = runs.find(([_, run]) => run.runNumber === Number(runNumber)) as [string, SimulationRun];
    plottedSimulationId.value = plottedSimulationUuid;
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="simulation-selector-label">Select Simulation Run</InputLabel>
      
      <Select
        name="selectedRun"
        labelId="simulation-selector-label"
        value={selectedRunNumber}
        label="Model Type"
        onChange={handleSelectChange}
      >
        {runs.map(([runUuid, simulation]) => (
          <MenuItem key={runUuid} value={simulation.runNumber}>
            {`Run #${simulation.runNumber}: escape2024(${simulation.formValues.transmissionRate}, ${simulation.formValues.infectiousnessRate}, ${simulation.formValues.recoveryRate}, ${simulation.formValues.timeEnd}, ${simulation.formValues.populationSize}, ${simulation.formValues.seedInfected}, ${simulation.formValues.increment})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SimulationSelector;