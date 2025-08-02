import { signal } from "@preact/signals-react";

export const ModelReferences = {
  model_reference: { value: 'model_reference', label: 'Reference', order: 1 },
  model_network_poisson: { value: 'model_network_poisson', label: 'Poisson', order: 2 },
  model_network_negative_binomial: { value: 'model_network_negative_binomial', label: 'Negative Binomial', order: 3 },
  all: { value: 'all', label: 'All Models', order: 4 },
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
}>;

export const infectionStates: InfectionStateMap = {
  S: { label: 'Susceptible' },
  E: { label: 'Exposed'} ,
  I: { label: 'Infected' },
  R: { label: 'Recovered' },
  incidence: {label: 'Incidence' }
};

export const selectedMetric = signal<StateKey>(StateKeys.I.value);

export const mouseX = signal<number | null>(null);
export type MouseMetricKeys = Exclude<keyof typeof ModelReferences, 'all'>;

type MouseMetric = Record<MouseMetricKeys, number|null>;
export const mouseMetrics = signal<MouseMetric>({
  model_reference: null,
  model_network_poisson: null,
  model_network_negative_binomial: null
});

export const lineStyles = {
  [ModelReferences.model_reference.value]: {
    style: 'solid',
    dashArray: '1, 1',
    color: '#1f77b4'
  },
  [ModelReferences.model_network_poisson.value]: {
    style: 'stroke-dasharray',
    dashArray: '2, 2',
    color: '#ff7f0e'
  },
  [ModelReferences.model_network_negative_binomial.value]: {
    style: 'stroke-dasharray',
    dashArray: '5 10 15 5 10 15',
    color: '#2ca02c'
  },
};