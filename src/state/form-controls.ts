import { signal } from "@preact/signals-react";

export type FormValues = {
  populationSize: number;
  modelType: string;
  degreeDistribution: string;
  infection: string;
  timeEnd: number;
  increment: number;
  seedInfected: number;
  lambda: number;
  serialInterval: number;
  reproductionNumber: number;
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
  populationSize: 1e7,
  modelType: 'model_reference',
  degreeDistribution: 'poisson',
  infection: 'SEIR',
  timeEnd: 250,
  increment: 1,
  seedInfected: 1e-3,
  lambda: 3,
  serialInterval: 4,
  reproductionNumber: 2.3,
});
