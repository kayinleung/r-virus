import { Select } from '@mantine/core';
import { StateKey, StateKeys, selectedMetric } from '@state/chart';
import { currentForm } from '@state/form-controls';

const MetricSelector = () => {

  const handleSelectChange = (value: string | null) => {
    selectedMetric.value = value as StateKey;
  };

  return (

    <Select
      label="Metric"
      value={currentForm.value.archetype}
      onChange={handleSelectChange}
      data={Object.entries(StateKeys).map(([key, { label }]) => ({ value: key, label }))}
    />
  );
};

export { MetricSelector };