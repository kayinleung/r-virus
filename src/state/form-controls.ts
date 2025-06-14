import { signal } from "@preact/signals-react";

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
export const currentForm = signal<FormValues>({
  populationSize: 1e7,
  modelType: 'model_network',
  degreeDistribution: 'poisson',
  infection: 'SEIR',
  transmissionRate: 0.4,
  infectiousnessRate: 0.3,
  recoveryRate: 0.2,
  timeEnd: 250,
  increment: 1,
  seedInfected: 1e-2,
  lambda: 3,
});
