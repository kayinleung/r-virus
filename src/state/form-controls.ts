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
  state: {
    S: number;
    E: number;
    I: number;
    R: number;
  };
};
export const currentForm = signal<FormValues>({
  populationSize: 1e2,
  modelType: 'model_reference',
  degreeDistribution: 'poisson',
  infection: 'SEIR',
  transmissionRate: 0.4,
  infectiousnessRate: 0.3,
  recoveryRate: 0.2,
  timeEnd: 25,
  increment: 1,
  seedInfected: 1e-2,
  lambda: 3,
});
