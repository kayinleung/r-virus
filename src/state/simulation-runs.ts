import { computed, signal } from "@preact/signals-react";
import { v4 as uuidv4 } from "uuid";
import { currentForm, DataElement, FormValues } from "@state/form-controls";

export type SimulationRun = {
  formValues: FormValues;
  results?: DataElement[];
  runNumber: number;
};

export type SimulationRunState = typeof SimulaitonRunStates[keyof typeof SimulaitonRunStates];

const initialUuid = uuidv4();
export const simulationId = signal<string>(initialUuid);
export const simulationRuns = signal<Record<string, SimulationRun>>({
  [initialUuid]: {
    formValues: {
      ...currentForm.value,
    },
    results: [],
    runNumber: 1,
  },
});

export const plottedSimulationId = signal<string>(initialUuid);

export const SimulaitonRunStates = {
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
};


export const simulationRun = computed(() => simulationRuns.value[plottedSimulationId.value].results ?? []);
export const simulationRunNumber = computed(() => simulationRuns.value[simulationId.value].runNumber);


export const currentSimulationRunState = computed(() => {
  const currentRun = simulationRuns.value[simulationId.value].results ?? [];
  if (currentRun?.length === 0) {
    return SimulaitonRunStates.LOADING_R;
  }

  if (currentRun?.length > 0 && currentRun?.[currentRun.length - 1].time >= currentForm.value.timeEnd) {
    return SimulaitonRunStates.COMPLETED;
  }
})