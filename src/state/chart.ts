import { signal } from "@preact/signals-react";

export const ModelReferences = {
  model_reference: { value: 'model_reference', label: 'Model Reference' },
  model_network: { value: 'model_network', label: 'Model Network' },
 } as const;
export const ModelTypes = Object.values(ModelReferences).map(model => model.value);
export type ModelType = keyof typeof ModelReferences;


export const StateKeys = {
  S: { value: 'S', label: 'Susceptible' },
  E: { value: 'E', label: 'Exposed' },
  I: { value: 'I', label: 'Infected' },
  R: { value: 'R', label: 'Recovered' },
} as const;

export type StateKey = keyof typeof StateKeys;
export type InfectionStateMap = Record<StateKey, {
  label: string;
  color: string;
}>;

export const infectionStates: InfectionStateMap = {
  S: { label: 'Susceptible', color: '#1f77b4' },
  E: { label: 'Exposed', color: '#ff7f0e' },
  I: { label: 'Infected', color: '#2ca02c' },
  R: { label: 'Recovered', color: '#d62728' },
};

export const selectedMetric = signal<StateKey>(StateKeys.I.value);