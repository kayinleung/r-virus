import { computed, signal } from "@preact/signals-react";
import { currentForm, DataElement, FormValues } from "@state/form-controls";
import { ModelType } from "./chart";

const INITIAL_RUN_ID = 1;

export type SimulationRun = {
  formValues: FormValues;
  status: SimulationRunState
  results: {
    [simulationId: string]: {
      modelType: ModelType
      data: DataElement[];
    };
  };
};

export type MultiSimulationRun = {
  [runId: number]: SimulationRun;
};

export const SimulaitonRunStates = {
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;

export type SimulationRunState = keyof typeof SimulaitonRunStates;

export const displayedRunId = signal<number>(INITIAL_RUN_ID);

export const simulationRuns = signal<MultiSimulationRun>({
  [INITIAL_RUN_ID]: {
    formValues: {
      ...currentForm.value,
    },
    status: SimulaitonRunStates.LOADING_R,
    results: {
    },
  },
});


export const createNewRun = () => {
  simulationRuns.value = {
    ...simulationRuns.value,
    [(maxRunId?.value ?? INITIAL_RUN_ID) + 1]: {
      formValues: {
        ...currentForm.value,
      },
      status: SimulaitonRunStates.LOADING_R,
      results: {
      },
    },
  };
};

export const maxRunId = computed(() => {
  return Math.max(...Object.keys(simulationRuns.value).map(Number));
});

export const executingSimulationRunNumber = signal<number>(1);

export const displayedSimulationRun = computed(() => simulationRuns.value[displayedRunId.value]);

export const currentSimulationRunStatus = computed(() => simulationRuns.value[maxRunId.value].status);