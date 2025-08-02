import { Select } from '@mantine/core';
import { useSignal } from '@preact/signals-react';
import { StateKey, StateKeys, selectedMetric } from '@state/chart';

const MetricSelector = () => {

  useSignal();

  const handleSelectChange = (value: string | null) => {
    selectedMetric.value = value as StateKey;
  };

  return (

    <Select
      label="Metric"
      value={selectedMetric.value}
      onChange={handleSelectChange}
      data={Object.entries(StateKeys).map(([key, { label }]) => ({ value: key, label }))}
    />
  );
};

export { MetricSelector };