import { signal } from "@preact/signals-react";

export const ModelReferences = {
  model_reference: { value: 'model_reference', label: 'Reference' },
  model_network: { value: 'model_network', label: 'Network: Poisson' },
  model_network_nb: { value: 'model_network_nb', label: 'Network: Negative Binomial' },
 } as const;
export const ModelTypes = Object.values(ModelReferences).map(model => model.value);
export type ModelType = keyof typeof ModelReferences;


export const StateKeys = {
  S: { value: 'S', label: 'Susceptible' },
  E: { value: 'E', label: 'Exposed' },
  I: { value: 'I', label: 'Infected' },
  R: { value: 'R', label: 'Recovered' },
  incidence: {value: 'incidence', label: 'Incidence' },
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
  incidence: {label: 'Incidence', color: '#000000' }
};

export const selectedMetric = signal<StateKey>(StateKeys.I.value);