import { Select } from '@mantine/core';
import { displayedRunId, simulationRuns } from '@state/simulation-runs';

const SimulationSelector = () => {
  const selectedRunNumber = String(displayedRunId.value);
  const runs = Object.entries(simulationRuns.value);

  const handleChange = (value: string | null) => {
    displayedRunId.value = Number(value);
  };

  return (

    <Select
      label="Select Run"
      value={selectedRunNumber}
      onChange={handleChange}
      data={runs.map(([runId, simulation]) => {
        return { value: runId, label: `Run #${runId}: serial interval=${simulation.formValues.serialInterval}, reproduction number=${simulation.formValues.reproductionNumber}, mean degree=${simulation.formValues.mu}, dispersion=${simulation.formValues.dispersion}, population size=${simulation.formValues.populationSize}` };
      })}
    />
  );
};

export { SimulationSelector };
