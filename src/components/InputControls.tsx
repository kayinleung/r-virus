
import { useSignals } from "@preact/signals-react/runtime";
import { archetypeCorollaries, archetypeOptions, currentForm, MAX_INDEX, MIN_INDEX, updateArchetypeCorollaries, type NumberKeys } from "@state/form-controls";

import { NumberInput, Paper, Select } from '@mantine/core';
import styles from './InputControls.module.css';
import { Refresh } from "./Refresh";
import { useState } from "preact/hooks";

const InputControls = () => {

  useSignals();

  const [repNum, setRepNum] = useState(currentForm.value.reproductionNumber);
  const [serialNum, setSerialNum] = useState(currentForm.value.serialInterval);
  const [mean, setMean] = useState(currentForm.value.mu);
  const [disp, setDisp] = useState(currentForm.value.dispersion);
  const [p, setP] = useState(currentForm.value.populationSize);

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
          value={repNum}
          min={archetypeCorollaries.value.reproductionNumber.range[MIN_INDEX]}
          max={archetypeCorollaries.value.reproductionNumber.range[MAX_INDEX]}
          onChange={(value) =>  { setRepNum(Number(value)); handleNumberChange({ field: "reproductionNumber", value: Number(value) }) }}
        />
        <NumberInput
          label="Serial Interval"
          value={serialNum}
          min={archetypeCorollaries.value.serialInterval.range[MIN_INDEX]}
          max={archetypeCorollaries.value.serialInterval.range[MAX_INDEX]}
          onChange={(value) =>  { setSerialNum(Number(value)); handleNumberChange({ field: "serialInterval", value: Number(value) }) }}
        />
        <NumberInput
          label="Mean Degree"
          value={mean}
          min={0}
          max={100}
          onChange={(value) => { setMean(Number(value)); handleNumberChange({ field: "mu", value: Number(value) }) }}
        />
        <NumberInput
          label="Dispersion"
          value={disp}
          min={0}
          max={10}
          onChange={(value) => { setDisp(Number(value)); handleNumberChange({ field: "dispersion", value: Number(value) }) }}
        />
        <NumberInput
          label="Population"
          value={p}
          min={10}
          max={1e10}
          onChange={(value) => { setP(Number(value)); handleNumberChange({ field: "populationSize", value: Number(value) }) }}
        />
      </div>
    </Paper>
  )
};

export { InputControls };
