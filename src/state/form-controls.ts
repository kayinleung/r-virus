import { signal } from "@preact/signals-react";
import type { ModelType } from "./chart";

export type FormValues = {
  populationSize: number;
  modelType: ModelType;
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
  simulation_id: string;
  model_type: ModelType;
  time: number;
  state: {
    S: number;
    E: number;
    I: number;
    R: number;
    incidence: number;
  };

};
export type ErrorMessage = {
  simulation_id: string;
  message?: string;
}
export const currentForm = signal<FormValues>({
  populationSize: 1e2,
  modelType: 'model_reference',
  degreeDistribution: 'poisson',
  infection: 'SEIR',
  timeEnd: 75,
  increment: 1,
  seedInfected: 1e-3,
  mu: 5.4,
  dispersion: 10,
  serialInterval: 4,
  reproductionNumber: 2.3,
});
