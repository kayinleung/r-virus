import { computed, signal } from "@preact/signals-react";
import { v4 as uuidv4 } from "uuid";

export type FormValues = {
  populationSize: number;
  modelType: string;
  degreeDistribution: string;
  infection: string;
  transmissionRate: number;
  infectiousnessRate: number;
  recoveryRate: number;
  timeEnd: number;
  increment: number;
  seedInfected: number;
  lambda: number;
};

export type DataElement = {
  time: number;
  S: number,
  E: number,
  I: number,
  R: number
};
export type SimulationRun = {
  formValues: FormValues;
  results?: DataElement[];
  runNumber: number;
};
export const currentForm = signal<FormValues>({
  populationSize: 1e5,
  modelType: 'model_reference',
  degreeDistribution: 'degree_distribution',
  infection: 'SEIR',
  transmissionRate: 0.15,
  infectiousnessRate: 0.1,
  recoveryRate: 0.2,
  timeEnd: 100,
  increment: 1,
  seedInfected: 1e-2,
  lambda: 3,
});

export type SimulationRunState = typeof SimulaitonRunStates[keyof typeof SimulaitonRunStates];
export const currentSimulationRunState = signal<SimulationRunState | null>();

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