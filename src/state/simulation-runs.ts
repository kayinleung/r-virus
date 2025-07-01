import { computed, signal } from "@preact/signals-react";
import { currentForm, DataElement, FormValues } from "@state/form-controls";
import { ModelType } from "./chart";

const INITIAL_RUN_ID = 1;

export type SimulationRun = {
  formValues: FormValues;
  status: MultiRunStatus
  results: {
    [simulationId: string]: {
      modelType: ModelType
      data: DataElement[];
      status: SimulationRunStatus;
    };
  };
};

export type MultiSimulationRun = {
  [runId: number]: SimulationRun;
};

export const MultiRunStatuses = {
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;


export const SimulationRunStatuses = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;

export type MultiRunStatus = keyof typeof MultiRunStatuses;
export type SimulationRunStatus = keyof typeof SimulationRunStatuses;

export const displayedRunId = signal<number>(INITIAL_RUN_ID);

export const simulationRuns = signal<MultiSimulationRun>({
  [INITIAL_RUN_ID]: {
    formValues: {
      ...currentForm.value,
    },
    status: MultiRunStatuses.LOADING_R,
    results: {
    },
  },
});


export const createNewRun = () => {
  console.log('simulation-runs (before) - simulationRuns.value=', simulationRuns.value);
  // const maxRunId = Math.max(...Object.keys(simulationRuns.value).map(Number));
  console.log('simulation-runs - maxRunId=', maxRunId);
  simulationRuns.value = {
    ...simulationRuns.value,
    [(maxRunId.value ?? INITIAL_RUN_ID) + 1]: {
      formValues: {
        ...currentForm.value,
      },
      status: MultiRunStatuses.IN_PROGRESS,
      results: {
      },
    },
  };
  console.log('simulation-runs (after) - simulationRuns.value=', simulationRuns.value);
};

export const maxRunId = computed(() => {
  return Math.max(...Object.keys(simulationRuns.value).map(Number));
});

export const executingSimulationRunNumber = computed(() => {
  return Math.max(...Object.keys(simulationRuns.value).map(Number));
});

export const displayedSimulationRun = computed(() => simulationRuns.value[displayedRunId.value]);

export const currentSimulationRunStatus = computed(() => {
  const hasSimulationStillRunning = Object.entries(simulationRuns.value[maxRunId.value].results).some(([_, result]) => {
    return result.status === SimulationRunStatuses.IN_PROGRESS;
  });
  if (hasSimulationStillRunning) {
    return MultiRunStatuses.IN_PROGRESS;
  }
  return MultiRunStatuses.COMPLETED;
});

type SetSimulationStatusProps = {
  simulationId: string;
  status: SimulationRunStatus;
};
export const setSimulationRunStatus = ({simulationId, status}: SetSimulationStatusProps) => {

        simulationRuns.value = {
          ...simulationRuns.value,
          [executingSimulationRunNumber.value]: {
            ...simulationRuns.value[executingSimulationRunNumber.value],
            results: {
              ...simulationRuns.value[executingSimulationRunNumber.value].results,
              [simulationId]: {
                ...simulationRuns.value[executingSimulationRunNumber.value].results[simulationId],
                status,
              }
            }
          },
        };
};