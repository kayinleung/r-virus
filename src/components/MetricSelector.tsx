import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { StateKey, StateKeys, selectedMetric } from '@state/chart';

const MetricSelector = () => {

  const handleSelectChange = (event: SelectChangeEvent) => {
    selectedMetric.value = event.target.value as StateKey;
  };

  return (
    <FormControl>
      <InputLabel id="simulation-selector-label">Metric</InputLabel>
      
      <Select
        name="selectedMetric"
        labelId="metric-selector-label"
        value={selectedMetric.value}
        label="Metric"
        onChange={handleSelectChange}
      >
        {Object.entries(StateKeys).map(([key, { value, label }]) => (
          <MenuItem key={key} value={value}>{label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { MetricSelector };