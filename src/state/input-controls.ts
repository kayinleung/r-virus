import { computed, signal } from "@preact/signals-react";
import { v4 as uuidv4 } from "uuid";

export type FormValues = {
  population: number;
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
  id: string;
  formValues: FormValues;
  results?: DataElement[];
}
export const currentForm = signal<FormValues>({
  population: 10,
  modelType: 'model_reference',
  degreeDistribution: 'degree_distribution',
  infection: 'SEIR',
  transmissionRate: 0.25,
  infectiousnessRate: 0.1,
  recoveryRate: 0.2,
  timeEnd: 10,
  increment: 1,
  seedInfected: 1e-2,
  lambda: 3,
});
export const simulationRuns = signal<SimulationRun[]>([{
    id: uuidv4(),
    formValues: {
      ...currentForm.value,
    },
  }
]);

export const SimulaitonRunStates = {
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
};

export type SimulationRunState = typeof SimulaitonRunStates[keyof typeof SimulaitonRunStates];
export const currentSimulationRunState = signal<SimulationRunState | null>();
export const population = signal(10);
export const virusData = signal<DataElement[]>([]);
export const simulationId = computed(() => {
  return simulationRuns.value[simulationRuns.value.length - 1].id;
});