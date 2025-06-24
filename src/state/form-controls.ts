import { signal } from "@preact/signals-react";

export type FormValues = {
  populationSize: number;
  modelType: string;
  degreeDistribution: string;
  infection: string;
  timeEnd: number;
  increment: number;
  seedInfected: number;
  mu: number;
  dispersion: number;
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
    incidence: number;
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
  mu: 2.4,
  dispersion: 0.1,
  serialInterval: 4,
  reproductionNumber: 2.3,
});
