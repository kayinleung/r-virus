
import { useSignals } from "@preact/signals-react/runtime";
import { archetypeCorollaries, archetypeOptions, currentForm, MAX_INDEX, MIN_INDEX, updateArchetypeCorollaries } from "@state/form-controls";

import { useForm } from '@mantine/form';
import { NumberInput, Paper, Select } from '@mantine/core';
import styles from './InputControls.module.css';
import { Refresh } from "./Refresh";
import { useEffect } from "preact/hooks";

const InputControls = () => {

  useSignals();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      reproductionNumber: currentForm.value.reproductionNumber,
      serialInterval: currentForm.value.serialInterval,
      mu: currentForm.value.mu,
      dispersion: currentForm.value.dispersion,
      populationSize: currentForm.value.populationSize,
      seedInfected: currentForm.value.seedInfected,
    },
    validate: {
      reproductionNumber: (value) => validate({
        value,
        range: [
          archetypeCorollaries.value?.reproductionNumber.range[MIN_INDEX] as number, archetypeCorollaries.value?.reproductionNumber.range[MAX_INDEX] as number
        ]
      }),
      serialInterval: (value) => validate({
        value,
        range: [
          archetypeCorollaries.value?.serialInterval.range[MIN_INDEX] as number, archetypeCorollaries.value?.serialInterval.range[MAX_INDEX] as number
        ]
      }),
      mu: (value) => validate({ value, range: [0, 100] }),
      dispersion: (value) => validate({ value, range: [0, 10] }),
      populationSize: (value) => validate({ value, range: [10, 1e10] }),
      seedInfected: (value) => validate({ value, range: [1, 10] }),
    },

    onValuesChange: (values) => {
      currentForm.value = {
        ...currentForm.value,
        ...values
      };
      form.validate();
    },
  });

  useEffect(() => {
    form.validate();
  });

  const handleArchetypeChange = (archetype: string | null) => {
    updateArchetypeCorollaries(archetype as typeof archetypeOptions[number]);
    form.validate();
  };

  type ValidateProps = { value: number; range: [number, number] };

  const validate = ({ value, range }: ValidateProps) => {
    if (value < range[MIN_INDEX] || value > range[MAX_INDEX]) {
      return `Range: ${range[MIN_INDEX]} - ${range[MAX_INDEX]}`;
    }
    return null;
  };


  return (
    <Paper shadow="xs" p="sm" className={styles.inputControls}>

      <Refresh className={styles.refresh} />
      <form className={styles.inputControlOptions}>
        <Select
          label="Archetype"
          value={currentForm.value.archetype}
          onChange={handleArchetypeChange}
          data={archetypeOptions}
        />
        <NumberInput
          {...form.getInputProps('reproductionNumber')}
          label="Reproduction Number"
          value={currentForm.value.reproductionNumber}
        />
        <NumberInput
          {...form.getInputProps('serialInterval')}
          label="Serial Interval"
          value={currentForm.value.serialInterval}
        />
        <NumberInput
          {...form.getInputProps('mu')}
          label="Mean Degree"
          value={currentForm.value.mu}
        />
        <NumberInput
          {...form.getInputProps('dispersion')}
          label="Dispersion"
          value={currentForm.value.dispersion}
        />
        <NumberInput
          {...form.getInputProps('populationSize')}
          clampBehavior="none"
          label="Population"
          value={currentForm.value.populationSize}
        />
      </form>
    </Paper>
  )
};

export { InputControls };
