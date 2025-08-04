
import { useSignals } from "@preact/signals-react/runtime";
import { archetypeCorollaries, archetypeOptions, currentForm, MAX_INDEX, MIN_INDEX, updateArchetypeCorollaries, type NumberKeys } from "@state/form-controls";

import { NumberInput, Paper, Select } from '@mantine/core';
import styles from './InputControls.module.css';
import { Refresh } from "./Refresh";

const InputControls = () => {

  useSignals();

  const handleArchetypeChange = (archetype: string | null) => {
    updateArchetypeCorollaries(archetype as typeof archetypeOptions[number]);
  };


  type NumberChangeProps = {
    field: NumberKeys,
    value: number;
  };
  function handleNumberChange({ field, value }: NumberChangeProps) {
    currentForm.value[field] = value;
  }

  return (
    <Paper shadow="xs" p="sm" className={styles.inputControls}>

      <Refresh className={styles.refresh} />
      <div className={styles.inputControlOptions}>
        <Select
          label="Archetype"
          value={currentForm.value.archetype}
          onChange={handleArchetypeChange}
          data={archetypeOptions}
        />
        <NumberInput
          label="Reproduction Number"
          value={currentForm.value.reproductionNumber}
          min={archetypeCorollaries.value.reproductionNumber.range[MIN_INDEX]}
          max={archetypeCorollaries.value.reproductionNumber.range[MAX_INDEX]}
          onChange={(value) => handleNumberChange({ field: "reproductionNumber", value: Number(value) }) }
        />
        <NumberInput
          label="Serial Interval"
          value={currentForm.value.serialInterval}
          min={archetypeCorollaries.value.serialInterval.range[MIN_INDEX]}
          max={archetypeCorollaries.value.serialInterval.range[MAX_INDEX]}
          onChange={(value) => handleNumberChange({ field: "serialInterval", value: Number(value) }) }
        />
        <NumberInput
          label="Mean Degree"
          value={currentForm.value.mu}
          min={0}
          max={100}
          onChange={(value) => handleNumberChange({ field: "mu", value: Number(value) }) }
        />
        <NumberInput
          label="Dispersion"
          value={currentForm.value.dispersion}
          min={0}
          max={10}
          onChange={(value) => handleNumberChange({ field: "dispersion", value: Number(value) }) }
        />
        <NumberInput
          label="Population"
          value={currentForm.value.populationSize}
          min={10}
          max={1e10}
          onChange={(value) => handleNumberChange({ field: "populationSize", value: Number(value) }) }
        />
      </div>
    </Paper>
  )
};

export { InputControls };
