import { computed, signal } from "@preact/signals-react";
import { currentForm, DataElement, FormValues } from "@state/form-controls";
import { ModelType } from "./chart";

const INITIAL_RUN_ID = 1;

export type LoadingChart = {
  status: SimulationRunStatus;
  modelType: ModelType;
};

export type LoadedChart = {
  modelType: ModelType;
  data: DataElement[];
  status: SimulationRunStatus;
};

export type Chart = LoadingChart | LoadedChart;


export type SimulationRun = {
  formValues: FormValues;
  status: MultiRunStatus;
  charts: Chart[];
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
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;

export type MultiRunStatus = keyof typeof MultiRunStatuses;
export type SimulationRunStatus = keyof typeof SimulationRunStatuses;

export const displayedRunId = signal<number>(INITIAL_RUN_ID);
export const maxRunId = signal<number>(INITIAL_RUN_ID);

export const simulationRuns = signal<MultiSimulationRun>({
  [INITIAL_RUN_ID]: {
    formValues: {
      ...currentForm.value,
    },
    status: MultiRunStatuses.LOADING_R,
    charts: [],
  },
});


export const createNewRun = () => {
  maxRunId.value += 1;
  simulationRuns.value = {
    ...simulationRuns.value,
    [maxRunId.value]: {
      formValues: {
        ...currentForm.value,
      },
      status: MultiRunStatuses.IN_PROGRESS,
      charts: [],
    },
  };
};

export const executingSimulationRunNumber = computed(() => {
  return Math.max(...Object.keys(simulationRuns.value).map(Number));
});

export const displayedSimulationRun = computed(() => simulationRuns.value[displayedRunId.value]);

export const currentSimulationRunStatus = computed(() => {
  const hasSimulationStillRunning = Object.entries(simulationRuns.value[maxRunId.value].charts).some(([_, result]) => {
    return result.status === SimulationRunStatuses.IN_PROGRESS;
  });
  if (hasSimulationStillRunning) {
    return MultiRunStatuses.IN_PROGRESS;
  }
  return MultiRunStatuses.COMPLETED;
});

type SetSimulationStatusProps = {
  modelType: ModelType;
  status: SimulationRunStatus;
};
export const setSimulationRunStatus = ({modelType, status}: SetSimulationStatusProps) => {

  const existingCharts = simulationRuns.value[executingSimulationRunNumber.value].charts;

  const updatedChart = existingCharts.find((chart) => chart.modelType === modelType);

  if( !updatedChart ) {
    console.error(`Simulation of type ${modelType} in run ${executingSimulationRunNumber.value} not found.`);
    return;
  }
  simulationRuns.value = {
    ...simulationRuns.value,
    [executingSimulationRunNumber.value]: {
      ...simulationRuns.value[executingSimulationRunNumber.value],
      charts: existingCharts.map((chart) =>
        chart.modelType === modelType
          ? {
              ...updatedChart,
              status,
            }
          : chart
      ),
    },
  };
};